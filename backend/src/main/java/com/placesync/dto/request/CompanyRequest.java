package com.placesync.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyRequest {

    @NotBlank(message = "Company name is required")
    private String name;

    private String industry;

    private String location;

    private String website;

    @NotBlank(message = "Contact email is required")
    @Email(message = "Please provide a valid contact email")
    private String contactEmail;
}