package com.placesync.service.impl;

import com.placesync.dto.request.StudentRequest;
import com.placesync.dto.response.StudentResponse;
import com.placesync.entity.Student;
import com.placesync.entity.User;
import com.placesync.enums.Role;
import com.placesync.exception.ResourceNotFoundException;
import com.placesync.repository.StudentRepository;
import com.placesync.repository.UserRepository;
import com.placesync.service.StudentService;
import org.springframework.stereotype.Service;

@Service
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    public StudentServiceImpl(
            StudentRepository studentRepository,
            UserRepository userRepository
    ) {
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
    }

    @Override
    public StudentResponse createStudentProfile(
            Long userId,
            StudentRequest request
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + userId
                        )
                );

        if (user.getRole() != Role.STUDENT) {
            throw new IllegalStateException(
                    "Only students can create a student profile"
            );
        }

        if (studentRepository.findByUserId(userId).isPresent()) {
            throw new IllegalStateException(
                    "Student profile already exists for this user"
            );
        }

        if (studentRepository.existsByUsn(request.getUsn())) {
            throw new IllegalStateException(
                    "Student already exists with USN: " + request.getUsn()
            );
        }

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        userRepository.save(user);

        Student student = Student.builder()
                .usn(request.getUsn())
                .department(request.getDepartment())
                .cgpa(request.getCgpa())
                .phoneNumber(request.getPhoneNumber())
                .user(user)
                .build();

        Student savedStudent = studentRepository.save(student);

        return mapToResponse(savedStudent);
    }

    @Override
    public StudentResponse getStudentProfile(Long userId) {

        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student profile not found for user id: "
                                        + userId
                        )
                );

        return mapToResponse(student);
    }

    @Override
    public StudentResponse updateStudentProfile(
            Long userId,
            StudentRequest request
    ) {

        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student profile not found for user id: "
                                        + userId
                        )
                );

        User user = student.getUser();

        if (!student.getUsn().equals(request.getUsn())
                && studentRepository.existsByUsn(request.getUsn())) {

            throw new IllegalStateException(
                    "Student already exists with USN: "
                            + request.getUsn()
            );
        }

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        student.setUsn(request.getUsn());
        student.setDepartment(request.getDepartment());
        student.setCgpa(request.getCgpa());
        student.setPhoneNumber(request.getPhoneNumber());

        userRepository.save(user);
        Student updatedStudent = studentRepository.save(student);

        return mapToResponse(updatedStudent);
    }

    private StudentResponse mapToResponse(Student student) {

        return StudentResponse.builder()
                .id(student.getId())
                .name(student.getUser().getName())
                .email(student.getUser().getEmail())
                .usn(student.getUsn())
                .department(student.getDepartment())
                .cgpa(student.getCgpa())
                .phoneNumber(student.getPhoneNumber())
                .build();
    }
}