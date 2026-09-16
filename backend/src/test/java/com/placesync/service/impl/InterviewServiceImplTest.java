package com.placesync.service.impl;

import com.placesync.dto.request.InterviewRequest;
import com.placesync.dto.response.InterviewResponse;
import com.placesync.entity.Application;
import com.placesync.entity.Company;
import com.placesync.entity.Interview;
import com.placesync.entity.Job;
import com.placesync.entity.Student;
import com.placesync.entity.User;
import com.placesync.enums.ApplicationStatus;
import com.placesync.enums.InterviewStatus;
import com.placesync.exception.ResourceNotFoundException;
import com.placesync.repository.ApplicationRepository;
import com.placesync.repository.InterviewRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InterviewServiceImplTest {

    @Mock
    private InterviewRepository interviewRepository;

    @Mock
    private ApplicationRepository applicationRepository;

    private InterviewServiceImpl interviewService;

    @BeforeEach
    void setUp() {
        interviewService = new InterviewServiceImpl(
                interviewRepository,
                applicationRepository
        );
    }

    @Test
    void shouldScheduleInterviewForShortlistedApplication() {

        Long applicationId = 500L;

        User user = User.builder()
                .id(1L)
                .name("Test Student")
                .build();

        Student student = Student.builder()
                .id(100L)
                .usn("1BY20CS001")
                .user(user)
                .build();

        Company company = Company.builder()
                .id(50L)
                .name("Test Company")
                .build();

        Job job = Job.builder()
                .id(10L)
                .title("Software Engineer")
                .company(company)
                .build();

        Application application = Application.builder()
                .id(applicationId)
                .student(student)
                .job(job)
                .status(ApplicationStatus.SHORTLISTED)
                .build();

        InterviewRequest request = InterviewRequest.builder()
                .applicationId(applicationId)
                .interviewDateTime(
                        LocalDateTime.now().plusDays(2)
                )
                .mode("ONLINE")
                .meetingLink("https://example.com/interview")
                .interviewerName("Test Interviewer")
                .build();

        Interview savedInterview = Interview.builder()
                .id(1000L)
                .application(application)
                .interviewDateTime(request.getInterviewDateTime())
                .mode(request.getMode())
                .meetingLink(request.getMeetingLink())
                .interviewerName(request.getInterviewerName())
                .status(InterviewStatus.SCHEDULED)
                .build();

        when(applicationRepository.findById(applicationId))
                .thenReturn(Optional.of(application));

        when(interviewRepository.existsByApplicationId(applicationId))
                .thenReturn(false);

        when(interviewRepository.save(any(Interview.class)))
                .thenReturn(savedInterview);

        InterviewResponse response =
                interviewService.scheduleInterview(request);

        assertNotNull(response);
        assertEquals(1000L, response.getId());
        assertEquals(applicationId, response.getApplicationId());
        assertEquals(
                InterviewStatus.SCHEDULED,
                response.getStatus()
        );
        assertEquals(
                "Test Interviewer",
                response.getInterviewerName()
        );

        verify(interviewRepository).save(any(Interview.class));
    }

    @Test
    void shouldRejectInterviewWhenApplicationDoesNotExist() {

        Long applicationId = 999L;

        InterviewRequest request = InterviewRequest.builder()
                .applicationId(applicationId)
                .interviewDateTime(
                        LocalDateTime.now().plusDays(2)
                )
                .build();

        when(applicationRepository.findById(applicationId))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> interviewService.scheduleInterview(request)
        );

        verify(interviewRepository, never())
                .save(any(Interview.class));
    }

    @Test
    void shouldRejectInterviewWhenApplicationIsNotShortlisted() {

        Long applicationId = 500L;

        Application application = Application.builder()
                .id(applicationId)
                .status(ApplicationStatus.APPLIED)
                .build();

        InterviewRequest request = InterviewRequest.builder()
                .applicationId(applicationId)
                .interviewDateTime(
                        LocalDateTime.now().plusDays(2)
                )
                .build();

        when(applicationRepository.findById(applicationId))
                .thenReturn(Optional.of(application));

        when(interviewRepository.existsByApplicationId(applicationId))
                .thenReturn(false);

        assertThrows(
                IllegalStateException.class,
                () -> interviewService.scheduleInterview(request)
        );

        verify(interviewRepository, never())
                .save(any(Interview.class));
    }

    @Test
    void shouldRejectDuplicateInterview() {

        Long applicationId = 500L;

        Application application = Application.builder()
                .id(applicationId)
                .status(ApplicationStatus.SHORTLISTED)
                .build();

        InterviewRequest request = InterviewRequest.builder()
                .applicationId(applicationId)
                .interviewDateTime(
                        LocalDateTime.now().plusDays(2)
                )
                .build();

        when(applicationRepository.findById(applicationId))
                .thenReturn(Optional.of(application));

        when(interviewRepository.existsByApplicationId(applicationId))
                .thenReturn(true);

        assertThrows(
                IllegalStateException.class,
                () -> interviewService.scheduleInterview(request)
        );

        verify(interviewRepository, never())
                .save(any(Interview.class));
    }
    @Test
