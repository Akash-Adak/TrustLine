// ComplaintUpdate.java
package com.SIH.model;

import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Embeddable
public class ComplaintUpdate {
    private String message;

    @Enumerated(EnumType.STRING)
    private ComplaintStatus status;

    private LocalDateTime createdAt = LocalDateTime.now();
}