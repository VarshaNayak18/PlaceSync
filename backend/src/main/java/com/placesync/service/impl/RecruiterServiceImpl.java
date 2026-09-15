package com.placesync.service.impl;

import com.placesync.dto.request.RecruiterRequest;
import com.placesync.dto.response.AuthResponse;
import com.placesync.entity.Company;
import com.placesync.entity.User;
import com.placesync.enums.Role;
import com.placesync.exception.ConflictException;
import com.placesync.exception.ResourceNotFoundException;
import com.placesync.repository.CompanyRepository;
import com.placesync.repository.UserRepository;
import com.placesync.service.JwtService;
import com.placesync.service.RecruiterService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class RecruiterServiceImpl implements RecruiterService {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public RecruiterServiceImpl(
            UserRepository userRepository,
            CompanyRepository companyRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public AuthResponse createRecruiter(RecruiterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException(
                    "User already exists with email: " + request.getEmail()
            );
        }

        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Company not found with id: "
                                        + request.getCompanyId()
                        )
                );

        User recruiter = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.RECRUITER)
                .company(company)
                .build();

        User savedRecruiter = userRepository.save(recruiter);

        String token = jwtService.generateToken(savedRecruiter);

        return AuthResponse.builder()
                .token(token)
                .userId(savedRecruiter.getId())
                .name(savedRecruiter.getName())
                .email(savedRecruiter.getEmail())
                .role(savedRecruiter.getRole())
                .build();
    }
}