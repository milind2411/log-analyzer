package com.example.log_analyzer;

import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Aspect
@Component
public class GlobalExceptionLogger {

    private final LogRepository logRepository;

    public GlobalExceptionLogger(LogRepository logRepository) {
        this.logRepository = logRepository;
    }

    // Intercepts any exception thrown by any method in com.example.log_analyzer package
    @AfterThrowing(pointcut = "execution(* com.example.log_analyzer..*.*(..))", throwing = "ex")
    public void logException(Exception ex) {
        LogMessage log = new LogMessage();
        log.setLevel("ERROR");
        log.setMessage("AOP Captured Exception: " + ex.getClass().getSimpleName() + " - " + ex.getMessage());
        log.setTimestamp(LocalDateTime.now());

        logRepository.save(log);
        System.out.println("🚨 AOP Interceptor automatically logged error to PostgreSQL: " + ex.getMessage());
    }
}