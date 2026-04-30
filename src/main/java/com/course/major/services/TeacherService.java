package com.course.major.services;

import com.course.major.dto.CourseDto;
import com.course.major.dto.LoginInfoDto;
import com.course.major.dto.TeacherInfoDto;
import com.course.major.entity.TeacherEntity;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

public interface TeacherService {
    TeacherEntity getTeacher(String id);
    void register(TeacherEntity teacherEntity);
    TeacherInfoDto login(LoginInfoDto loginInfoDto);
    List<CourseDto> teacherCourses(HttpServletRequest request);
}
