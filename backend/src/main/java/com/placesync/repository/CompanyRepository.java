package com.placesync.repository;

import com.placesync.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long> {

    Optional<Company> findByContactEmail(String contactEmail);

    boolean existsByContactEmail(String contactEmail);
}