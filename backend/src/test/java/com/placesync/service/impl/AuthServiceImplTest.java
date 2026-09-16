package com.placesync.service.impl;

import com.placesync.dto.request.LoginRequest;
import com.placesync.dto.request.RegisterRequest;
import com.placesync.dto.response.AuthResponse;
import com.placesync.entity.User;
import com.placesync.enums.Role;
import com.placesync.exception.ConflictException;
import com.placesync.exception.ResourceNotFoundException;
import com.placesync.exception.UnauthorizedException;
import com.placesync.repository.UserRepository;
import com.placesync.service.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    private AuthServiceImpl authService;

    @BeforeEach
    void setUp() {
        authService = new AuthServiceImpl(
                userRepository,
                passwordEncoder,
                jwtService
        );
    }

    @Test
    void shouldRegisterNewStudentSuccessfully() {

        RegisterRequest request = RegisterRequest.builder()
                .name("Test Student")
                .email("student@test.com")
                .password("password123")
                .build();

        User savedUser = User.builder()
                .id(1L)
                .name("Test Student")
                .email("student@test.com")
                .password("encodedPassword")
                .role(Role.STUDENT)
                .build();

        when(userRepository.existsByEmail(request.getEmail()))
                .thenReturn(false);

        when(passwordEncoder.encode(request.getPassword()))
                .thenReturn("encodedPassword");

        when(userRepository.save(any(User.class)))
                .thenReturn(savedUser);

        when(jwtService.generateToken(savedUser))
                .thenReturn("test-jwt-token");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("test-jwt-token", response.getToken());
        assertEquals(1L, response.getUserId());
        assertEquals("Test Student", response.getName());
        assertEquals("student@test.com", response.getEmail());
        assertEquals(Role.STUDENT, response.getRole());

        verify(userRepository).existsByEmail("student@test.com");
        verify(passwordEncoder).encode("password123");
        verify(userRepository).save(any(User.class));
        verify(jwtService).generateToken(savedUser);
    }

    @Test
    void shouldRejectRegistrationWhenEmailAlreadyExists() {

        RegisterRequest request = RegisterRequest.builder()
                .name("Test Student")
                .email("student@test.com")
                .password("password123")
                .build();

        when(userRepository.existsByEmail(request.getEmail()))
                .thenReturn(true);

        assertThrows(
                ConflictException.class,
                () -> authService.register(request)
        );

        verify(userRepository).existsByEmail("student@test.com");
        verify(userRepository, never()).save(any(User.class));
        verify(jwtService, never()).generateToken(any(User.class));
    }

    @Test
    void shouldLoginSuccessfullyWithValidCredentials() {

        LoginRequest request = LoginRequest.builder()
                .email("student@test.com")
                .password("password123")
                .build();

        User user = User.builder()
                .id(1L)
                .name("Test Student")
                .email("student@test.com")
                .password("encodedPassword")
                .role(Role.STUDENT)
                .build();

        when(userRepository.findByEmail(request.getEmail()))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )).thenReturn(true);

        when(jwtService.generateToken(user))
                .thenReturn("test-jwt-token");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("test-jwt-token", response.getToken());
        assertEquals(1L, response.getUserId());
        assertEquals("Test Student", response.getName());
        assertEquals("student@test.com", response.getEmail());
        assertEquals(Role.STUDENT, response.getRole());

        verify(userRepository).findByEmail("student@test.com");
        verify(passwordEncoder).matches(
                "password123",
                "encodedPassword"
        );
        verify(jwtService).generateToken(user);
    }

    @Test
    void shouldRejectLoginWhenPasswordIsIncorrect() {

        LoginRequest request = LoginRequest.builder()
                .email("student@test.com")
                .password("wrongPassword")
                .build();

        User user = User.builder()
                .id(1L)
                .name("Test Student")
                .email("student@test.com")
                .password("encodedPassword")
                .role(Role.STUDENT)
                .build();

        when(userRepository.findByEmail(request.getEmail()))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )).thenReturn(false);

        assertThrows(
                UnauthorizedException.class,
                () -> authService.login(request)
        );

        verify(userRepository).findByEmail("student@test.com");
        verify(passwordEncoder).matches(
                "wrongPassword",
                "encodedPassword"
        );
        verify(jwtService, never()).generateToken(any(User.class));
    }

    @Test
    void shouldRejectLoginWhenUserDoesNotExist() {

        LoginRequest request = LoginRequest.builder()
                .email("unknown@test.com")
                .password("password123")
                .build();

        when(userRepository.findByEmail(request.getEmail()))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> authService.login(request)
        );

        verify(userRepository).findByEmail("unknown@test.com");
        verify(passwordEncoder, never()).matches(anyString(), anyString());
        verify(jwtService, never()).generateToken(any(User.class));
    }
}