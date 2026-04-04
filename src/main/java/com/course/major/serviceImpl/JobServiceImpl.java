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
import com.course.major.services.TeacherService;
import com.course.major.utils.JobUtil;
import com.course.major.utils.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
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
    JwtUtil  jwtUtil;
    @Autowired
    private JobRepo jobRepo;
    @Autowired
    private JobUtil jobUtil;

    @Override
    public void createJob(Job job, HttpServletRequest request) {
        try {
            Recruiter recruiter=recruiterService.getRecruiter(jwtUtil.extractUserIdFromRequest(request));
            List<StudentEntity>  studentEntity=studentRepo.findTop2By();
            Map<String,String> recommendationMap=new HashMap<>();
            for(StudentEntity student:studentEntity){
                recommendationMap.put(student.getId(), UUID.randomUUID().toString());
            }
            job.setRecruiterId(recruiter.getId());
            job.setActive(true);
            job.setRecommendationIds(recommendationMap);
            jobRepo.save(job);
        }
        catch (Exception e) {
            System.out.println("Unable to create job: ");
        }
    }
    @Override
    public void deactivateJob(String jobId, HttpServletRequest request) {
        try {
            Recruiter recruiter=recruiterService.getRecruiter(jwtUtil.extractUserIdFromRequest(request));
            Job job=jobRepo.findByIdAndRecruiterId(jobId,recruiter.getId());
            if(job.isActive()){
                job.setActive(false);
                jobRepo.save(job);
            }
            else {
                throw new Exception("Can not deactivate job");
            }
        }
        catch (Exception e) {
            System.out.println("Unable to create job: ");
        }
    }
    @Override
    public List<JobDescriptionDto> myJobs(HttpServletRequest request) {
        String studentId=jwtUtil.extractUserIdFromRequest(request);
        List<Job> jobs=jobRepo.findByRecommendationKeyOrderByIdDesc(studentId);
        List<JobDescriptionDto> jobsDto=new ArrayList<>();
        for(Job job:jobs){
            jobsDto.add(jobUtil.getJobDescriptionDto(job,studentId));
        }
        return jobsDto;
    }
}
