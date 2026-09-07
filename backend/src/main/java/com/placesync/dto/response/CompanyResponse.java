package com.placesync.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyResponse {

    private Long id;

    private String name;

    private String industry;

    private String location;

    private String website;

    private String contactEmail;
}