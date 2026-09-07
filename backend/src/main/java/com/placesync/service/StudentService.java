package com.placesync.service;

import com.placesync.dto.request.StudentRequest;
import com.placesync.dto.response.StudentResponse;

public interface StudentService {

    StudentResponse createStudentProfile(
            Long userId,
            StudentRequest request
    );

    StudentResponse getStudentProfile(Long userId);

    StudentResponse updateStudentProfile(
            Long userId,
            StudentRequest request
    );
}