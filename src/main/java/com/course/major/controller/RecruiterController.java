package com.course.major.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
@RequestMapping("/recruiter")
public class RecruiterController {
    @GetMapping("/hi")
    public ResponseEntity<Object> hi() {
        return new ResponseEntity<>("hello", HttpStatus.OK);
    }
}
