package com.placesync.dto.response;

import com.placesync.enums.ApplicationStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationResponse {

    private Long id;

    private Long studentId;
    private String studentName;
    private String studentUsn;

    private Long jobId;
    private String jobTitle;
    private String companyName;

    private ApplicationStatus status;
    private LocalDateTime appliedAt;
}