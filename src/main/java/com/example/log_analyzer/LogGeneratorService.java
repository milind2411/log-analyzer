package com.example.log_analyzer;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class LogGeneratorService {

    private final LogRepository repository;
    private final Random random = new Random();

    private final List<String> infoMessages = List.of(
            "User session extended",
            "Cache sync completed",
            "API payload processed successfully",
            "Database ping response time: 12ms"
    );

    private final List<String> warnMessages = List.of(
            "CPU utilization exceeded 80%",
            "Memory consumption high on instance worker-2",
            "Slow query detected: runtime > 450ms"
    );

    private final List<String> errorMessages = List.of(
            "Connection refused on port 5432",
            "JWT signature expired for user token",
            "Third-party API rate limit exceeded (HTTP 429)"
    );

    public LogGeneratorService(LogRepository repository) {
        this.repository = repository;
    }

    // Runs every 15 seconds automatically
    @Scheduled(fixedRate = 15000)
    public void generateRandomLog() {
        int chance = random.nextInt(100);
        String level;
        String msg;

        if (chance < 60) {
            level = "INFO";
            msg = infoMessages.get(random.nextInt(infoMessages.size()));
        } else if (chance < 85) {
            level = "WARN";
            msg = warnMessages.get(random.nextInt(warnMessages.size()));
        } else {
            level = "ERROR";
            msg = errorMessages.get(random.nextInt(errorMessages.size()));
        }

        repository.save(new LogMessage(level, msg, LocalDateTime.now()));
    }
}