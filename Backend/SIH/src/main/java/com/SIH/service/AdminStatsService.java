package com.SIH.service;


import com.SIH.model.AdminStats;
import com.SIH.model.ComplaintStatus;
import com.SIH.repository.ComplaintRepository;
import com.SIH.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;

@Service
public class AdminStatsService {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private UserRepository userRepository;

    public AdminStats calculateCurrentStats() {
        AdminStats stats = new AdminStats();

        try {
            // Calculate complaint statistics
            stats.setTotalComplaints(complaintRepository.count());
            stats.setPendingComplaints(complaintRepository.countByStatus(ComplaintStatus.valueOf("PENDING")));
            stats.setResolvedComplaints(complaintRepository.countByStatus(ComplaintStatus.valueOf("RESOLVED")));
            stats.setRejectedComplaints(complaintRepository.countByStatus(ComplaintStatus.valueOf("REJECTED")));

            // Calculate user statistics
            stats.setTotalUsers(userRepository.count());
            stats.setActiveUsersToday(userRepository.countByLastLoginAfter(LocalDate.now().atStartOfDay()));

            // Calculate average resolution time
            stats.setAvgResolutionTime(calculateAverageResolutionTime());

        } catch (Exception e) {
            // Fallback values in case of errors
            stats.setTotalComplaints(0L);
            stats.setPendingComplaints(0L);
            stats.setResolvedComplaints(0L);
            stats.setRejectedComplaints(0L);
            stats.setTotalUsers(0L);
            stats.setActiveUsersToday(0L);
            stats.setAvgResolutionTime(0.0);
        }

        return stats;
    }

    private Double calculateAverageResolutionTime() {
        // Implement logic to calculate average resolution time
        // This is a simplified version - you might need to add actual calculation logic
        try {
            Double avgTime = complaintRepository.findAverageResolutionTime();
            return avgTime != null ? avgTime : 24.5;
        } catch (Exception e) {
            return 24.5; // default value in hours
        }
    }
}