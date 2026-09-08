package com.placesync.service;

import com.placesync.dto.request.ApplicationRequest;
import com.placesync.dto.response.ApplicationResponse;

import java.util.List;

public interface ApplicationService {

    ApplicationResponse applyForJob(
            Long userId,
            ApplicationRequest request
    );

    ApplicationResponse getApplicationById(Long id);

    List<ApplicationResponse> getMyApplications(Long userId);

    List<ApplicationResponse> getApplicationsByJob(Long jobId);

    ApplicationResponse updateApplicationStatus(
            Long id,
            String status
    );
}