package com.course.major.services;

import com.course.major.dto.LoginInfoDto;
import com.course.major.dto.TeacherInfoDto;
import com.course.major.entity.TeacherEntity;

public interface TeacherService {
    TeacherEntity getTeacher(String id);
    void register(TeacherEntity teacherEntity);
    TeacherInfoDto login(LoginInfoDto loginInfoDto);
}
