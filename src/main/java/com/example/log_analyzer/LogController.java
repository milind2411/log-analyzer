package com.example.log_analyzer;

import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/logs")
@CrossOrigin(origins = "*") // Allows React frontend to make API calls without CORS errors
public class LogController {

    private final LogRepository logRepository;

    public LogController(LogRepository logRepository) {
        this.logRepository = logRepository;
    }

    // 1. Get ALL logs -> GET http://localhost:8080/api/logs
    @GetMapping
    public List<LogMessage> getAllLogs() {
        return logRepository.findAll();
    }

    // 2. Get logs filtered by level -> GET http://localhost:8080/api/logs/level/ERROR
    @GetMapping("/level/{level}")
    public List<LogMessage> getLogsByLevel(@PathVariable String level) {
        return logRepository.findByLevelIgnoreCase(level);
    }

    // 3. Create a new log -> POST http://localhost:8080/api/logs
    @PostMapping
    public LogMessage createLog(@RequestBody LogMessage logMessage) {
        if (logMessage.getTimestamp() == null) {
            logMessage.setTimestamp(LocalDateTime.now());
        }
        return logRepository.save(logMessage);
    }

    // 4. Test Endpoint for Spring AOP Exception Logging -> GET http://localhost:8080/api/logs/test-error
    @GetMapping("/test-error")
    public String triggerError() {
        throw new RuntimeException("Simulated NullPointerException in OrderService line 88!");
    }
}