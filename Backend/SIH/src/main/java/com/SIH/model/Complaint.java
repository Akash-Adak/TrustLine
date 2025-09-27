// Complaint.java
package com.SIH.model;

import com.github.javafaker.Book;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import jakarta.persistence.*;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@Data
@Entity
@Table(name = "complaints")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String category;
    private String subcategory;

    @Enumerated(EnumType.STRING)
    private ComplaintStatus status = ComplaintStatus.PENDING;

    private String filedBy;
    private Double latitude;
    private Double longitude;
    private String imageUrl;
    private LocalDateTime updatedAt ;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime resolvedAt;
    private String priority = "LOW";

    @ElementCollection
    @CollectionTable(name = "complaint_updates", joinColumns = @JoinColumn(name = "complaint_id"))
    private List<ComplaintUpdate> updates = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

//    public void setUpdatedAt(LocalDateTime updatedAt) {
//        this.updatedAt = updatedAt;
//    }
//
//
//    public LocalDateTime getUpdatedAt() {
//        return updatedAt;
//    }
}
