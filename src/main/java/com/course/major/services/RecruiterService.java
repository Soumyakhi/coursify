package com.course.major.services;

import com.course.major.dto.JobDescriptionDto;
import com.course.major.dto.LoginInfoDto;
import com.course.major.dto.RecruiterInfoDTO;
import com.course.major.dto.StudentInfoDto;
import com.course.major.entity.Job;
import com.course.major.entity.Recruiter;
import com.course.major.entity.StudentEntity;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

public interface RecruiterService {
    Recruiter getRecruiter(String id);
    void register(Recruiter recruiter);
    RecruiterInfoDTO login(LoginInfoDto loginInfoDto);
    boolean checkValidReference(HttpServletRequest request,String jobId,String referenceId);
    List<Job> fetchJobsRecruiter(HttpServletRequest request);
}
