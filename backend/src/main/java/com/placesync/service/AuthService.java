package com.placesync.service;

import com.placesync.dto.request.LoginRequest;
import com.placesync.dto.request.RegisterRequest;
import com.placesync.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}