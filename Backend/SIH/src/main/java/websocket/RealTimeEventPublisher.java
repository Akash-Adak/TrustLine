package websocket;

import com.SIH.model.AdminStats;
import com.SIH.model.Complaint;
import com.SIH.model.User;
import com.SIH.service.AdminStatsService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class RealTimeEventPublisher {

    @Autowired
    private AdminStatsService adminStatsService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public void publishComplaintStatusUpdate(Long complaintId, String oldStatus, String newStatus) {
        Map<String, Object> event = new HashMap<>();
        event.put("type", "STATUS_UPDATE");
        event.put("complaintId", complaintId);
        event.put("oldStatus", oldStatus);
        event.put("status", newStatus);
        event.put("timestamp", System.currentTimeMillis());

        AdminWebSocketHandler.broadcastToAdmins(convertToJson(event));
        publishUpdatedStats();
    }

    public void publishNewComplaint(Complaint complaint) {
        Map<String, Object> event = new HashMap<>();
        event.put("type", "NEW_COMPLAINT");
        event.put("complaint", convertComplaintToMap(complaint));
        event.put("timestamp", System.currentTimeMillis());

        AdminWebSocketHandler.broadcastToAdmins(convertToJson(event));
        publishUpdatedStats();
    }

    public void publishNewUser(User user) {
        Map<String, Object> event = new HashMap<>();
        event.put("type", "NEW_USER_REGISTERED");
        event.put("user", convertUserToMap(user));
        event.put("timestamp", System.currentTimeMillis());

        AdminWebSocketHandler.broadcastToAdmins(convertToJson(event));
        publishUpdatedStats();
    }

    public void publishStatsUpdate(AdminStats stats) {
        Map<String, Object> event = new HashMap<>();
        event.put("type", "STATS_UPDATE");
        event.put("stats", convertStatsToMap(stats));
        event.put("timestamp", System.currentTimeMillis());

        AdminWebSocketHandler.broadcastToAdmins(convertToJson(event));
    }

    public void publishUpdatedStats() {
        AdminStats stats = adminStatsService.calculateCurrentStats();
        publishStatsUpdate(stats);
    }

    private String convertToJson(Map<String, Object> data) {
        try {
            return objectMapper.writeValueAsString(data);
        } catch (Exception e) {
            return "{\"error\": \"Failed to serialize message\"}";
        }
    }

    private Map<String, Object> convertComplaintToMap(Complaint complaint) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", complaint.getId());
        map.put("title", complaint.getTitle());
        map.put("description", complaint.getDescription());
        map.put("category", complaint.getCategory());
        map.put("subcategory", complaint.getSubcategory());
        map.put("status", complaint.getStatus());
        map.put("priority", complaint.getPriority());
        map.put("createdAt", complaint.getCreatedAt().toString());
        map.put("updatedAt", complaint.getUpdatedAt().toString());

        if (complaint.getUser() != null) {
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", complaint.getUser().getId());
            userMap.put("name", complaint.getUser().getName());
            userMap.put("email", complaint.getUser().getEmail());
            map.put("user", userMap);
        }
        return map;
    }

    private Map<String, Object> convertUserToMap(User user) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", user.getId());
        map.put("name", user.getName());
        map.put("email", user.getEmail());
        map.put("role", user.getRole());
        map.put("isActive", user.isActive());
        map.put("createdAt", user.getCreatedAt().toString());
        map.put("complaintCount", user.getComplaints() != null ? user.getComplaints().size() : 0);
        return map;
    }

    private Map<String, Object> convertStatsToMap(AdminStats stats) {
        Map<String, Object> map = new HashMap<>();
        map.put("total", stats.getTotalComplaints());
        map.put("pending", stats.getPendingComplaints());
        map.put("resolved", stats.getResolvedComplaints());
        map.put("rejected", stats.getRejectedComplaints());
        map.put("users", stats.getTotalUsers());
        map.put("activeToday", stats.getActiveUsersToday());
        map.put("avgResolutionTime", stats.getAvgResolutionTime());
        map.put("lastUpdated", stats.getLastUpdated().toString());
        return map;
    }
}
