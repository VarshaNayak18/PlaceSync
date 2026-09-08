package com.placesync.controller;

import com.placesync.dto.response.EligibilityResult;
import com.placesync.entity.Job;
import com.placesync.entity.Student;
import com.placesync.entity.User;
import com.placesync.exception.ResourceNotFoundException;
import com.placesync.repository.JobRepository;
import com.placesync.repository.StudentRepository;
import com.placesync.service.EligibilityService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/eligibility")
public class EligibilityController {

    private final EligibilityService eligibilityService;
    private final StudentRepository studentRepository;
    private final JobRepository jobRepository;

    public EligibilityController(
            EligibilityService eligibilityService,
            StudentRepository studentRepository,
            JobRepository jobRepository
    ) {
        this.eligibilityService = eligibilityService;
        this.studentRepository = studentRepository;
        this.jobRepository = jobRepository;
    }

    @GetMapping("/jobs/{jobId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<EligibilityResult> checkEligibility(
            Authentication authentication,
            @PathVariable Long jobId
    ) {

        User user = (User) authentication.getPrincipal();

        Student student = studentRepository.findByUserId(user.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student profile not found for user id: "
                                        + user.getId()
                        )
                );

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Job not found with id: " + jobId
                        )
                );

        EligibilityResult result =
                eligibilityService.checkEligibility(
                        student,
                        job
                );

        return ResponseEntity.ok(result);
    }
}