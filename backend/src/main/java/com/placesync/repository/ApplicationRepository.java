package com.placesync.repository;

import com.placesync.entity.Application;
import com.placesync.enums.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository
        extends JpaRepository<Application, Long> {

    List<Application> findByStudentId(Long studentId);

    List<Application> findByJobId(Long jobId);

    Optional<Application> findByStudentIdAndJobId(
            Long studentId,
            Long jobId
    );

    List<Application> findByStatus(ApplicationStatus status);

    boolean existsByStudentIdAndJobId(
            Long studentId,
            Long jobId
    );
}