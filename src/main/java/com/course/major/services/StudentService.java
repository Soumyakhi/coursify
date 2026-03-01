package com.course.major.services;

import com.course.major.dto.LoginInfoDto;
import com.course.major.dto.RegFileDto;
import com.course.major.dto.StudentInfoDto;
import com.course.major.entity.StudentEntity;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface StudentService {
    public StudentEntity getStudent(String id);
    public void register(StudentEntity student);
    public StudentInfoDto login(LoginInfoDto loginInfoDto);
    public void registerFile(RegFileDto regFileDto);
    public void editStudent(HttpServletRequest request,StudentEntity studentEntity);
    public boolean checkEnrolled(HttpServletRequest request,String courseId);


}
