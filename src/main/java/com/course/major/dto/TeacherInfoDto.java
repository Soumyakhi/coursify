package com.course.major.dto;

import com.course.major.entity.TeacherEntity;

public class TeacherInfoDto {
    private String id;
    private String name;
    private String email;
    private String token;
    public TeacherInfoDto(TeacherEntity teacherEntity, String token) {
        this.id = teacherEntity.getId();
        this.name = teacherEntity.getName();
        this.email = teacherEntity.getEmail();
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
