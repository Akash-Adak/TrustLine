package com.SIH.Notification.service;


import com.SIH.Notification.model.UserRegisteredEvent;
import com.nimbusds.jose.shaded.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private EmailService emailService;

    public void processUserRegistered(String message) {
        UserRegisteredEvent event = new Gson().fromJson(message, UserRegisteredEvent.class);

        emailService.sendEmail(event.getEmail(),event.getUsername(),event.getBody());

    }

    public void processUserOtp(String message) {
        UserRegisteredEvent event = new Gson().fromJson(message, UserRegisteredEvent.class);

        emailService.sendEmail(event.getEmail(),event.getUsername(),event.getBody());
    }

    public void processComplaintDetails(String message) {
        UserRegisteredEvent event = new Gson().fromJson(message, UserRegisteredEvent.class);

        emailService.sendEmail(event.getEmail(),event.getUsername(),event.getBody());
    }

}