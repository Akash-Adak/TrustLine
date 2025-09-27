package com.SIH.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;

@Service
public class AiService {

    @Value("${google.api.key}")
    private String apiKey;

    private final GeminiApi geminiApi = new GeminiApi();

    public String detectCivicIssue(MultipartFile image) {
        try {
            byte[] bytes = image.getBytes();
            String base64Image = Base64.getEncoder().encodeToString(bytes);

            return geminiApi.detectCategory(base64Image, apiKey);
        } catch (Exception e) {
            e.printStackTrace();
            return "Other";
        }
    }
}
