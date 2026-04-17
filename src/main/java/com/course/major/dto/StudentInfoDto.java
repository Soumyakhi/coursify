package com.course.major.dto;

import com.course.major.entity.StudentEntity;
import com.course.major.pojo.StudentCourse;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class StudentInfoDto {

    private String id;
    private String name;
    private String email;
    private String token;
    private List<String> skills;
    private String phoneNumber;
    private String description;
    private List<StudentCourse> enrolledCourses;
    public StudentInfoDto() {

    }
    public StudentInfoDto(String id,
                          String name,
                          String email,
                          String token,
                          List<String> skills,
                          String phoneNumber,
                          String description,List<StudentCourse> enrolledCourses) {

        this.id = id;
        this.name = name;
        this.email = email;
        this.token = token;
        this.skills = skills;
        this.phoneNumber = phoneNumber;
        this.description = description;
        this.enrolledCourses = enrolledCourses;
    }

    // Convenience constructor from entity
    public StudentInfoDto(StudentEntity student, String token) {
        this.id = student.getId();
        this.name = student.getName();
        this.email = student.getEmail();
        this.skills = student.getSkills();
        this.phoneNumber = student.getPhoneNumber();
        this.description = student.getDescription();
        this.enrolledCourses = student.getEnrolledCourses();
        this.token = token;
    }


    // Getters and Setters

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

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
