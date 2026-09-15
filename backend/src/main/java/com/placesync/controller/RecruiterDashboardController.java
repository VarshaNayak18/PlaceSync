package com.placesync.controller;

import com.placesync.dto.response.DashboardResponse;
import com.placesync.entity.User;
import com.placesync.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/recruiter/dashboard")
@PreAuthorize("hasRole('RECRUITER')")
public class RecruiterDashboardController {

    private final DashboardService dashboardService;

    public RecruiterDashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ResponseEntity<DashboardResponse> getRecruiterDashboard(
            Authentication authentication
    ) {

        User recruiter = (User) authentication.getPrincipal();

        Long companyId = recruiter.getCompany().getId();

        return ResponseEntity.ok(
                dashboardService.getRecruiterDashboard(companyId)
        );
    }
}