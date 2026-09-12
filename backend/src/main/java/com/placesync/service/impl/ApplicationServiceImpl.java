package com.placesync.service.impl;

import com.placesync.dto.request.ApplicationRequest;
import com.placesync.dto.response.ApplicationResponse;
import com.placesync.dto.response.EligibilityResult;
import com.placesync.entity.Application;
import com.placesync.entity.Company;
import com.placesync.entity.Job;
import com.placesync.entity.Student;
import com.placesync.enums.ApplicationStatus;
import com.placesync.exception.ResourceNotFoundException;
import com.placesync.repository.ApplicationRepository;
import com.placesync.repository.JobRepository;
import com.placesync.repository.StudentRepository;
import com.placesync.service.ApplicationService;
import com.placesync.service.EligibilityService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;
    private final JobRepository jobRepository;
    private final EligibilityService eligibilityService;

    public ApplicationServiceImpl(
            ApplicationRepository applicationRepository,
            StudentRepository studentRepository,
            JobRepository jobRepository,
            EligibilityService eligibilityService
    ) {
        this.applicationRepository = applicationRepository;
        this.studentRepository = studentRepository;
        this.jobRepository = jobRepository;
        this.eligibilityService = eligibilityService;
    }

    @Override
    public ApplicationResponse applyForJob(
            Long userId,
            ApplicationRequest request
    ) {

        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student profile not found for user id: "
                                        + userId
                        )
                );

        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Job not found with id: "
                                        + request.getJobId()
                        )
                );

        EligibilityResult eligibilityResult =
        eligibilityService.checkEligibility(student, job);

if (!eligibilityResult.isEligible()) {
    throw new IllegalStateException(
            String.join(
                    "; ",
                    eligibilityResult.getReasons()
            )
    );
}

        if (applicationRepository.existsByStudentIdAndJobId(
                student.getId(),
                job.getId()
        )) {
            throw new IllegalStateException(
                    "Student has already applied for this job"
            );
        }

        Application application = Application.builder()
                .student(student)
                .job(job)
                .status(ApplicationStatus.APPLIED)
                .appliedAt(LocalDateTime.now())
                .build();

        Application savedApplication =
                applicationRepository.save(application);

        return mapToResponse(savedApplication);
    }

    @Override
    public ApplicationResponse getApplicationById(Long id) {

        Application application = applicationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Application not found with id: " + id
                        )
                );

        return mapToResponse(application);
    }

    @Override
    public List<ApplicationResponse> getMyApplications(
            Long userId
    ) {

        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student profile not found for user id: "
                                        + userId
                        )
                );

        return applicationRepository.findByStudentId(student.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<ApplicationResponse> getApplicationsByJob(
            Long jobId
    ) {

        if (!jobRepository.existsById(jobId)) {
            throw new ResourceNotFoundException(
                    "Job not found with id: " + jobId
            );
        }

        return applicationRepository.findByJobId(jobId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
public List<ApplicationResponse> getAllApplications() {

    return applicationRepository.findAll()
            .stream()
            .map(this::mapToResponse)
            .toList();
}

    @Override
    public ApplicationResponse updateApplicationStatus(
            Long id,
            String status
    ) {

        Application application = applicationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Application not found with id: " + id
                        )
                );

        ApplicationStatus applicationStatus;

        try {
            applicationStatus =
                    ApplicationStatus.valueOf(
                            status.toUpperCase()
                    );
        } catch (IllegalArgumentException exception) {
            throw new IllegalStateException(
                    "Invalid application status: " + status
            );
        }

        application.setStatus(applicationStatus);

        Application updatedApplication =
                applicationRepository.save(application);

        return mapToResponse(updatedApplication);
    }

    private ApplicationResponse mapToResponse(
            Application application
    ) {

        Student student = application.getStudent();
        Job job = application.getJob();
        Company company = job.getCompany();

        return ApplicationResponse.builder()
                .id(application.getId())
                .studentId(student.getId())
                .studentName(student.getUser().getName())
                .studentUsn(student.getUsn())
                .jobId(job.getId())
                .jobTitle(job.getTitle())
                .companyName(company.getName())
                .status(application.getStatus())
                .appliedAt(application.getAppliedAt())
                .build();
    }
}