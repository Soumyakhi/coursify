package com.course.major.config;


import io.github.sashirestela.openai.SimpleOpenAI;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GptConfig {
    @Value("${openai.api.key}")
    private String apiKey;
    @Bean
    public SimpleOpenAI simpleOpenAI() {
        return SimpleOpenAI.builder()
                .apiKey(apiKey)
                .build();
    }
}