package com.SIH.service;

import com.SIH.model.Complaint;
import com.SIH.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PriorityScheduler {

    @Autowired
    private ComplaintRepository complaintRepository;

    // Runs every 1 hour (3600000 ms)
    @Scheduled(fixedRate = 3600000)
    public void updatePriorities() {
        LocalDateTime now = LocalDateTime.now();
        List<Complaint> complaints = complaintRepository.findAll();

        for (Complaint c : complaints) {
            long hours = java.time.Duration.between(c.getCreatedAt(), now).toHours();

            if (hours >= 120 && !"HIGH".equals(c.getPriority())) { // 5 days
                c.setPriority("HIGH");
            } else if (hours >= 48 && !"MEDIUM".equals(c.getPriority()) && !"HIGH".equals(c.getPriority())) { // 2 days
                c.setPriority("MEDIUM");
            }
        }

        complaintRepository.saveAll(complaints);
    }
}
