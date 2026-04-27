package com.course.major.dto;

import com.course.major.entity.StudentEntity;
import com.course.major.pojo.StudentCourse;

import java.util.List;
import java.util.Set;

public class StudentInferenceDTO {
    private String studentId;
    private String name;
    private List<String> skills;
    private String description;
    private List<StudentCourse> enrolledCourses;
    private Set<String> notInterestedCourses;

    public Set<String> getNotInterestedCourses() {
        return notInterestedCourses;
    }

    public void setNotInterestedCourses(Set<String> notInterestedCourses) {
        this.notInterestedCourses = notInterestedCourses;
    }

    public StudentInferenceDTO(StudentEntity studentEntity) {
        this.description=studentEntity.getDescription();
        this.studentId=studentEntity.getId();
        this.skills=studentEntity.getSkills();
        this.enrolledCourses=studentEntity.getEnrolledCourses();
        this.name=studentEntity.getName();
        this.notInterestedCourses=studentEntity.getNotInterestedCourses();
    }
    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<StudentCourse> getEnrolledCourses() {
        return enrolledCourses;
    }

    public void setEnrolledCourses(List<StudentCourse> enrolledCourses) {
        this.enrolledCourses = enrolledCourses;
    }
}
