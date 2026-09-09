package com.placesync.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {

    private long totalStudents;

    private long totalCompanies;

    private long totalJobs;

    private long totalApplications;

    private long totalSelected;

    private long totalScheduledInterviews;
}