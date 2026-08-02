package com.example.log_analyzer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LogRepository extends JpaRepository<LogMessage, Long> {

    // Add this line so Spring Data JPA generates the query automatically
    List<LogMessage> findByLevelIgnoreCase(String level);

}