package com.example.log_analyzer;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/logs")
@CrossOrigin(origins = "*") // Allows React frontend to make API calls without CORS errors
public class LogController {

    private final LogRepository logRepository;
    private final AiService aiService;

    // Inject both LogRepository and AiService via Constructor
    public LogController(LogRepository logRepository, AiService aiService) {
        this.logRepository = logRepository;
        this.aiService = aiService;
    }

    // 1. Get ALL logs -> GET http://localhost:8080/api/logs
    @GetMapping
    public List<LogMessage> getAllLogs() {
        return logRepository.findAll();
    }

    // 2. Server-Side Pagination -> GET http://localhost:8080/api/logs/paged?page=0&size=20
    @GetMapping("/paged")
    public Page<LogMessage> getPagedLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return logRepository.findAll(PageRequest.of(page, size, Sort.by("timestamp").descending()));
    }

    // 3. Get logs filtered by level -> GET http://localhost:8080/api/logs/level/ERROR
    @GetMapping("/level/{level}")
    public List<LogMessage> getLogsByLevel(@PathVariable String level) {
        return logRepository.findByLevelIgnoreCase(level);
    }

    // 4. Create a new log -> POST http://localhost:8080/api/logs
    @PostMapping
    public LogMessage createLog(@RequestBody LogMessage logMessage) {
        if (logMessage.getTimestamp() == null) {
            logMessage.setTimestamp(LocalDateTime.now());
        }
        return logRepository.save(logMessage);
    }

    // 5. AI Summary / Diagnosis -> GET http://localhost:8080/api/logs/ai-summary
    @GetMapping("/ai-summary")
    public Map<String, String> getAiSummary() {
        return Map.of("summary", aiService.analyzeSystemHealth());
    }

    // 6. Test Endpoint for Spring AOP Exception Logging -> GET http://localhost:8080/api/logs/test-error
    @GetMapping("/test-error")
    public String triggerError() {
        throw new RuntimeException("Simulated NullPointerException in OrderService line 88!");
    }
}