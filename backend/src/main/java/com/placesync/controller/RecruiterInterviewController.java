package com.placesync.controller;

import com.placesync.dto.request.InterviewRequest;
import com.placesync.dto.response.InterviewResponse;
import com.placesync.entity.User;
import com.placesync.enums.InterviewStatus;
import com.placesync.service.InterviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recruiter/interviews")
@PreAuthorize("hasRole('RECRUITER')")
public class RecruiterInterviewController {

    private final InterviewService interviewService;

    public RecruiterInterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @GetMapping
    public ResponseEntity<List<InterviewResponse>> getMyCompanyInterviews(
            Authentication authentication
    ) {
        User recruiter = (User) authentication.getPrincipal();

        Long companyId = recruiter.getCompany().getId();

        return ResponseEntity.ok(
                interviewService.getRecruiterInterviews(companyId)
        );
    }

    @PostMapping
    public ResponseEntity<InterviewResponse> scheduleInterview(
            Authentication authentication,
            @Valid @RequestBody InterviewRequest request
    ) {
        User recruiter = (User) authentication.getPrincipal();

        Long companyId = recruiter.getCompany().getId();

        return new ResponseEntity<>(
                interviewService.scheduleRecruiterInterview(
                        companyId,
                        request
                ),
                HttpStatus.CREATED
        );
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<InterviewResponse> updateInterviewStatus(
            Authentication authentication,
            @PathVariable Long id,
            @RequestParam InterviewStatus status
    ) {
        User recruiter = (User) authentication.getPrincipal();

        Long companyId = recruiter.getCompany().getId();

        return ResponseEntity.ok(
                interviewService.updateRecruiterInterviewStatus(
                        companyId,
                        id,
                        status
                )
        );
    }
}