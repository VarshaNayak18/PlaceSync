package com.placesync.service.impl;

import com.placesync.dto.response.DashboardResponse;
import com.placesync.enums.ApplicationStatus;
import com.placesync.enums.InterviewStatus;
import com.placesync.repository.ApplicationRepository;
import com.placesync.repository.CompanyRepository;
import com.placesync.repository.InterviewRepository;
import com.placesync.repository.JobRepository;
import com.placesync.repository.StudentRepository;
import com.placesync.service.DashboardService;
import org.springframework.stereotype.Service;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final InterviewRepository interviewRepository;

    public DashboardServiceImpl(
            StudentRepository studentRepository,
            CompanyRepository companyRepository,
            JobRepository jobRepository,
            ApplicationRepository applicationRepository,
            InterviewRepository interviewRepository
    ) {
        this.studentRepository = studentRepository;
        this.companyRepository = companyRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.interviewRepository = interviewRepository;
    }

    @Override
    public DashboardResponse getAdminDashboard() {

        long totalStudents =
                studentRepository.count();

        long totalCompanies =
                companyRepository.count();

        long totalJobs =
                jobRepository.count();

        long totalApplications =
                applicationRepository.count();

        long totalSelected =
                applicationRepository.countByStatus(
                        ApplicationStatus.SELECTED
                );

        long totalScheduledInterviews =
                interviewRepository.countByStatus(
                        InterviewStatus.SCHEDULED
                );

        return DashboardResponse.builder()
                .totalStudents(totalStudents)
                .totalCompanies(totalCompanies)
                .totalJobs(totalJobs)
                .totalApplications(totalApplications)
                .totalSelected(totalSelected)
                .totalScheduledInterviews(
                        totalScheduledInterviews
                )
                .build();
    }
}