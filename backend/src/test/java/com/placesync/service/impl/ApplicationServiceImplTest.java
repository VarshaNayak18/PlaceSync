package com.placesync.service.impl;

import com.placesync.dto.request.ApplicationRequest;
import com.placesync.dto.response.ApplicationResponse;
import com.placesync.dto.response.EligibilityResult;
import com.placesync.entity.Application;
import com.placesync.entity.Company;
import com.placesync.entity.Job;
import com.placesync.entity.Student;
import com.placesync.entity.User;
import com.placesync.enums.ApplicationStatus;
import com.placesync.exception.ResourceNotFoundException;
import com.placesync.repository.ApplicationRepository;
import com.placesync.repository.JobRepository;
import com.placesync.repository.StudentRepository;
import com.placesync.service.EligibilityService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApplicationServiceImplTest {

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private JobRepository jobRepository;

    @Mock
    private EligibilityService eligibilityService;

    private ApplicationServiceImpl applicationService;

    @BeforeEach
    void setUp() {
        applicationService = new ApplicationServiceImpl(
                applicationRepository,
                studentRepository,
                jobRepository,
                eligibilityService
        );
    }

    @Test
    void shouldApplyForJobWhenStudentIsEligible() {

        Long userId = 1L;
        Long jobId = 10L;

        ApplicationRequest request = ApplicationRequest.builder()
                .jobId(jobId)
                .build();

        User user = User.builder()
                .id(userId)
                .name("Test Student")
                .build();

        Student student = Student.builder()
                .id(100L)
                .usn("1BY20CS001")
                .department("Computer Science")
                .cgpa(8.5)
                .user(user)
                .build();

        Company company = Company.builder()
                .id(50L)
                .name("Test Company")
                .build();

        Job job = Job.builder()
                .id(jobId)
                .title("Software Engineer")
                .company(company)
                .build();

        Application savedApplication = Application.builder()
                .id(500L)
                .student(student)
                .job(job)
                .status(ApplicationStatus.APPLIED)
                .build();

        when(studentRepository.findByUserId(userId))
                .thenReturn(Optional.of(student));

        when(jobRepository.findById(jobId))
                .thenReturn(Optional.of(job));

        when(eligibilityService.checkEligibility(student, job))
                .thenReturn(
                        EligibilityResult.builder()
                                .eligible(true)
                                .reasons(java.util.List.of())
                                .build()
                );

        when(applicationRepository.existsByStudentIdAndJobId(
                student.getId(),
                job.getId()
        )).thenReturn(false);

        when(applicationRepository.save(any(Application.class)))
                .thenReturn(savedApplication);

        ApplicationResponse response =
                applicationService.applyForJob(userId, request);

        assertNotNull(response);
        assertEquals(500L, response.getId());
        assertEquals(100L, response.getStudentId());
        assertEquals(10L, response.getJobId());
        assertEquals(
                ApplicationStatus.APPLIED,
                response.getStatus()
        );

        verify(applicationRepository)
                .save(any(Application.class));
    }

    @Test
    void shouldRejectApplicationWhenStudentProfileDoesNotExist() {

        Long userId = 1L;

        ApplicationRequest request = ApplicationRequest.builder()
                .jobId(10L)
                .build();

        when(studentRepository.findByUserId(userId))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> applicationService.applyForJob(
                        userId,
                        request
                )
        );

        verify(jobRepository, never()).findById(anyLong());
        verify(applicationRepository, never()).save(any(Application.class));
    }

    @Test
    void shouldRejectApplicationWhenStudentIsNotEligible() {

        Long userId = 1L;
        Long jobId = 10L;

        ApplicationRequest request = ApplicationRequest.builder()
                .jobId(jobId)
                .build();

        User user = User.builder()
                .id(userId)
                .name("Test Student")
                .build();

        Student student = Student.builder()
                .id(100L)
                .department("Mechanical Engineering")
                .cgpa(6.5)
                .user(user)
                .build();

        Job job = Job.builder()
                .id(jobId)
                .title("Software Engineer")
                .build();

        when(studentRepository.findByUserId(userId))
                .thenReturn(Optional.of(student));

        when(jobRepository.findById(jobId))
                .thenReturn(Optional.of(job));

        when(eligibilityService.checkEligibility(student, job))
                .thenReturn(
                        EligibilityResult.builder()
                                .eligible(false)
                                .reasons(java.util.List.of(
                                        "Student does not meet the minimum CGPA requirement"
                                ))
                                .build()
                );

        assertThrows(
                IllegalStateException.class,
                () -> applicationService.applyForJob(
                        userId,
                        request
                )
        );

        verify(applicationRepository, never())
                .save(any(Application.class));
    }

    @Test
    void shouldRejectDuplicateApplication() {

        Long userId = 1L;
        Long jobId = 10L;

        ApplicationRequest request = ApplicationRequest.builder()
                .jobId(jobId)
                .build();

        User user = User.builder()
                .id(userId)
                .name("Test Student")
                .build();

        Student student = Student.builder()
                .id(100L)
                .department("Computer Science")
                .cgpa(8.5)
                .user(user)
                .build();

        Job job = Job.builder()
                .id(jobId)
                .title("Software Engineer")
                .build();

        when(studentRepository.findByUserId(userId))
                .thenReturn(Optional.of(student));

        when(jobRepository.findById(jobId))
                .thenReturn(Optional.of(job));

        when(eligibilityService.checkEligibility(student, job))
                .thenReturn(
                        EligibilityResult.builder()
                                .eligible(true)
                                .reasons(java.util.List.of())
                                .build()
                );

        when(applicationRepository.existsByStudentIdAndJobId(
                student.getId(),
                job.getId()
        )).thenReturn(true);

        assertThrows(
                IllegalStateException.class,
                () -> applicationService.applyForJob(
                        userId,
                        request
                )
        );

        verify(applicationRepository, never())
                .save(any(Application.class));
    }

    @Test
