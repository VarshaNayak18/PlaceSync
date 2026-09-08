package com.placesync.dto.response;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobResponse {

    private Long id;
    private String title;
    private String description;
    private String location;
    private Double salary;
    private Double minimumCgpa;
    private String eligibleDepartment;
    private String requiredSkills;
    private LocalDate applicationDeadline;

    private Long companyId;
    private String companyName;
}