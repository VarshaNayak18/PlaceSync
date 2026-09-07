package com.placesync.controller;

import com.placesync.dto.request.StudentRequest;
import com.placesync.dto.response.StudentResponse;
import com.placesync.entity.User;
import com.placesync.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
@PreAuthorize("hasRole('STUDENT')")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping("/profile")
    public ResponseEntity<StudentResponse> createStudentProfile(
            Authentication authentication,
            @Valid @RequestBody StudentRequest request
    ) {

        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();

        StudentResponse response =
                studentService.createStudentProfile(userId, request);

        return new ResponseEntity<>(
                response,
                HttpStatus.CREATED
        );
    }

    @GetMapping("/profile")
    public ResponseEntity<StudentResponse> getStudentProfile(
            Authentication authentication
    ) {

        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();

        return ResponseEntity.ok(
                studentService.getStudentProfile(userId)
        );
    }

    @PutMapping("/profile")
    public ResponseEntity<StudentResponse> updateStudentProfile(
            Authentication authentication,
            @Valid @RequestBody StudentRequest request
    ) {

        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();

        return ResponseEntity.ok(
                studentService.updateStudentProfile(
                        userId,
                        request
                )
        );
    }
}