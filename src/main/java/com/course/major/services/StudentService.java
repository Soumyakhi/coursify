package com.course.major.services;

import com.course.major.dto.LoginInfoDto;
import com.course.major.dto.RegFileDto;
import com.course.major.dto.StudentInfoDto;
import com.course.major.entity.StudentEntity;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface StudentService {
    StudentEntity getStudent(String id);
    void register(StudentEntity student);
    StudentInfoDto login(LoginInfoDto loginInfoDto);
    void registerFile(RegFileDto regFileDto);
    void editStudent(HttpServletRequest request,StudentEntity studentEntity);
    boolean checkEnrolled(HttpServletRequest request,String courseId);
    void rate(HttpServletRequest request, String courseId, String rating);
}
