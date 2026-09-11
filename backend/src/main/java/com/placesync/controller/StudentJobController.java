package com.placesync.controller;

import com.placesync.dto.response.JobResponse;
import com.placesync.service.JobService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student/jobs")
@PreAuthorize("hasRole('STUDENT')")
public class StudentJobController {

    private final JobService jobService;

    public StudentJobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    public ResponseEntity<List<JobResponse>> getAllJobs() {
        return ResponseEntity.ok(
                jobService.getAllJobs()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobResponse> getJobById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                jobService.getJobById(id)
        );
    }
}