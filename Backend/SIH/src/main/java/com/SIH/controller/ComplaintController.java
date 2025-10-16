package com.SIH.controller;

import com.SIH.config.JwtUtil;
import com.SIH.model.Complaint;
import com.SIH.model.ComplaintStatus;
import com.SIH.model.ComplaintUpdate;
import com.SIH.service.AiService;
import com.SIH.service.ComplaintService;
import com.SIH.repository.ComplaintRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import websocket.RealTimeEventPublisher;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/complaints")
@RequiredArgsConstructor
public class ComplaintController {

    private final ComplaintService complaintService;
    private final ComplaintRepository complaintRepository;
    private final AiService aiService;
    private final JwtUtil jwtUtil;
    private RealTimeEventPublisher eventPublisher;


   private Set<String> categories =Set.of(
            "Garbage",
            "Street Light",
            "Pothole",
            "Water Leakage",
            "Open Drain",
            "Illegal Construction",
            "Traffic Signal",
            "Public Transport",
            "Unsafe Building",
            "Tree Cutting",
            "Mosquito Breeding",
            "Pollution",
            "Corruption",
            "Health Facility",
            "School Issue"
   );

    // -------------------------
    // Helper: Extract email from JWT
    // -------------------------
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


    // -------------------------
    // File a complaint
    // -------------------------
    @PostMapping
    public ResponseEntity<?> fileComplaint(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("latitude") Double latitude,
            @RequestParam("longitude") Double longitude,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "subcategory", required = false) String subcategory,
            @RequestParam(value = "image", required = false) MultipartFile image,
            HttpServletRequest request) {

        String email = getUserEmail(request);
        if (email == null) return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));

        try {
            String imageUrl = null;
            String detectedCategory = category != null ? category : "OTHER";

            if (image != null && !image.isEmpty()) {
                String fileName = System.currentTimeMillis() + "_" + Objects.requireNonNull(image.getOriginalFilename()).replaceAll("\\s+", "_");
                Path path = Paths.get("uploads").resolve(fileName).normalize();
                Files.createDirectories(path.getParent());
                Files.write(path, image.getBytes());
                imageUrl = "/uploads/" + fileName;

                if (category == null) {
                    detectedCategory = aiService.detectCivicIssue(image);
                }

                if(categories.contains(detectedCategory)) {
                    category="CIVIC_ISSUE";
                }else{
                    category="CYBER_ISSUE";
                }
            }

            Complaint complaint = complaintService.createComplaint(
                    title, description, category, detectedCategory, email, latitude, longitude, imageUrl
            );
//            eventPublisher.publishNewComplaint(complaint);
            return ResponseEntity.ok(Map.of(
                    "message", "Complaint filed successfully!",
                    "id", complaint.getId(),
                    "category", detectedCategory
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to file complaint", "details", e.getMessage()));
        }
    }

    // -------------------------
    // Get logged-in user's complaints
    // -------------------------
    @GetMapping("/my")
    public ResponseEntity<?> myComplaints(HttpServletRequest request) {
        String email = getUserEmail(request);
        if (email == null) return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));

        try {
            return ResponseEntity.ok(complaintService.getUserComplaints(email));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch complaints", "details", e.getMessage()));
        }
    }

    // -------------------------
    // Get complaint by ID
    // -------------------------
    @GetMapping("/{id}")
    public ResponseEntity<?> getComplaintById(@PathVariable Long id, HttpServletRequest request) {
        String email = getUserEmail(request);
        if (email == null) return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));

        try {
            Complaint complaint = complaintService.getComplaintById(id);
            if (!complaint.getFiledBy().equals(email)) {
                return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
            }
            return ResponseEntity.ok(complaint);
        } catch (Exception e) {
            return ResponseEntity.status(404).body(Map.of("error", "Complaint not found"));
        }
    }

    // -------------------------
    // Complaint updates
    // -------------------------
    @GetMapping("/{id}/updates")
    public ResponseEntity<?> getComplaintUpdates(@PathVariable Long id, HttpServletRequest request) {
        String email = getUserEmail(request);
        if (email == null) return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));

        try {
            Complaint complaint = complaintService.getComplaintById(id);
            if (!complaint.getFiledBy().equals(email)) {
                return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
            }

            return ResponseEntity.ok(complaint.getUpdates() != null ? complaint.getUpdates() : List.of());
        } catch (Exception e) {
            return ResponseEntity.status(404).body(Map.of("error", "Complaint not found"));
        }
    }

    @PostMapping("/{id}/updates")
    public ResponseEntity<?> addComplaintUpdate(@PathVariable Long id,
                                                @RequestBody Map<String, String> payload,
                                                HttpServletRequest request) {

        String email = getUserEmail(request);
        if (email == null) return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));

        try {
            Complaint complaint = complaintService.getComplaintById(id);
            if (!complaint.getFiledBy().equals(email)) {
                return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
            }

            String message = payload.get("message");
            String statusStr = payload.get("status");

            if (message == null || message.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Message is required"));
            }

            ComplaintUpdate update = new ComplaintUpdate();
            update.setMessage(message.trim());

            if (statusStr != null && !statusStr.trim().isEmpty()) {
                try {
                    ComplaintStatus status = ComplaintStatus.valueOf(statusStr.toUpperCase());
                    update.setStatus(status);
                    complaint.setStatus(status);
                    if (status == ComplaintStatus.RESOLVED) {
                        complaint.setResolvedAt(LocalDateTime.now());
                    }
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Invalid status"));
                }
            }

            if (complaint.getUpdates() == null) complaint.setUpdates(new ArrayList<>());
            complaint.getUpdates().add(update);

            complaintRepository.save(complaint);
//            eventPublisher.publishComplaintStatusUpdate(id, statusStr, update.getMessage());
            return ResponseEntity.ok(update);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to add update", "details", e.getMessage()));
        }
    }

    // -------------------------
    // Complaint statistics
    // -------------------------
    @GetMapping("/stats")
    public ResponseEntity<?> getComplaintStats() {
        try {
            Map<String, Long> stats = new HashMap<>();
            stats.put("total", complaintRepository.count());
            stats.put("pending", complaintRepository.countByStatus(ComplaintStatus.PENDING));
            stats.put("inProgress", complaintRepository.countByStatus(ComplaintStatus.IN_PROGRESS));
            stats.put("resolved", complaintRepository.countByStatus(ComplaintStatus.RESOLVED));
            stats.put("rejected", complaintRepository.countByStatus(ComplaintStatus.REJECTED));
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch statistics", "details", e.getMessage()));
        }
    }

    // -------------------------
    // Suggest category
    // -------------------------
    @PostMapping("/suggestCategory")
    public ResponseEntity<?> suggestCategory(@RequestBody Map<String, String> payload) {
        try {
            String description = payload.get("description");
            if (description == null || description.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Description is required"));
            }
            String category = complaintService.suggestCategory(description.trim());
            return ResponseEntity.ok(Map.of("category", category));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to suggest category", "details", e.getMessage()));
        }
    }

    // -------------------------
    // Get all complaints (admin/public)
    // -------------------------
    @GetMapping("/all")
    public ResponseEntity<?> getAllComplaints(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) ComplaintStatus status) {
        try {
            List<Complaint> complaints;
            if (category != null && status != null) {
                complaints = complaintService.findByCategoryAndStatus(category, status);
            } else if (category != null) {
                complaints = complaintService.findByCategory(category);
            } else if (status != null) {
                complaints = complaintService.findByStatus(status);
            } else {
                complaints = complaintService.findAll();
            }
            return ResponseEntity.ok(complaints);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch complaints", "details", e.getMessage()));
        }
    }
}
