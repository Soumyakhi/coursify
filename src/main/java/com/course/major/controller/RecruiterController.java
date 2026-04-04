package com.course.major.controller;

import com.course.major.entity.Job;
import com.course.major.services.JobService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping("/recruiter")
public class RecruiterController {
    @GetMapping("/hi")
    public ResponseEntity<Object> hi() {
        return new ResponseEntity<>("hello", HttpStatus.OK);
    }
    @Autowired
    public JobService jobService;
    @PostMapping("/createJob")
    public ResponseEntity<Object> createJob(@RequestBody Job job, HttpServletRequest request) {
        jobService.createJob(job,request);
        return new ResponseEntity<>("Job Created", HttpStatus.OK);
    }
    @PutMapping("/deactivateJob/{jobId}")
    public ResponseEntity<Object> deactivateJob(@PathVariable String jobId, HttpServletRequest request) {
        jobService.deactivateJob(jobId,request);
        return new ResponseEntity<>("Job Deactivated", HttpStatus.OK);
    }
}
