package com.example.log_analyzer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class LogAnalyzerApplication {

	public static void main(String[] args) {
		SpringApplication.run(LogAnalyzerApplication.class, args);
	}

	@GetMapping("/test")
	public String test() {
		return "Spring Boot is working!";
	}
}