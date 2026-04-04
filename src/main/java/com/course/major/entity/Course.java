package com.course.major.entity;

import com.course.major.pojo.Question;
import org.hibernate.validator.constraints.UniqueElements;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "course")
public class Course {
    @Id
    private String id;
    private String name;
    private String teacherId;
    private String teacherName;
    private String videoFile;
    @UniqueElements
    private List<String> timeStamps;
    private int level;
    public Course() {}
    public Course(String name, String teacherId, String teacherName, List<Question> questions, String description, String videoFile
    , int level,List<String> timeStamps) {
        this.name = name;
        this.teacherId = teacherId;
        this.teacherName = teacherName;
        this.questions = questions;
        this.description = description;
        this.videoFile = videoFile;
        this.level = level;
        this.timeStamps = timeStamps;
    }

    public List<String> getTimeStamps() {
        return timeStamps;
    }

    public void setTimeStamps(List<String> timeStamps) {
        this.timeStamps = timeStamps;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public String getVideoFile() {
        return videoFile;
    }

    public void setVideoFile(String videoFile) {
        this.videoFile = videoFile;
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

    public String getTeacherName() {
        return teacherName;
    }

    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }

    public String getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(String teacherId) {
        this.teacherId = teacherId;
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        description = description;
    }

    private List<Question> questions;
    private String description;
}
