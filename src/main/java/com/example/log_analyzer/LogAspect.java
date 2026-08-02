package com.example.log_analyzer;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Aspect
@Component
public class LogAspect {

    private final LogRepository logRepository;

    public LogAspect(LogRepository logRepository) {
        this.logRepository = logRepository;
    }

    // Intercepts exceptions thrown by any method in com.example.log_analyzer package
    @AfterThrowing(pointcut = "execution(* com.example.log_analyzer..*.*(..))", throwing = "ex")
    public void logException(JoinPoint joinPoint, Throwable ex) {
        String methodName = joinPoint.getSignature().toShortString();
        String errorMessage = String.format("Exception in %s: %s", methodName, ex.getMessage());

        LogMessage errorLog = new LogMessage("ERROR", errorMessage, LocalDateTime.now());
        logRepository.save(errorLog);
    }
}