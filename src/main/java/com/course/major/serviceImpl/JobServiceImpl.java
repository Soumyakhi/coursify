package com.course.major.serviceImpl;

import com.course.major.dto.JobDescriptionDto;
import com.course.major.entity.Job;
import com.course.major.entity.Recruiter;
import com.course.major.entity.StudentEntity;
import com.course.major.repo.JobRepo;
import com.course.major.repo.RecruiterRepo;
import com.course.major.repo.StudentRepo;
import com.course.major.services.JobService;
import com.course.major.services.RecruiterService;
import com.course.major.utils.JobUtil;
import com.course.major.utils.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class JobServiceImpl implements JobService {

    @Autowired
    private RecruiterService recruiterService;
    @Autowired
    private RecruiterRepo recruiterRepo;
    @Autowired
    private StudentRepo studentRepo;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private JobRepo jobRepo;
    @Autowired
    private JobUtil jobUtil;
    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public void createJob(Job job, HttpServletRequest request) {
        try {
            Recruiter recruiter = recruiterService.getRecruiter(jwtUtil.extractUserIdFromRequest(request));
            List<StudentEntity> studentEntity = studentRepo.findTopBy(Pageable.ofSize(job.getTotalRecommendations()));
            Map<String, String> recommendationMap = new HashMap<>();
            for (StudentEntity student : studentEntity) {
                recommendationMap.put(student.getId(), UUID.randomUUID().toString());
            }
            job.setRecruiterId(recruiter.getId());
            job.setActive(true);
            job.setRecommendationIds(recommendationMap);
            jobRepo.save(job);
        } catch (Exception e) {
            System.out.println("Unable to create job: " + e.getMessage());
        }
    }

    @Override
    public void deactivateJob(String jobId, HttpServletRequest request) {
        try {
            Recruiter recruiter = recruiterService.getRecruiter(jwtUtil.extractUserIdFromRequest(request));
            Job job = jobRepo.findByIdAndRecruiterId(jobId, recruiter.getId());
            if (job.isActive()) {
                job.setActive(false);
                jobRepo.save(job);
            } else {
                throw new Exception("Cannot deactivate job");
            }
        } catch (Exception e) {
            System.out.println("Unable to deactivate job: " + e.getMessage());
        }
    }

    @Override
    public List<JobDescriptionDto> myJobs(HttpServletRequest request) {
        String studentId = jwtUtil.extractUserIdFromRequest(request);

        Query query = new Query();
        query.addCriteria(Criteria.where("recommendationIds." + studentId).exists(true));
        query.addCriteria(Criteria.where("active").is(true));
        query.with(Sort.by(Sort.Direction.DESC, "_id"));

        List<Job> jobs = mongoTemplate.find(query, Job.class);

        List<JobDescriptionDto> jobsDto = new ArrayList<>();
        for (Job job : jobs) {
            System.out.println("Found job: " + job.getId());
            jobsDto.add(jobUtil.getJobDescriptionDto(job, studentId));
        }

        return jobsDto;
    }
}