package com.example.log_analyzer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LogRepository extends JpaRepository<LogMessage, Long> {

    // Custom JPA query method to find logs by severity level
    List<LogMessage> findByLevelIgnoreCase(String level);
}