void shouldUpdateApplicationStatusSuccessfully() {

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
            .status(ApplicationStatus.APPLIED)
            .build();

    when(applicationRepository.findById(applicationId))
            .thenReturn(Optional.of(application));

    when(applicationRepository.save(application))
            .thenReturn(application);

    ApplicationResponse response =
            applicationService.updateApplicationStatus(
                    applicationId,
                    "SHORTLISTED"
            );

    assertNotNull(response);
    assertEquals(
            ApplicationStatus.SHORTLISTED,
            response.getStatus()
    );

    verify(applicationRepository).save(application);
}

@Test
void shouldRejectInvalidApplicationStatus() {

    Long applicationId = 500L;

    Application application = Application.builder()
            .id(applicationId)
            .status(ApplicationStatus.APPLIED)
            .build();

    when(applicationRepository.findById(applicationId))
            .thenReturn(Optional.of(application));

    assertThrows(
            IllegalStateException.class,
            () -> applicationService.updateApplicationStatus(
                    applicationId,
                    "INVALID_STATUS"
            )
    );

    verify(applicationRepository, never())
            .save(any(Application.class));
}

@Test
void shouldRejectStatusUpdateWhenApplicationDoesNotExist() {

    Long applicationId = 999L;

    when(applicationRepository.findById(applicationId))
            .thenReturn(Optional.empty());

    assertThrows(
            ResourceNotFoundException.class,
            () -> applicationService.updateApplicationStatus(
                    applicationId,
                    "SHORTLISTED"
            )
    );

    verify(applicationRepository, never())
            .save(any(Application.class));
}

@Test
void shouldAllowRecruiterToUpdateApplicationFromOwnCompany() {

    Long companyId = 50L;
    Long applicationId = 500L;

    User user = User.builder()
            .id(1L)
            .name("Test Student")
            .build();

    Student student = Student.builder()
            .id(100L)
            .usn("1BY20CS001")
            .department("Computer Science")
            .cgpa(8.5)
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
            .id(applicationId)
            .student(student)
            .job(job)
            .status(ApplicationStatus.APPLIED)
            .build();

    when(applicationRepository.findById(applicationId))
            .thenReturn(Optional.of(application));

    when(applicationRepository.save(application))
            .thenReturn(application);

    ApplicationResponse response =
            applicationService.updateRecruiterApplicationStatus(
                    companyId,
                    applicationId,
                    ApplicationStatus.SHORTLISTED
            );

    assertNotNull(response);
    assertEquals(
            ApplicationStatus.SHORTLISTED,
            response.getStatus()
    );

    verify(applicationRepository).save(application);
}

@Test
void shouldRejectRecruiterUpdatingApplicationFromAnotherCompany() {

    Long recruiterCompanyId = 50L;
    Long applicationId = 500L;

    Company applicationCompany = Company.builder()
            .id(99L)
            .name("Other Company")
            .build();

    Job job = Job.builder()
            .id(10L)
            .title("Software Engineer")
            .company(applicationCompany)
            .build();

    Application application = Application.builder()
            .id(applicationId)
            .job(job)
            .status(ApplicationStatus.APPLIED)
            .build();

    when(applicationRepository.findById(applicationId))
            .thenReturn(Optional.of(application));

    assertThrows(
            ResourceNotFoundException.class,
            () -> applicationService.updateRecruiterApplicationStatus(
                    recruiterCompanyId,
                    applicationId,
                    ApplicationStatus.SHORTLISTED
            )
    );

    verify(applicationRepository, never())
            .save(any(Application.class));
}
}