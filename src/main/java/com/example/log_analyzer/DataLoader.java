package com.example.log_analyzer;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.util.List;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(LogRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                // Adjust field setters if your LogMessage fields differ
                LogMessage log1 = new LogMessage();
                log1.setLevel("INFO");
                log1.setMessage("System initialized successfully");
                log1.setTimestamp(LocalDateTime.now().minusMinutes(30));

                LogMessage log2 = new LogMessage();
                log2.setLevel("WARN");
                log2.setMessage("High memory utilization detected (>85%)");
                log2.setTimestamp(LocalDateTime.now().minusMinutes(15));

                LogMessage log3 = new LogMessage();
                log3.setLevel("ERROR");
                log3.setMessage("Database Connection Timeout on pool-1");
                log3.setTimestamp(LocalDateTime.now().minusMinutes(10));

                LogMessage log4 = new LogMessage();
                log4.setLevel("INFO");
                log4.setMessage("User authentication token refreshed");
                log4.setTimestamp(LocalDateTime.now().minusMinutes(5));

                LogMessage log5 = new LogMessage();
                log5.setLevel("ERROR");
                log5.setMessage("NullPointerException in Payment Gateway service");
                log5.setTimestamp(LocalDateTime.now().minusMinutes(2));

                repository.saveAll(List.of(log1, log2, log3, log4, log5));
                System.out.println("✅ Sample logs seeded into PostgreSQL database successfully.");
            } else {
                System.out.println("ℹ️ Database already contains logs. Skipping seeding.");
            }
        };
    }
}