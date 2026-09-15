package com.placesync.service;

import com.placesync.dto.request.RecruiterRequest;
import com.placesync.dto.response.AuthResponse;

public interface RecruiterService {

    AuthResponse createRecruiter(RecruiterRequest request);
}