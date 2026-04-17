package com.course.major.dto;

import com.course.major.pojo.StudentAnswer;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public class ExamSubmissionDto {

    private String examVal;
    private String courseId;

    @NotNull(message = "Answers list cannot be null")
    @Size(min = 3, max = 3, message = "Answers list must contain exactly 3 items")
    private List<StudentAnswer> answers;
    public String getExamVal() {
        return examVal;
    }
    public void setExamVal(String examVal) {
        this.examVal = examVal;
    }
    public String getCourseId() {
        return courseId;
    }
    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }
    public @NotNull List<StudentAnswer> getAnswers() {
        return answers;
    }
    public void setAnswers(List<StudentAnswer> answers) {
        this.answers = answers;
    }
}