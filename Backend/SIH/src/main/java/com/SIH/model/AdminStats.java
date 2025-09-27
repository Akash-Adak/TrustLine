package com.SIH.model;

import java.time.LocalDateTime;

public class AdminStats {
    private Long totalComplaints;
    private Long pendingComplaints;
    private Long resolvedComplaints;
    private Long rejectedComplaints;
    private Long totalUsers;
    private Long activeUsersToday;
    private Double avgResolutionTime;
    private LocalDateTime lastUpdated;

    public AdminStats() {
        this.lastUpdated = LocalDateTime.now();
    }

    public AdminStats(Long totalComplaints, Long pendingComplaints, Long resolvedComplaints,
                      Long rejectedComplaints, Long totalUsers, Long activeUsersToday,
                      Double avgResolutionTime) {
        this.totalComplaints = totalComplaints;
        this.pendingComplaints = pendingComplaints;
        this.resolvedComplaints = resolvedComplaints;
        this.rejectedComplaints = rejectedComplaints;
        this.totalUsers = totalUsers;
        this.activeUsersToday = activeUsersToday;
        this.avgResolutionTime = avgResolutionTime;
        this.lastUpdated = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getTotalComplaints() { return totalComplaints; }
    public void setTotalComplaints(Long totalComplaints) { this.totalComplaints = totalComplaints; }

    public Long getPendingComplaints() { return pendingComplaints; }
    public void setPendingComplaints(Long pendingComplaints) { this.pendingComplaints = pendingComplaints; }

    public Long getResolvedComplaints() { return resolvedComplaints; }
    public void setResolvedComplaints(Long resolvedComplaints) { this.resolvedComplaints = resolvedComplaints; }

    public Long getRejectedComplaints() { return rejectedComplaints; }
    public void setRejectedComplaints(Long rejectedComplaints) { this.rejectedComplaints = rejectedComplaints; }

    public Long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(Long totalUsers) { this.totalUsers = totalUsers; }

    public Long getActiveUsersToday() { return activeUsersToday; }
    public void setActiveUsersToday(Long activeUsersToday) { this.activeUsersToday = activeUsersToday; }

    public Double getAvgResolutionTime() { return avgResolutionTime; }
    public void setAvgResolutionTime(Double avgResolutionTime) { this.avgResolutionTime = avgResolutionTime; }

    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
}