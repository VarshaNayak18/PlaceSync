package com.placesync.service;

import com.placesync.dto.request.CompanyRequest;
import com.placesync.dto.response.CompanyResponse;

import java.util.List;

public interface CompanyService {

    CompanyResponse createCompany(CompanyRequest request);

    CompanyResponse getCompanyById(Long id);

    List<CompanyResponse> getAllCompanies();
}
