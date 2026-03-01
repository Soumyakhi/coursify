package com.course.major.dto;

import com.course.major.pojo.Question;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public class CourseDto {
    private String name;
    private String description;
    private int level;
    private List<Question> questions;
    private String rating;
    private String videoFilePath;
    private int totalEnrolled;
    public CourseDto() {
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public int getTotalEnrolled() {
        return totalEnrolled;
    }

    public void setTotalEnrolled(int totalEnrolled) {
        this.totalEnrolled = totalEnrolled;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public int getLevel() {
        return level;
    }
    public void setLevel(int level) {
        this.level = level;
    }
    public List<Question> getQuestions() {
        return questions;
    }
    public void setQuestions(List<Question> questions) {
        if (questions == null || questions.size() != 5) {
            throw new IllegalArgumentException("Course must contain exactly 5 questions");
        }
        this.questions = questions;
    }
    public String getRating() {
        return rating;
    }
    public void setRating(String rating) {
        this.rating = rating;
    }
    public String getVideoFilePath() {
        return videoFilePath;
    }
    public void setVideoFilePath(String videoFilePath) {
        this.videoFilePath = videoFilePath;
    }
}