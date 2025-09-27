package com.SIH.controller;

import com.SIH.config.JwtUtil;
import com.SIH.model.RegisterRequestResponse;
import com.SIH.model.User;
import com.SIH.service.RedisService;
import com.SIH.service.UserKafkaProducerService;
import com.SIH.service.UserService;
import com.nimbusds.jose.shaded.gson.Gson;

import jakarta.mail.internet.InternetAddress;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Map;
import java.util.Random;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class UserController {

    @Autowired
    private UserService authService;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UserKafkaProducerService userKafkaProducerService;
    @Autowired
    private RedisService redisService;

    /** Step 1: Register user → send OTP */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String name = body.get("name");

        if (!isValidEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid email format"));
        }

        redisService.set("NEW_REGISTER:" + email, body, 5 * 60);

        String otp = String.format("%06d", new Random().nextInt(999999));
        authService.saveOtp(email, otp);

        RegisterRequestResponse event = new RegisterRequestResponse();
        event.setUsername(name);
        event.setEmail(email);
        event.setBody("Your One-Time Password (OTP) is: " + otp +
                ". It is valid for 5 minutes. Do not share it.");
        String json = new Gson().toJson(event);
        userKafkaProducerService.sendUserRegistered("otp", json);

        return ResponseEntity.ok(Map.of("message", "OTP sent to your email. Please verify to complete registration."));
    }

    /** Step 2: Verify OTP → create user & return JWT */
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String otp = body.get("otp");

        if (!isValidEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid email format"));
        }

        if (!authService.verifyOtp(email, otp)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid OTP"));
        }

        Map<String, String> userData = redisService.get("NEW_REGISTER:" + email, Map.class);
        if (userData == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Session expired, please register again"));
        }
        String role = email.equals("akashadak00023@gmail.com")? "ROLE_ADMIN":"ROLE_USER";
        User user = authService.register(userData.get("name"), userData.get("email"), userData.get("password"),role);

        redisService.set("USER:" + email, user, 7 * 24 * 60 * 60);
        redisService.delete("NEW_REGISTER:" + email);

        String token = jwtUtil.generateToken(user.getEmail(), role);

        return ResponseEntity.ok(Map.of(
                "message", "OTP verified, user registered successfully",
                "token", token
        ));
    }

    /** Step 3: Login → return JWT */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        Optional<User> optionalUser = authService.login(email, password);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }

        User user = optionalUser.get();
        String role = email.equals("akashadak00023@gmail.com") ? "ROLE_ADMIN":"ROLE_USER";
        String token = jwtUtil.generateToken(user.getEmail(), role);

        redisService.set("USER:" + email, user, 7 * 24 * 60 * 60);

        return ResponseEntity.ok(Map.of(
                "message", "Login successful",
                "token", token
        ));
    }

    /** Step 4: Logout → just clear Redis */
    @PostMapping("/logout/{email}")
    public ResponseEntity<?> logout(@PathVariable String email) {
        redisService.delete("USER:" + email);
        return ResponseEntity.ok(Map.of("message", "Logout successful"));
    }

    /** Step 5: Get user profile */
    @GetMapping("/profile")
    public ResponseEntity<?> getUserDetails(HttpServletRequest request) {
        String email=getUserEmail(request);
        Object cached = redisService.get("USER:" + email, Object.class);
        if (cached != null) {
            return ResponseEntity.ok(Map.of("userDetails", cached));
        }

        Optional<User> userdata = authService.getdetailsofuser(email);
        if (userdata.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        }
        User user = userdata.get();

        User send = new User();
        send.setName(user.getName());
        send.setId(user.getId());
        send.setRole(user.getRole());

        return ResponseEntity.ok(Map.of("user", send));
    }

    /** Step 6: Request Password Reset → send OTP */
    @PostMapping("/forget-password")
    public ResponseEntity<?> forgetPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");

        if (!isValidEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid email format"));
        }
        Optional<User> userdata = authService.getdetailsofuser(email);
        if (userdata.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        }
        User user = userdata.get();

        String otp = String.format("%06d", new Random().nextInt(999999));
        authService.saveOtp(email, otp);

        RegisterRequestResponse event = new RegisterRequestResponse();
        event.setUsername(user.getName());
        event.setEmail(email);
        event.setBody("Your password reset OTP is: " + otp +
                ". It is valid for 5 minutes. Do not share it.");
        String json = new Gson().toJson(event);
        userKafkaProducerService.sendUserRegistered("password-reset", json);

        return ResponseEntity.ok(Map.of("message", "OTP sent to your email. Please verify to reset your password."));
    }

    /** Step 7: Verify OTP & Reset Password */
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String otp = body.get("otp");
        String newPassword = body.get("newPassword");

        if (!isValidEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid email format"));
        }

        if (!authService.verifyOtp(email, otp)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid OTP"));
        }

        boolean updated = authService.updatePassword(email, newPassword);
        if (!updated) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to update password"));
        }

        return ResponseEntity.ok(Map.of("message", "Password reset successful"));
    }

    /** Helper: validate email format */
    private boolean isValidEmail(String email) {
        try {
            new InternetAddress(email).validate();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private String getUserEmail(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            if (jwtUtil.validateToken(token)) {
                return jwtUtil.extractEmail(token);
            }
        }
        return null;
    }
}
