package com.placesync.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String location;

    private Double salary;

    private Double minimumCgpa;

    private String eligibleDepartment;

    private String requiredSkills;

    private LocalDate applicationDeadline;

    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;
}