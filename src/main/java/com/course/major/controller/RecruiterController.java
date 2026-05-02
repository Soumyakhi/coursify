package com.course.major.controller;

import com.course.major.entity.Job;
import com.course.major.services.JobService;
import com.course.major.services.RecruiterService;
import io.github.sashirestela.cleverclient.annotation.GET;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping("/recruiter")
public class RecruiterController {
    @Autowired
    private RecruiterService recruiterService;

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
    @GetMapping("/fetchAllJobs")
    public ResponseEntity<Object> deactivateJob(HttpServletRequest request) {
        return new ResponseEntity<>(recruiterService.fetchJobsRecruiter(request), HttpStatus.OK);
    }
    @GetMapping("/verify/{jobId}/{referralId}")
    public ResponseEntity<Object> deactivateJob(@PathVariable String jobId,@PathVariable String referralId, HttpServletRequest request) {
        return new ResponseEntity<>(recruiterService.checkValidReference(request,jobId,referralId), HttpStatus.OK);
    }
}
