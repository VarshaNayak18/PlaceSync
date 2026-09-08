package com.placesync.service.impl;

import com.placesync.dto.request.JobRequest;
import com.placesync.dto.response.JobResponse;
import com.placesync.entity.Company;
import com.placesync.entity.Job;
import com.placesync.exception.ResourceNotFoundException;
import com.placesync.repository.CompanyRepository;
import com.placesync.repository.JobRepository;
import com.placesync.service.JobService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;

    public JobServiceImpl(
            JobRepository jobRepository,
            CompanyRepository companyRepository
    ) {
        this.jobRepository = jobRepository;
        this.companyRepository = companyRepository;
    }

    @Override
    public JobResponse createJob(JobRequest request) {

        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Company not found with id: "
                                        + request.getCompanyId()
                        )
                );

        Job job = Job.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .location(request.getLocation())
                .salary(request.getSalary())
                .minimumCgpa(request.getMinimumCgpa())
                .eligibleDepartment(request.getEligibleDepartment())
                .requiredSkills(request.getRequiredSkills())
                .applicationDeadline(request.getApplicationDeadline())
                .company(company)
                .build();

        Job savedJob = jobRepository.save(job);

        return mapToResponse(savedJob);
    }

    @Override
    public JobResponse getJobById(Long id) {

        Job job = jobRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Job not found with id: " + id
                        )
                );

        return mapToResponse(job);
    }

    @Override
    public List<JobResponse> getAllJobs() {

        return jobRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<JobResponse> getJobsByCompany(Long companyId) {

        if (!companyRepository.existsById(companyId)) {
            throw new ResourceNotFoundException(
                    "Company not found with id: " + companyId
            );
        }

        return jobRepository.findByCompanyId(companyId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public JobResponse updateJob(
            Long id,
            JobRequest request
    ) {

        Job job = jobRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Job not found with id: " + id
                        )
                );

        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Company not found with id: "
                                        + request.getCompanyId()
                        )
                );

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setLocation(request.getLocation());
        job.setSalary(request.getSalary());
        job.setMinimumCgpa(request.getMinimumCgpa());
        job.setEligibleDepartment(request.getEligibleDepartment());
        job.setRequiredSkills(request.getRequiredSkills());
        job.setApplicationDeadline(request.getApplicationDeadline());
        job.setCompany(company);

        Job updatedJob = jobRepository.save(job);

        return mapToResponse(updatedJob);
    }

    @Override
    public void deleteJob(Long id) {

        Job job = jobRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Job not found with id: " + id
                        )
                );

        jobRepository.delete(job);
    }

    private JobResponse mapToResponse(Job job) {

        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .location(job.getLocation())
                .salary(job.getSalary())
                .minimumCgpa(job.getMinimumCgpa())
                .eligibleDepartment(job.getEligibleDepartment())
                .requiredSkills(job.getRequiredSkills())
                .applicationDeadline(job.getApplicationDeadline())
                .companyId(job.getCompany().getId())
                .companyName(job.getCompany().getName())
                .build();
    }
}