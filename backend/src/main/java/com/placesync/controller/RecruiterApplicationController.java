package com.placesync.controller;

import com.placesync.dto.response.ApplicationResponse;
import com.placesync.entity.User;
import com.placesync.enums.ApplicationStatus;
import com.placesync.service.ApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recruiter/applications")
@PreAuthorize("hasRole('RECRUITER')")
public class RecruiterApplicationController {

    private final ApplicationService applicationService;

    public RecruiterApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @GetMapping
    public ResponseEntity<List<ApplicationResponse>> getMyCompanyApplications(
            Authentication authentication
    ) {
        User recruiter = (User) authentication.getPrincipal();

        Long companyId = recruiter.getCompany().getId();

        return ResponseEntity.ok(
                applicationService.getRecruiterApplications(companyId)
        );
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApplicationResponse> updateApplicationStatus(
            Authentication authentication,
            @PathVariable Long id,
            @RequestParam ApplicationStatus status
    ) {
        User recruiter = (User) authentication.getPrincipal();

        Long companyId = recruiter.getCompany().getId();

        return ResponseEntity.ok(
                applicationService.updateRecruiterApplicationStatus(
                        companyId,
                        id,
                        status
                )
        );
    }
}