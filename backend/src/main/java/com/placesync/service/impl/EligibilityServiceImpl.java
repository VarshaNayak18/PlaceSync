package com.placesync.service.impl;

import com.placesync.dto.response.EligibilityResult;
import com.placesync.entity.Job;
import com.placesync.entity.Student;
import com.placesync.service.EligibilityService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class EligibilityServiceImpl implements EligibilityService {

    @Override
    public EligibilityResult checkEligibility(
            Student student,
            Job job
    ) {

        List<String> reasons = new ArrayList<>();

        if (job.getApplicationDeadline().isBefore(
                LocalDate.now()
        )) {
            reasons.add(
                    "Application deadline has passed"
            );
        }

        if (student.getCgpa() < job.getMinimumCgpa()) {
            reasons.add(
                    "Student does not meet the minimum CGPA requirement"
            );
        }

        if (!student.getDepartment().equalsIgnoreCase(
                job.getEligibleDepartment()
        )) {
            reasons.add(
                    "Student's department is not eligible for this job"
            );
        }

        return EligibilityResult.builder()
                .eligible(reasons.isEmpty())
                .reasons(reasons)
                .build();
    }
}