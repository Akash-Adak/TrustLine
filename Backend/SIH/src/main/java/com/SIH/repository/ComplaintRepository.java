package com.SIH.repository;

import com.SIH.model.Complaint;
import com.SIH.model.ComplaintStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByFiledBy(String email);
    List<Complaint> findByCategory(String category);
    List<Complaint> findByStatus(ComplaintStatus status);
    List<Complaint> findByCategoryAndStatus(String category, ComplaintStatus status);
    List<Complaint> findByCategoryAndSubcategory(String category, String subcategory);

    long countByStatus(ComplaintStatus status);
    Long countByStatus(String status);
//    Double findAverageResolutionTime();
    List<Complaint> findByCategoryAndSubcategoryAndStatus(String category, String subcategory, ComplaintStatus status);



    @Query("SELECT AVG(DATEDIFF(c.resolvedAt, c.createdAt)) FROM Complaint c WHERE c.resolvedAt IS NOT NULL")
    Double findAverageResolutionTime();
}

