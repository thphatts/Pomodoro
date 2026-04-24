package com.thphatts.promodo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.thphatts.promodo.models.StudySession;

import java.util.Map;

public interface StudySessionRepository extends JpaRepository<StudySession, Long> {
    // Ép JPA trả ra đúng cục JSON Thống kê mà Frontend cần
    @Query("SELECT new map(COUNT(s) as totalSessions, SUM(s.durationMinutes) as totalMinutes, MAX(s.durationMinutes) as longestSession) "
            +
            "FROM StudySession s WHERE s.user.id = :userId") // <--- Trỏ vào s.user.id
    Map<String, Object> getStatsByUserId(@Param("userId") Long userId);
}