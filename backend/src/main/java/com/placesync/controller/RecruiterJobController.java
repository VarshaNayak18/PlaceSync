package com.placesync.controller;

import com.placesync.dto.request.JobRequest;
import com.placesync.dto.response.JobResponse;
import com.placesync.entity.User;
import com.placesync.service.JobService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recruiter/jobs")
@PreAuthorize("hasRole('RECRUITER')")
public class RecruiterJobController {

    private final JobService jobService;

    public RecruiterJobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    public ResponseEntity<List<JobResponse>> getMyCompanyJobs(
            Authentication authentication
    ) {

        User recruiter = (User) authentication.getPrincipal();

        Long companyId = recruiter.getCompany().getId();

        return ResponseEntity.ok(
                jobService.getRecruiterJobs(companyId)
        );
    }

    @PostMapping
    public ResponseEntity<JobResponse> createJob(
            Authentication authentication,
            @Valid @RequestBody JobRequest request
    ) {

        User recruiter = (User) authentication.getPrincipal();

        Long companyId = recruiter.getCompany().getId();

        return new ResponseEntity<>(
                jobService.createRecruiterJob(companyId, request),
                HttpStatus.CREATED
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobResponse> updateJob(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody JobRequest request
    ) {

        User recruiter = (User) authentication.getPrincipal();

        Long companyId = recruiter.getCompany().getId();

        return ResponseEntity.ok(
                jobService.updateRecruiterJob(
                        companyId,
                        id,
                        request
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(
            Authentication authentication,
            @PathVariable Long id
    ) {

        User recruiter = (User) authentication.getPrincipal();

        Long companyId = recruiter.getCompany().getId();

        jobService.deleteRecruiterJob(companyId, id);

        return ResponseEntity.noContent().build();
    }
}