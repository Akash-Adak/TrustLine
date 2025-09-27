package com.SIH.service;

import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;
import org.json.JSONArray;
import org.json.JSONObject;

public class GeminiApi {

    private static final String GEMINI_ENDPOINT =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=";

    public String detectCategory(String base64Image, String apiKey) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            // List of Civic + Cyber categories
            String categories = "[Garbage, Street Light, Pothole, Water Leakage, Open Drain, Illegal Construction, " +
                    "Traffic Signal, Public Transport, Unsafe Building, Tree Cutting, Mosquito Breeding, Pollution, " +
                    "Corruption, Health Facility, School Issue, " + // Civic
                    "Phishing, Credit Card Fraud, Malware, Ransomware, Identity Theft, Online Scam, " +
                    "Fake News, Cyberbullying, Hate Speech, Data Breach, Weak Password, Server Downtime, " +
                    "Poor Connectivity, Fake Apps, Other]"; // Cyber + fallback

            // Build request JSON
            JSONObject payload = new JSONObject()
                    .put("contents", new JSONArray()
                            .put(new JSONObject()
                                    .put("parts", new JSONArray()
                                            .put(new JSONObject().put("text",
                                                    "Classify this image or issue into exactly one category from the following list: " +
                                                            categories +
                                                            ". Return only the category name."))
                                            .put(new JSONObject()
                                                    .put("inline_data", new JSONObject()
                                                            .put("mime_type", "image/jpeg")
                                                            .put("data", base64Image)
                                                    ))
                                    )
                            )
                    );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> request = new HttpEntity<>(payload.toString(), headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                    GEMINI_ENDPOINT + apiKey,
                    request,
                    String.class
            );

            if (response.getStatusCode() == HttpStatus.OK) {
                JSONObject json = new JSONObject(response.getBody());
                // Gemini response -> candidates[0].content.parts[0].text
                return json.getJSONArray("candidates")
                        .getJSONObject(0)
                        .getJSONObject("content")
                        .getJSONArray("parts")
                        .getJSONObject(0)
                        .getString("text")
                        .trim();
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return "Other";
    }
}
