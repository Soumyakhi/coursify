package com.course.major.dto;

import com.course.major.pojo.Question;

import java.util.List;

public class StartExamDTO {
    private String examVal;
    private String courseId;
    private int[] indexes;
    private Question[] questionList;
    public StartExamDTO(String examVal, String courseId, int[] indexes, Question[] questionList) {
        this.examVal = examVal;
        this.courseId = courseId;
        this.indexes = indexes;
        this.questionList = questionList;
    }

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

    public int[] getIndexes() {
        return indexes;
    }

    public void setIndexes(int[] indexes) {
        this.indexes = indexes;
    }

    public Question[] getQuestionList() {
        return questionList;
    }

    public void setQuestionList(Question[] questionList) {
        this.questionList = questionList;
    }
}
