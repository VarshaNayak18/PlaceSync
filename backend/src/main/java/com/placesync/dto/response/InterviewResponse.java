package com.placesync.dto.response;

import com.placesync.enums.InterviewStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewResponse {

    private Long id;

    private Long applicationId;

    private Long studentId;
    private String studentName;
    private String studentUsn;

    private Long jobId;
    private String jobTitle;
    private String companyName;

    private LocalDateTime interviewDateTime;

    private String mode;

    private String meetingLink;

    private String interviewerName;

    private InterviewStatus status;
}