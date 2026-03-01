package com.course.major.pojo;

public class StudentCourse {
    private String courseId;
    private String percentageMarks;
    private boolean isComplete;
    private String rating;
    public StudentCourse(String courseId, String percentageMarks, boolean isComplete, String rating) {
        this.courseId = courseId;
        this.percentageMarks = percentageMarks;
        this.isComplete = isComplete;
        this.rating = rating;
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
}
