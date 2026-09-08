package com.placesync.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EligibilityResult {

    private boolean eligible;

    private List<String> reasons;
}