package com.SIH.controller;

import com.SIH.config.JwtUtil;
import com.SIH.model.RegisterRequestResponse;
import com.SIH.model.Role;
import com.SIH.model.User;
import com.SIH.repository.UserRepository;
import com.SIH.service.RedisService;
import com.SIH.service.UserKafkaProducerService;
import com.nimbusds.jose.shaded.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Component

public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
   private final UserKafkaProducerService userKafkaProducerService;
    @Autowired
    private RedisService redisService;

    @Value("${app.frontend-url}")
    private String frontendApi;

    @Value("${app.secure-cookie:true}")
    private boolean secureCookie;
    private static final String JWT_COOKIE_NAME = "JWT_TOKEN";
    public OAuth2LoginSuccessHandler(UserRepository userRepository, JwtUtil jwtUtil, UserKafkaProducerService userKafkaProducerService) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.userKafkaProducerService = userKafkaProducerService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        OAuth2User principal = (OAuth2User) authentication.getPrincipal();
        String email = principal.getAttribute("email");
        if (email == null) {
            throw new IllegalStateException("OAuth2 provider did not return email");
        }
        try {
            Map<String, Object> existingSession = redisService.get("USER:" + email, Map.class);
            if (existingSession != null) {
                String token = (String) existingSession.get("token");
                addJwtCookie(response, token);
                redirectToFrontend(response, "");
                return;
            }
        } catch (Exception e) {
            System.err.println("Redis session check failed: " + e.getMessage());
        }

        String name = principal.getAttribute("name");
        String login = principal.getAttribute("login");

        String provider = login != null ? "github" : "google";

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setProvider(provider);
            newUser.setPassword("google@user12345");
            newUser.setRole(Role.valueOf("ROLE_USER"));
            return newUser;
        });

        user.setName(name != null ? name : login);
        userRepository.save(user);

        String token = jwtUtil.generateToken(email,"ROLE_USER");

        Map<String, Object> sessionData = new HashMap<>();
        sessionData.put("token", token);
        sessionData.put("email", email);
        sessionData.put("name", user.getName());

        sessionData.put("provider", user.getProvider());

        try {
            redisService.set("USER:" + email, sessionData, 7 * 24 * 60 * 60);
        } catch (Exception e) {
            System.err.println("Failed to save session in Redis: " + e.getMessage());
        }

        // Add JWT cookie
        addJwtCookie(response, token);

        // Redirect to frontend
        String queryParams = "?login=success&email=" + URLEncoder.encode(user.getEmail(), StandardCharsets.UTF_8)
                + "&provider=" + URLEncoder.encode(provider, StandardCharsets.UTF_8);
        RegisterRequestResponse event = new RegisterRequestResponse();
        event.setUsername(user.getName());
        event.setEmail(user.getEmail());
        event.setBody("🎉 Google login successful! Welcome back, " + user.getName());

        String json = new Gson().toJson(event);

        userKafkaProducerService.sendUserRegistered("Users", json);

        redirectToFrontend(response, queryParams);
    }

    private void addJwtCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie(JWT_COOKIE_NAME, token);
        cookie.setHttpOnly(true);
        cookie.setSecure(secureCookie); // true only if frontend uses HTTPS
        cookie.setPath("/");
        cookie.setMaxAge(7 * 24 * 60 * 60); // 7 days

        // Set domain only for production
        if (!frontendApi.contains("localhost")) {
            cookie.setDomain("reqnest.com");
        }

        response.addCookie(cookie);
    }

    private void redirectToFrontend(HttpServletResponse response, String queryParams) throws IOException {
        String redirectUrl = frontendApi+ "/oauth2/callback" + queryParams;
        response.sendRedirect(redirectUrl);
    }




}



