package com.course.major.utils;

import com.course.major.dto.JobDescriptionDto;
import com.course.major.entity.Job;
import com.course.major.entity.Recruiter;
import com.course.major.repo.JobRepo;
import com.course.major.repo.RecruiterRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class JobUtil {
    @Autowired
    private JobRepo jobRepo;
    @Autowired
    private RecruiterRepo recruiterRepo;
    public JobDescriptionDto getJobDescriptionDto(Job job, String studentId) {
        Recruiter recruiter = recruiterRepo.findById(job.getRecruiterId())
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));
        String recommendationVal = job.getRecommendationIds().get(studentId);
        if (recommendationVal == null) {
            throw new RuntimeException("Recommendation not found");
        }
        return new JobDescriptionDto(job, recruiter, recommendationVal);
    }
}