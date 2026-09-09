package com.placesync.repository;

import com.placesync.entity.Interview;
import com.placesync.enums.InterviewStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InterviewRepository
        extends JpaRepository<Interview, Long> {

    Optional<Interview> findByApplicationId(Long applicationId);

    List<Interview> findByStatus(InterviewStatus status);

    boolean existsByApplicationId(Long applicationId);
}