package com.placesync.service.impl;

import com.placesync.dto.response.EligibilityResult;
import com.placesync.entity.Job;
import com.placesync.entity.Student;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class EligibilityServiceImplTest {

    private final EligibilityServiceImpl eligibilityService =
            new EligibilityServiceImpl();

    @Test
    void shouldReturnEligibleWhenAllRequirementsAreSatisfied() {

        Student student = Student.builder()
                .cgpa(8.5)
                .department("Computer Science")
                .build();

        Job job = Job.builder()
                .minimumCgpa(7.5)
                .eligibleDepartment("Computer Science")
                .applicationDeadline(LocalDate.now().plusDays(5))
                .build();

        EligibilityResult result =
                eligibilityService.checkEligibility(student, job);

        assertTrue(result.isEligible());
        assertTrue(result.getReasons().isEmpty());
    }

    @Test
void shouldReturnIneligibleWhenCgpaIsBelowMinimum() {

    Student student = Student.builder()
            .cgpa(6.5)
            .department("Computer Science")
            .build();

    Job job = Job.builder()
            .minimumCgpa(7.5)
            .eligibleDepartment("Computer Science")
            .applicationDeadline(LocalDate.now().plusDays(5))
            .build();

    EligibilityResult result =
            eligibilityService.checkEligibility(student, job);

    assertFalse(result.isEligible());
    assertTrue(result.getReasons().contains(
            "Student does not meet the minimum CGPA requirement"
    ));
}
@Test
void shouldReturnIneligibleWhenDepartmentIsNotEligible() {

    Student student = Student.builder()
            .cgpa(8.5)
            .department("Mechanical Engineering")
            .build();

    Job job = Job.builder()
            .minimumCgpa(7.5)
            .eligibleDepartment("Computer Science")
            .applicationDeadline(LocalDate.now().plusDays(5))
            .build();

    EligibilityResult result =
            eligibilityService.checkEligibility(student, job);

    assertFalse(result.isEligible());
    assertTrue(result.getReasons().contains(
            "Student's department is not eligible for this job"
    ));
}

@Test
void shouldReturnIneligibleWhenApplicationDeadlineHasPassed() {
    Student student = Student.builder()
            .cgpa(8.5)
            .department("Computer Science")
            .build();

    Job job = Job.builder()
            .minimumCgpa(7.5)
            .eligibleDepartment("Computer Science")
            .applicationDeadline(LocalDate.now().minusDays(1))
            .build();

    EligibilityResult result =
            eligibilityService.checkEligibility(student, job);

    assertFalse(result.isEligible());
    assertTrue(result.getReasons().contains(
            "Application deadline has passed"
    ));
}
}