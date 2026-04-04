package com.course.major.services;

import com.course.major.dto.JobDescriptionDto;
import com.course.major.entity.Job;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

public interface JobService {
    public void createJob(Job job, HttpServletRequest request);
    public void deactivateJob(String jobId, HttpServletRequest request);
    public List<JobDescriptionDto> myJobs(HttpServletRequest request);
}