void shouldRejectInterviewWhenDateTimeIsInThePast() {

    Long applicationId = 500L;

    Application application = Application.builder()
            .id(applicationId)
            .status(ApplicationStatus.SHORTLISTED)
            .build();

    InterviewRequest request = InterviewRequest.builder()
            .applicationId(applicationId)
            .interviewDateTime(
                    LocalDateTime.now().minusDays(1)
            )
            .build();

    when(applicationRepository.findById(applicationId))
            .thenReturn(Optional.of(application));

    when(interviewRepository.existsByApplicationId(applicationId))
            .thenReturn(false);

    assertThrows(
            IllegalStateException.class,
            () -> interviewService.scheduleInterview(request)
    );

    verify(interviewRepository, never())
            .save(any(Interview.class));
}

@Test
void shouldAllowRecruiterToUpdateInterviewFromOwnCompany() {

    Long companyId = 50L;
    Long interviewId = 1000L;

    User user = User.builder()
            .id(1L)
            .name("Test Student")
            .build();

    Student student = Student.builder()
            .id(100L)
            .usn("1BY20CS001")
            .user(user)
            .build();

    Company company = Company.builder()
            .id(companyId)
            .name("Test Company")
            .build();

    Job job = Job.builder()
            .id(10L)
            .title("Software Engineer")
            .company(company)
            .build();

    Application application = Application.builder()
            .id(500L)
            .student(student)
            .job(job)
            .status(ApplicationStatus.SHORTLISTED)
            .build();

    Interview interview = Interview.builder()
            .id(interviewId)
            .application(application)
            .interviewDateTime(LocalDateTime.now().plusDays(2))
            .status(InterviewStatus.SCHEDULED)
            .build();

    when(interviewRepository.findById(interviewId))
            .thenReturn(Optional.of(interview));

    when(interviewRepository.save(interview))
            .thenReturn(interview);

    InterviewResponse response =
            interviewService.updateRecruiterInterviewStatus(
                    companyId,
                    interviewId,
                    InterviewStatus.COMPLETED
            );

    assertNotNull(response);
    assertEquals(
            InterviewStatus.COMPLETED,
            response.getStatus()
    );

    verify(interviewRepository).save(interview);
}

@Test
void shouldRejectRecruiterUpdatingInterviewFromAnotherCompany() {

    Long recruiterCompanyId = 50L;
    Long interviewId = 1000L;

    Company otherCompany = Company.builder()
            .id(99L)
            .name("Other Company")
            .build();

    Job job = Job.builder()
            .id(10L)
            .title("Software Engineer")
            .company(otherCompany)
            .build();

    Application application = Application.builder()
            .id(500L)
            .job(job)
            .build();

    Interview interview = Interview.builder()
            .id(interviewId)
            .application(application)
            .status(InterviewStatus.SCHEDULED)
            .build();

    when(interviewRepository.findById(interviewId))
            .thenReturn(Optional.of(interview));

    assertThrows(
            ResourceNotFoundException.class,
            () -> interviewService.updateRecruiterInterviewStatus(
                    recruiterCompanyId,
                    interviewId,
                    InterviewStatus.COMPLETED
            )
    );

    verify(interviewRepository, never())
            .save(any(Interview.class));
}
}