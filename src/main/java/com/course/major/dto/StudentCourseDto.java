package com.course.major.dto;

import com.course.major.entity.Course;
import com.course.major.entity.StudentEntity;
import com.course.major.pojo.StudentCourse;

public class StudentCourseDto {
    private String courseId;
    private String courseName;
    private String description;
    private String rating;
    private boolean isComplete;
    private String marks;
    private boolean isEnrolled;
    public StudentCourseDto() {}
    public StudentCourseDto(StudentEntity student, Course course) {
        this.courseId = course.getId();
        this.courseName = course.getName();
        this.description = course.getDescription();
        for(StudentCourse studentCourse: student.getEnrolledCourses()){
            if (studentCourse.getCourseId().equals(courseId)) {
                this.marks="0";
                this.isEnrolled = true;
                if(studentCourse.isComplete()){
                    this.isComplete = true;
                    this.marks = studentCourse.getPercentageMarks();
                }
                this.rating=studentCourse.getRating();
                break;
            }
        }
    }
    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
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

    public String getRating() {
        return rating;
    }

    public void setRating(String rating) {
        this.rating = rating;
    }

    public boolean isComplete() {
        return isComplete;
    }

    public void setComplete(boolean complete) {
        isComplete = complete;
    }

    public String getMarks() {
        return marks;
    }

    public void setMarks(String marks) {
        this.marks = marks;
    }

    public boolean isEnrolled() {
        return isEnrolled;
    }

    public void setEnrolled(boolean enrolled) {
        isEnrolled = enrolled;
    }
}
