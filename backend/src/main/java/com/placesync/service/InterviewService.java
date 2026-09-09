package com.placesync.service;

import com.placesync.dto.request.InterviewRequest;
import com.placesync.dto.response.InterviewResponse;
import com.placesync.enums.InterviewStatus;

import java.util.List;

public interface InterviewService {

    InterviewResponse scheduleInterview(
            InterviewRequest request
    );

    InterviewResponse getInterviewById(Long id);

    List<InterviewResponse> getAllInterviews();

    List<InterviewResponse> getInterviewsByStatus(
            InterviewStatus status
    );

    InterviewResponse updateInterviewStatus(
            Long id,
            InterviewStatus status
    );

    void cancelInterview(Long id);
}