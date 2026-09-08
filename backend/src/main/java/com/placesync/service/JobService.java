package com.placesync.service;

import com.placesync.dto.request.JobRequest;
import com.placesync.dto.response.JobResponse;

import java.util.List;

public interface JobService {

    JobResponse createJob(JobRequest request);

    JobResponse getJobById(Long id);

    List<JobResponse> getAllJobs();

    List<JobResponse> getJobsByCompany(Long companyId);

    JobResponse updateJob(Long id, JobRequest request);

    void deleteJob(Long id);
}