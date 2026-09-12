package com.placesync.controller;

import com.placesync.dto.request.ApplicationRequest;
import com.placesync.dto.response.ApplicationResponse;
import com.placesync.entity.User;
import com.placesync.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(
            ApplicationService applicationService
    ) {
        this.applicationService = applicationService;
    }

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApplicationResponse> applyForJob(
            Authentication authentication,
            @Valid @RequestBody ApplicationRequest request
    ) {
        User user = (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                applicationService.applyForJob(
                        user.getId(),
                        request
                )
        );
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<ApplicationResponse>> getMyApplications(
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                applicationService.getMyApplications(
                        user.getId()
                )
        );
    }

    @GetMapping
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<List<ApplicationResponse>> getAllApplications() {

    return ResponseEntity.ok(
            applicationService.getAllApplications()
    );
}

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApplicationResponse> getApplicationById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                applicationService.getApplicationById(id)
        );
    }

    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ApplicationResponse>> getApplicationsByJob(
            @PathVariable Long jobId
    ) {
        return ResponseEntity.ok(
                applicationService.getApplicationsByJob(jobId)
        );
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApplicationResponse> updateApplicationStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        return ResponseEntity.ok(
                applicationService.updateApplicationStatus(
                        id,
                        status
                )
        );
    }
}