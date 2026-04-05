package com.course.major.entity;

import com.course.major.pojo.StudentCourse;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
@Document(collection = "students")
public class StudentEntity {
    @Id
    private String id;
    @NotNull
    private String name;
    private List<String> skills;
    private String phoneNumber;
    @Indexed(unique = true)
    @NotNull
    private String email;
    private String password;
    private String description;
    private List<StudentCourse> enrolledCourses;
    public StudentEntity() {
        name = "";
        email = "";
    }
    public StudentEntity(@NotNull String name,
                         List<String> skills,
                         String phoneNumber,
                         @NotNull String email,
                         String password,
                         String description, List<String> courses, List<StudentCourse> enrolledCourses) {

        this.name = name;
        this.skills = skills;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.password = password;
        this.description = description;
        this.enrolledCourses = enrolledCourses;

    }
    // Getters and Setters
    public List<StudentCourse> getEnrolledCourses() {
        return enrolledCourses;
    }
    public void setEnrolledCourses(List<StudentCourse> enrolledCourses) {
        this.enrolledCourses = enrolledCourses;
    }
    public String getId() {
        return id;
    }

    public @NotNull String getName() {
        return name;
    }

    public List<String> getSkills() {
        return skills;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public @NotNull String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getDescription() {
        return description;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setName(@NotNull String name) {
        this.name = name;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public void setEmail(@NotNull String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "StudentEntity{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", skills=" + skills +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}