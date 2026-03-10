package com.course.major.services;

import com.course.major.dto.LoginInfoDto;
import com.course.major.dto.RecruiterInfoDTO;
import com.course.major.dto.StudentInfoDto;
import com.course.major.entity.Recruiter;
import com.course.major.entity.StudentEntity;

public interface RecruiterService {
    Recruiter getRecruiter(String id);
    void register(Recruiter recruiter);
    RecruiterInfoDTO login(LoginInfoDto loginInfoDto);
}
