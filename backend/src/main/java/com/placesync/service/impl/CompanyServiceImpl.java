package com.placesync.service.impl;

import com.placesync.dto.request.CompanyRequest;
import com.placesync.dto.response.CompanyResponse;
import com.placesync.entity.Company;
import com.placesync.exception.ResourceNotFoundException;
import com.placesync.repository.CompanyRepository;
import com.placesync.service.CompanyService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyServiceImpl(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    @Override
    public CompanyResponse createCompany(CompanyRequest request) {

        Company company = Company.builder()
                .name(request.getName())
                .industry(request.getIndustry())
                .location(request.getLocation())
                .website(request.getWebsite())
                .contactEmail(request.getContactEmail())
                .build();

        Company savedCompany = companyRepository.save(company);

        return mapToResponse(savedCompany);
    }

    @Override
    public CompanyResponse getCompanyById(Long id) {

        Company company = companyRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Company not found with id: " + id
                        )
                );

        return mapToResponse(company);
    }

    @Override
    public List<CompanyResponse> getAllCompanies() {

        return companyRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private CompanyResponse mapToResponse(Company company) {

        return CompanyResponse.builder()
                .id(company.getId())
                .name(company.getName())
                .industry(company.getIndustry())
                .location(company.getLocation())
                .website(company.getWebsite())
                .contactEmail(company.getContactEmail())
                .build();
    }
}