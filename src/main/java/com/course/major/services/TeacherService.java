package com.course.major.services;

import com.course.major.dto.LoginInfoDto;
import com.course.major.dto.TeacherInfoDto;
import com.course.major.entity.TeacherEntity;

public interface TeacherService {
    public TeacherEntity getTeacher(String id);
    public void register(TeacherEntity teacherEntity);
    public TeacherInfoDto login(LoginInfoDto loginInfoDto);
}
