package com.SIH.controller;

import com.SIH.model.Complaint;
import com.SIH.model.ComplaintStatus;
import com.SIH.model.User;
import com.SIH.service.ComplaintService;
import com.SIH.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ComplaintService complaintService;

    @Autowired
    private UserService userService;

    /** Helper: get current authenticated user **/
    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof User) {
            return (User) auth.getPrincipal();
        }
        return null;
    }

    private boolean isAdmin(User user) {

        return user != null && "ROLE_ADMIN".equals(String.valueOf(user.getRole()));
    }

    /** Get all complaints with optional filters **/
    @GetMapping("/complaints")
    public ResponseEntity<?> getComplaints(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String subcategory,
            @RequestParam(required = false) ComplaintStatus status) {

        User user = getCurrentUser();
        if (!isAdmin(user)) {
            return ResponseEntity.status(403).body(Map.of("error", "Forbidden: Admin access only"));
        }

        try {
            List<Complaint> complaints = complaintService.getAllComplaints(category, subcategory, status);
            return ResponseEntity.ok(complaints);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch complaints"));
        }
    }

    /** Update complaint status **/
    @PutMapping("/complaints/{id}/status")
    public ResponseEntity<?> updateComplaintStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {

        User user = getCurrentUser();
        if (!isAdmin(user)) {
            return ResponseEntity.status(403).body(Map.of("error", "Forbidden: Admin access only"));
        }

        String statusStr = payload.get("status");
        if (statusStr == null || statusStr.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Status is required"));
        }

        try {
            Complaint updated = complaintService.updateStatus(id, statusStr);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to update complaint status"));
        }
    }

    /** Get complaint statistics **/
    @GetMapping("/complaints/stats")
    public ResponseEntity<?> getStats() {

        User user = getCurrentUser();
        if (!isAdmin(user)) {
            return ResponseEntity.status(403).body(Map.of("error", "Forbidden: Admin access only"));
        }

        try {
            Map<String, Long> stats = complaintService.getComplaintStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch complaint stats"));
        }
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {

        User user = getCurrentUser();
        if (!isAdmin(user)) {
            return ResponseEntity.status(403).body(Map.of("error", "Forbidden: Admin access only"));
        }

        try {
           List<User> userLists = userService.getAllUsers();
            return ResponseEntity.ok(userLists);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch users"));
        }
    }
}
