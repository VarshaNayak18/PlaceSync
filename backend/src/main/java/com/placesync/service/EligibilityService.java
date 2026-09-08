package com.placesync.service;

import com.placesync.dto.response.EligibilityResult;
import com.placesync.entity.Job;
import com.placesync.entity.Student;

public interface EligibilityService {

    EligibilityResult checkEligibility(
        Student student,
        Job job
    );
}