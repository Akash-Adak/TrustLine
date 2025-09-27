package com.SIH.service;

import com.SIH.model.*;
import com.SIH.repository.ComplaintRepository;
import com.SIH.repository.UserRepository;
import com.nimbusds.jose.shaded.gson.Gson;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
//import websocket.RealTimeEventPublisher;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
//    private final UserKafkaProducerService kafkaProducerService;
    private final UserKafkaProducerService userKafkaProducerService;
    private final UserRepository userRepository;



    public Complaint createComplaint(String title, String description, String category,
                                     String subcategory, String userEmail, Double lat,
                                     Double lng, String imageUrl) {

        Complaint complaint = Complaint.builder()
                .title(title)
                .description(description)
                .category(category)
                .subcategory(subcategory)
                .filedBy(userEmail)
                .latitude(lat)
                .longitude(lng)
                .imageUrl(imageUrl)
                .status(ComplaintStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .priority("LOW")
                .build();

        Complaint saved = complaintRepository.save(complaint);

        // ✅ Send Kafka event for complaint creation
        Map<String, Object> event = new HashMap<>();
        event.put("complaintId", saved.getId());
        event.put("filedBy", userEmail);
        event.put("title", title);
        event.put("category", category);
        event.put("timestamp", LocalDateTime.now().toString());

        String json = new Gson().toJson(event);
        userKafkaProducerService.sendUserRegistered("ComplaintService", json);

        return saved;
    }


    // Overloaded method for backward compatibility
    public Complaint createComplaint(String title, String description, String category,
                                     String userEmail, Double lat, Double lng, String imageUrl) {
        return createComplaint(title, description, category, null, userEmail, lat, lng, imageUrl);
    }

    public List<Complaint> getUserComplaints(String email) {
        return complaintRepository.findByFiledBy(email);
    }

    public Complaint updateStatus(Long id, ComplaintStatus status) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        complaint.setStatus(status);
        complaint.setUpdatedAt(LocalDateTime.now());

        // Set resolved time if status is RESOLVED
        if (status == ComplaintStatus.RESOLVED) {
            complaint.setResolvedAt(LocalDateTime.now());
        }

        return complaintRepository.save(complaint);
    }

    public Complaint updateStatus(Long id, String status) {
        ComplaintStatus complaintStatus;
        try {
            complaintStatus = ComplaintStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + status);
        }
        return updateStatus(id, complaintStatus);
    }

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    public Complaint getComplaintById(Long id) {
        return complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
    }

    public String suggestCategory(String description) {
        if (description == null || description.trim().isEmpty()) {
            return "OTHER";
        }

        String desc = description.toLowerCase();

        // Cyber crime detection
        if (desc.contains("hack") || desc.contains("phish") || desc.contains("scam") ||
                desc.contains("fraud") || desc.contains("cyber") || desc.contains("online") ||
                desc.contains("upi") || desc.contains("bank") || desc.contains("account") ||
                desc.contains("password") || desc.contains("email") || desc.contains("social media")) {
            return "CYBER_CRIME";
        }

        // Civic issues detection
        if (desc.contains("road") || desc.contains("pothole") || desc.contains("street")) {
            return "CIVIC_ISSUE";
        } else if (desc.contains("garbage") || desc.contains("waste") || desc.contains("trash")) {
            return "CIVIC_ISSUE";
        } else if (desc.contains("water") || desc.contains("drainage") || desc.contains("pipe")) {
            return "CIVIC_ISSUE";
        } else if (desc.contains("electricity") || desc.contains("light") || desc.contains("power")) {
            return "CIVIC_ISSUE";
        } else if (desc.contains("traffic") || desc.contains("signal") || desc.contains("road safety")) {
            return "CIVIC_ISSUE";
        }

        return "OTHER";
    }

    public List<Complaint> findAll() {
        return complaintRepository.findAll();
    }

    public List<Complaint> findByCategory(String category) {
        return complaintRepository.findByCategory(category);
    }

    public List<Complaint> findByStatus(ComplaintStatus status) {
        return complaintRepository.findByStatus(status);
    }

    public List<Complaint> findByCategoryAndStatus(String category, ComplaintStatus status) {
        return complaintRepository.findByCategoryAndStatus(category, status);
    }

    public List<Complaint> getComplaintsByCategory(String category) {
        return complaintRepository.findByCategory(category);
    }

    public List<Complaint> getCivicComplaints(String subcategory) {
        if (subcategory == null || subcategory.isEmpty()) {
            return complaintRepository.findByCategory("CIVIC_ISSUE");
        }
        return complaintRepository.findByCategoryAndSubcategory("CIVIC_ISSUE", subcategory);
    }

    public Map<String, Long> getComplaintStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("total", complaintRepository.count());
        stats.put("pending", complaintRepository.countByStatus(ComplaintStatus.PENDING));
        stats.put("inProgress", complaintRepository.countByStatus(ComplaintStatus.IN_PROGRESS));
        stats.put("resolved", complaintRepository.countByStatus(ComplaintStatus.RESOLVED));
        stats.put("rejected", complaintRepository.countByStatus(ComplaintStatus.REJECTED));

        return stats;
    }

    // Add complaint update
    public Complaint addComplaintUpdate(Long complaintId, String message, ComplaintStatus status) {
        Complaint complaint = getComplaintById(complaintId);

        // Create new update
        ComplaintUpdate update = new ComplaintUpdate();
        update.setMessage(message);
        update.setStatus(status);
        update.setCreatedAt(LocalDateTime.now());

        // Add to complaint updates list
        if (complaint.getUpdates() == null) {
            complaint.setUpdates(new ArrayList<>());
        }
        complaint.getUpdates().add(update);

        // Update main status if provided
        if (status != null) {
            complaint.setStatus(status);
            if (status == ComplaintStatus.RESOLVED) {
                complaint.setResolvedAt(LocalDateTime.now());
            }
        }

        complaint.setUpdatedAt(LocalDateTime.now());
        return complaintRepository.save(complaint);
    }

    public List<Complaint> findFiltered(String category, String subcategory, ComplaintStatus status) {
        if (category != null && subcategory != null && status != null) {
            return complaintRepository.findByCategoryAndSubcategoryAndStatus(category, subcategory, status);
        } else if (category != null && subcategory != null) {
            return complaintRepository.findByCategoryAndSubcategory(category, subcategory);
        } else if (category != null && status != null) {
            return complaintRepository.findByCategoryAndStatus(category, status);
        } else if (category != null) {
            return complaintRepository.findByCategory(category);
        } else if (status != null) {
            return complaintRepository.findByStatus(status);
        } else {
            return complaintRepository.findAll();
        }
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    public List<Complaint> getAllComplaints(String category, String subcategory, ComplaintStatus status) {
        if (category != null && !category.isEmpty() && subcategory != null && !subcategory.isEmpty() && status != null) {
            return complaintRepository.findByCategoryAndSubcategoryAndStatus(category, subcategory, status);
        } else if (category != null && !category.isEmpty() && subcategory != null && !subcategory.isEmpty()) {
            return complaintRepository.findByCategoryAndSubcategory(category, subcategory);
        } else if (category != null && !category.isEmpty() && status != null) {
            return complaintRepository.findByCategoryAndStatus(category, status);
        } else if (category != null && !category.isEmpty()) {
            return complaintRepository.findByCategory(category);
        } else if (status != null) {
            return complaintRepository.findByStatus(status);
        } else {
            return complaintRepository.findAll();
        }
    }








}