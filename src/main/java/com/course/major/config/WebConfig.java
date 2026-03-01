package com.course.major.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry
                .addResourceHandler("/student/hls/**")
                .addResourceLocations(
                        "file:C:/Users/Soumya/Downloads/Major/major/uploads/hls/"
                )
                .setCachePeriod(0);
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {

        // HLS playlists + TS segments
        registry.addMapping("/student/hls/**")
                .allowedOrigins(
                        "http://127.0.0.1:5500",
                        "http://localhost:5500"
                )
                .allowedMethods("GET")
                .allowedHeaders("*");

        // AES-128 key endpoint (XHR + Authorization header)
        registry.addMapping("/student/video/key/**")
                .allowedOrigins(
                        "http://127.0.0.1:5500",
                        "http://localhost:5500"
                )
                .allowedMethods("GET", "OPTIONS")
                .allowedHeaders("Authorization");
    }
}
