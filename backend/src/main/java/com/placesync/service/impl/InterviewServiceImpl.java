package com.placesync.service.impl;

import com.placesync.dto.request.InterviewRequest;
import com.placesync.dto.response.InterviewResponse;
import com.placesync.entity.Application;
import com.placesync.entity.Interview;
import com.placesync.entity.Job;
import com.placesync.enums.ApplicationStatus;
import com.placesync.enums.InterviewStatus;
import com.placesync.exception.ResourceNotFoundException;
import com.placesync.repository.ApplicationRepository;
import com.placesync.repository.InterviewRepository;
import com.placesync.service.InterviewService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class InterviewServiceImpl implements InterviewService {

    private final InterviewRepository interviewRepository;
    private final ApplicationRepository applicationRepository;

    public InterviewServiceImpl(
            InterviewRepository interviewRepository,
            ApplicationRepository applicationRepository
    ) {
        this.interviewRepository = interviewRepository;
        this.applicationRepository = applicationRepository;
    }

    @Override
    public InterviewResponse scheduleInterview(
            InterviewRequest request
    ) {

        Application application =
                applicationRepository.findById(
                        request.getApplicationId()
                ).orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Application not found with id: "
                                        + request.getApplicationId()
                        )
                );

        if (interviewRepository.existsByApplicationId(
                application.getId()
        )) {
            throw new IllegalStateException(
                    "Interview already exists for this application"
            );
        }

        if (application.getStatus() != ApplicationStatus.SHORTLISTED) {
            throw new IllegalStateException(
                    "Interview can only be scheduled for a shortlisted application"
            );
        }

        if (!request.getInterviewDateTime().isAfter(
                LocalDateTime.now()
        )) {
            throw new IllegalStateException(
                    "Interview date and time must be in the future"
            );
        }

        Interview interview = Interview.builder()
                .application(application)
                .interviewDateTime(
                        request.getInterviewDateTime()
                )
                .mode(request.getMode())
                .meetingLink(request.getMeetingLink())
                .interviewerName(request.getInterviewerName())
                .status(InterviewStatus.SCHEDULED)
                .build();

        Interview savedInterview =
                interviewRepository.save(interview);

        return mapToResponse(savedInterview);
    }

    @Override
    public InterviewResponse getInterviewById(Long id) {

        Interview interview =
                interviewRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Interview not found with id: "
                                                + id
                                )
                        );

        return mapToResponse(interview);
    }

    @Override
    public List<InterviewResponse> getAllInterviews() {

        return interviewRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<InterviewResponse> getInterviewsByStatus(
            InterviewStatus status
    ) {

        return interviewRepository.findByStatus(status)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public InterviewResponse updateInterviewStatus(
            Long id,
            InterviewStatus status
    ) {

        Interview interview =
                interviewRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Interview not found with id: "
                                                + id
                                )
                        );

        interview.setStatus(status);

        Interview updatedInterview =
                interviewRepository.save(interview);

        return mapToResponse(updatedInterview);
    }

    @Override
    public void cancelInterview(Long id) {

        Interview interview =
                interviewRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Interview not found with id: "
                                                + id
                                )
                        );

        interview.setStatus(InterviewStatus.CANCELLED);

        interviewRepository.save(interview);
    }

    private InterviewResponse mapToResponse(
            Interview interview
    ) {

        Application application =
                interview.getApplication();

        Job job = application.getJob();

        return InterviewResponse.builder()
                .id(interview.getId())
                .applicationId(application.getId())

                .studentId(
                        application.getStudent().getId()
                )
                .studentName(
                        application.getStudent()
                                .getUser()
                                .getName()
                )
                .studentUsn(
                        application.getStudent().getUsn()
                )

                .jobId(job.getId())
                .jobTitle(job.getTitle())
                .companyName(job.getCompany().getName())

                .interviewDateTime(
                        interview.getInterviewDateTime()
                )
                .mode(interview.getMode())
                .meetingLink(interview.getMeetingLink())
                .interviewerName(
                        interview.getInterviewerName()
                )
                .status(interview.getStatus())
                .build();
    }
}