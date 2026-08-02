package com.example.log_analyzer;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AiService {

    private final LogRepository repository;
    private final RestTemplate restTemplate;

    @Value("${groq.api.key}")
    private String apiKey;

    private static final String GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

    public AiService(LogRepository repository, RestTemplate restTemplate) {
        this.repository = repository;
        this.restTemplate = restTemplate;
    }

    public String analyzeSystemHealth() {
        // Fetch top 10 most recent logs
        List<LogMessage> recentLogs = repository.findAll(
                PageRequest.of(0, 10, Sort.by("timestamp").descending())
        ).getContent();

        if (recentLogs.isEmpty()) {
            return "No logs available to analyze.";
        }

        // Format logs into string
        String logStream = recentLogs.stream()
                .map(log -> String.format("[%s] %s: %s", log.getTimestamp(), log.getLevel(), log.getMessage()))
                .collect(Collectors.joining("\n"));

        // Build Prompt for LLM
        String prompt = "You are a DevOps and Reliability Engineering Expert analyzing live application logs.\n" +
                "Analyze the following log entries and provide a concise (2-3 sentences) health summary, root cause diagnosis, and recommended immediate action:\n\n" +
                logStream;

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> systemMessage = Map.of("role", "system", "content", "You are an expert log analyzer assistant.");
            Map<String, Object> userMessage = Map.of("role", "user", "content", prompt);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "llama-3.3-70b-versatile");
            requestBody.put("messages", List.of(systemMessage, userMessage));
            requestBody.put("temperature", 0.5);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(GROQ_API_URL, entity, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                List choices = (List) response.getBody().get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map firstChoice = (Map) choices.get(0);
                    Map message = (Map) firstChoice.get("message");
                    return (String) message.get("content");
                }
            }
            return "Failed to parse AI response.";
        } catch (Exception e) {
            return "AI Analysis temporarily unavailable: " + e.getMessage();
        }
    }
}