package com.placesync.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentResponse {

    private Long id;

    private String name;

    private String email;

    private String usn;

    private String department;

    private Double cgpa;

    private String phoneNumber;
}