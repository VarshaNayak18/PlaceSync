package com.placesync.controller;

import com.placesync.dto.request.InterviewRequest;
import com.placesync.dto.response.InterviewResponse;
import com.placesync.enums.InterviewStatus;
import com.placesync.service.InterviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interviews")
@PreAuthorize("hasRole('ADMIN')")
public class InterviewController {

    private final InterviewService interviewService;

    public InterviewController(
            InterviewService interviewService
    ) {
        this.interviewService = interviewService;
    }

    @PostMapping
    public ResponseEntity<InterviewResponse> scheduleInterview(
            @Valid @RequestBody InterviewRequest request
    ) {
        return new ResponseEntity<>(
                interviewService.scheduleInterview(request),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<InterviewResponse> getInterviewById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                interviewService.getInterviewById(id)
        );
    }

    @GetMapping
    public ResponseEntity<List<InterviewResponse>> getAllInterviews() {
        return ResponseEntity.ok(
                interviewService.getAllInterviews()
        );
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<InterviewResponse>> getInterviewsByStatus(
            @PathVariable InterviewStatus status
    ) {
        return ResponseEntity.ok(
                interviewService.getInterviewsByStatus(status)
        );
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<InterviewResponse> updateInterviewStatus(
            @PathVariable Long id,
            @RequestParam InterviewStatus status
    ) {
        return ResponseEntity.ok(
                interviewService.updateInterviewStatus(
                        id,
                        status
                )
        );
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelInterview(
            @PathVariable Long id
    ) {
        interviewService.cancelInterview(id);
        return ResponseEntity.noContent().build();
    }
}