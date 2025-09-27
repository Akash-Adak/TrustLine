package com.SIH.service;

import com.SIH.model.RegisterRequestResponse;
import com.SIH.model.Role;
import com.SIH.model.User;
import com.SIH.repository.UserRepository;
import com.nimbusds.jose.shaded.gson.Gson;
import org.springframework.stereotype.Service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private  UserKafkaProducerService userKafkaProducerService;
    public User register(String name, String email, String rawPassword,String role) {
        if (userRepository.findByEmail(email).isPresent()) throw new RuntimeException("User exists");
        User u = User.builder()
                .name(name)
                .email(email)
                .password(passwordEncoder.encode(rawPassword))
                .provider("local")
                .role(Role.valueOf(role))
                .build();


        RegisterRequestResponse event = new RegisterRequestResponse();
        event.setUsername(u.getName());
        event.setEmail(u.getEmail());
        event.setBody("🎉 Registration successful! Welcome aboard, " + u.getName() +
                ". Your account has been created successfully.");

        String json = new Gson().toJson(event);
        userKafkaProducerService.sendUserRegistered("Users", json);
        return userRepository.save(u);
    }


    public Optional<User> login(String email, String rawPassword) {
        return userRepository.findByEmail(email).filter(u -> passwordEncoder.matches(rawPassword, u.getPassword()));
    }

private Map<String, OtpData> otpStore = new HashMap<>();

    public Optional<User> getdetailsofuser(String email) {
        return userRepository.findByEmail(email);
    }



    private static class OtpData {
        String otp;
        long expiryTime;
        OtpData(String otp, long expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }
    }

    public void saveOtp(String email, String otp) {
        long expiryTime = System.currentTimeMillis() + (5 * 60 * 1000); // 5 minutes
        otpStore.put(email, new OtpData(otp, expiryTime));
    }

    public boolean verifyOtp(String email, String otp) {
        if (!otpStore.containsKey(email)) return false;

        OtpData data = otpStore.get(email);

        if (System.currentTimeMillis() > data.expiryTime) {
            otpStore.remove(email); // expired
            return false;
        }

        boolean isValid = data.otp.equals(otp);
        if (isValid) {
            otpStore.remove(email); // OTP is one-time use
        }
        return isValid;
    }
    public boolean updatePassword(String email, String newPassword) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPassword(newPassword); // consider hashing
            userRepository.save(user);
            return true;
        }
        return false;
    }


    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
