package com.thphatts.promodo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.thphatts.promodo.Models.StudySession;

import java.util.Map;

public interface StudySessionRepository extends JpaRepository<StudySession, Long> {
    // Ép JPA trả ra đúng cục JSON Thống kê mà Frontend cần
    @Query("SELECT COUNT(s) as totalSessions, COALESCE(SUM(s.durationMinutes), 0) as totalMinutes, COALESCE(MAX(s.durationMinutes), 0) as longestSession FROM StudySession s WHERE s.userId = :userId")
    Map<String, Object> getStatsByUserId(@Param("userId") Long userId);
}