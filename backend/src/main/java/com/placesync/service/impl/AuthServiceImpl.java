package com.placesync.service.impl;

import com.placesync.dto.request.LoginRequest;
import com.placesync.dto.request.RegisterRequest;
import com.placesync.dto.response.AuthResponse;
import com.placesync.entity.User;
import com.placesync.enums.Role;
import com.placesync.exception.ResourceNotFoundException;
import com.placesync.repository.UserRepository;
import com.placesync.service.AuthService;
import com.placesync.service.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.placesync.exception.ConflictException;
import com.placesync.exception.UnauthorizedException;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException(
                "User already exists with email: " + request.getEmail()
            );
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.STUDENT)
                .build();

        User savedUser = userRepository.save(user);

        String token = jwtService.generateToken(savedUser);

        return mapToAuthResponse(savedUser, token);
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with email: "
                                        + request.getEmail()
                        )
                );

        if (!passwordEncoder.matches(
            request.getPassword(),
            user.getPassword()
        )) {
            throw new UnauthorizedException("Invalid email or password");
        }

        String token = jwtService.generateToken(user);

        return mapToAuthResponse(user, token);
    }

    private AuthResponse mapToAuthResponse(
            User user,
            String token
    ) {
        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}