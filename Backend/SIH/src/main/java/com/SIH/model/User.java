package com.SIH.model;


import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    private String password;
    private String name;
    private boolean enabled = true;
    private String provider;
    @Enumerated(EnumType.STRING)
    private Role role = Role.ROLE_USER;
    private boolean isActive;
    private LocalDateTime createdAt;
    @OneToMany(mappedBy = "user")
    private List<Complaint> complaints;
    @Column(name = "last_login")
    private LocalDateTime lastLogin;
}