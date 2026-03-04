package com.course.major.services;

import com.course.major.dto.CourseDto;
import com.course.major.entity.Course;
import com.course.major.pojo.StudentAnswer;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CourseService {
    Course getCourse(String id);
    void addCourse(HttpServletRequest req, String courseDTO, MultipartFile material);
    void enroll(HttpServletRequest request,String courseId);
    CourseDto fetchCourse(String courseId);
    String takeExam(HttpServletRequest request, String courseId);
    String submitExam(HttpServletRequest request, String courseId, String examVal, List<StudentAnswer> answers);
    ResponseEntity<byte[]> getKeyVideo(HttpServletRequest request, String videoKeyId);
    List<CourseDto> findMyCourses(HttpServletRequest request);
    List<CourseDto> search(String query,int page);
    long getPageCount(String query);
}
