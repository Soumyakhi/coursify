package com.course.major.pojo;

public class StudentCourse {
    private String courseName;
    private String description;
    private String courseId;
    private String percentageMarks;
    private boolean isComplete;
    private String rating;
    public StudentCourse(String courseName,String description,String courseId, String percentageMarks, boolean isComplete, String rating) {
        this.courseId = courseId;
        this.percentageMarks = percentageMarks;
        this.isComplete = isComplete;
        this.rating = rating;
        this.description = description;
        this.courseName = courseName;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public StudentCourse() {
    }
    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    public String getPercentageMarks() {
        return percentageMarks;
    }

    public void setPercentageMarks(String percentageMarks) {
        this.percentageMarks = percentageMarks;
    }

    public boolean isComplete() {
        return isComplete;
    }

    public void setComplete(boolean complete) {
        isComplete = complete;
    }

    public String getRating() {
        return rating;
    }

    public void setRating(String rating) {
        this.rating = rating;
    }

    public boolean getIsComplete() {
        return isComplete;
    }
}
