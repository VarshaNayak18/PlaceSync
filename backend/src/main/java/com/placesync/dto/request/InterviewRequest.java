package com.placesync.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewRequest {

    @NotNull(message = "Application ID is required")
    private Long applicationId;

    @NotNull(message = "Interview date and time is required")
    @Future(message = "Interview date and time must be in the future")
    private LocalDateTime interviewDateTime;

    private String mode;

    private String meetingLink;

    private String interviewerName;
}