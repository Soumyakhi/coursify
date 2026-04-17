package com.course.major.controller;

import com.course.major.dto.ExamSubmissionDto;
import com.course.major.entity.StudentEntity;
import com.course.major.services.CourseService;
import com.course.major.services.InferenceService;
import com.course.major.services.JobService;
import com.course.major.services.StudentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
@CrossOrigin(
        origins = {"http://127.0.0.1:5500"},
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.OPTIONS}
)
@RestController
@RequestMapping("/student")
public class StudentController {
    @Autowired
    StudentService studentService;
    @Autowired
    private InferenceService inferenceService;

    @GetMapping("/hi")
    public ResponseEntity<Object> hi() {
        return new ResponseEntity<>("hello", HttpStatus.OK);
    }
    @PutMapping("/editStd")
    public ResponseEntity<Object> editStd(HttpServletRequest request,@Valid @RequestBody StudentEntity studentEntity) {
        studentService.editStudent(request,studentEntity);
        return new ResponseEntity<>("Student Updated", HttpStatus.OK);
    }
    @Autowired
    CourseService courseService;
    @PutMapping("/enrollCourse/{courseId}")
    public ResponseEntity<Object> enrollCourse(HttpServletRequest request,@PathVariable String courseId) {
        courseService.enroll(request,courseId);
        return new ResponseEntity<>("Student Enrolled", HttpStatus.OK);
    }
    @PutMapping("/startExam/{courseId}")
    public ResponseEntity<Object> startExam(HttpServletRequest request,@PathVariable String courseId) {
        return new ResponseEntity<>(courseService.takeExam(request,courseId), HttpStatus.OK);
    }
    @PutMapping("/submitExam")
    public ResponseEntity<Object> submit(HttpServletRequest request,@Valid @RequestBody ExamSubmissionDto examSubmissionDto) {
        return new ResponseEntity<>(courseService.submitExam(request,examSubmissionDto.getCourseId(),examSubmissionDto.getExamVal(),
                examSubmissionDto.getAnswers()), HttpStatus.OK);
    }
    @GetMapping("/video/key/{videoKeyId}")
    public ResponseEntity<byte[]> getKey(HttpServletRequest request,@PathVariable String videoKeyId) {
        return courseService.getKeyVideo(request,videoKeyId);
    }
    @PutMapping("/rateCourse/{courseId}/{rating}")
    public ResponseEntity<Object> rateCourse(HttpServletRequest request,@PathVariable String courseId,@PathVariable String rating) {
        studentService.rate(request,courseId,rating);
        return new ResponseEntity<>("Rating added", HttpStatus.OK);
    }
    @GetMapping("/fetchMyCourses/")
    public ResponseEntity<Object> fetchMyCourses(HttpServletRequest request) {
        return new ResponseEntity<>(courseService.findMyCourses(request), HttpStatus.OK);
    }
    @GetMapping("/checkEnrolled/{courseId}")
    public ResponseEntity<Object> checkEnrolled(HttpServletRequest request,@PathVariable String courseId) {
        return new ResponseEntity<>(studentService.checkEnrolled(request,courseId), HttpStatus.OK);
    }
    @Autowired
    JobService jobService;
    @GetMapping("/myRecommendedJobs")
    public ResponseEntity<Object> myRecommendedJobs(HttpServletRequest request) {
        return new ResponseEntity<>(jobService.myJobs(request), HttpStatus.OK);
    }
    @GetMapping("/fetchCourseStd/{courseId}")
    public ResponseEntity<Object> fetchCourse(HttpServletRequest request,@PathVariable String courseId) {
        return new ResponseEntity<>(courseService.fetchCourseStudent(request,courseId), HttpStatus.OK);
    }
    @GetMapping("/recommend")
    public ResponseEntity<Object> fetchCourse(HttpServletRequest request) {
        return new ResponseEntity<>(inferenceService.recommendCourse(request), HttpStatus.OK);
    }
}
