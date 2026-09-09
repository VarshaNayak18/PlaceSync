package com.placesync.entity;

import com.placesync.enums.InterviewStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "interviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "application_id", nullable = false, unique = true)
    private Application application;

    @Column(nullable = false)
    private LocalDateTime interviewDateTime;

    private String mode;

    private String meetingLink;

    private String interviewerName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InterviewStatus status;
}