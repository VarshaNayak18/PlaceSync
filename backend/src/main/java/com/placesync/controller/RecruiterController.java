package com.placesync.controller;

import com.placesync.dto.request.RecruiterRequest;
import com.placesync.dto.response.AuthResponse;
import com.placesync.service.RecruiterService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/recruiters")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class RecruiterController {

    private final RecruiterService recruiterService;

    public RecruiterController(RecruiterService recruiterService) {
        this.recruiterService = recruiterService;
    }

    @PostMapping
    public ResponseEntity<AuthResponse> createRecruiter(
            @Valid @RequestBody RecruiterRequest request
    ) {
        return new ResponseEntity<>(
                recruiterService.createRecruiter(request),
                HttpStatus.CREATED
        );
    }
}