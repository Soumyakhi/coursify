package com.course.major.controller;
import com.course.major.services.CourseService;
import com.course.major.services.InferenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
@CrossOrigin
@RestController
public class GeneralController {
    @Autowired
    private CourseService studentService;
    @Autowired
    private CourseService courseService;
    @Autowired
    private InferenceService inferenceService;
    @GetMapping("/fetchCourse/{courseId}")
    public ResponseEntity<Object> fetchCourse(@PathVariable String courseId) {
        return new ResponseEntity<>(courseService.fetchCourse(courseId), HttpStatus.OK);
    }
    @GetMapping("/search/{query}/{page}")
    public ResponseEntity<Object> search(@PathVariable String query,@PathVariable int page) {
        return new ResponseEntity<>(courseService.search(query,page), HttpStatus.OK);
    }
    /*@GetMapping("/getPages/{query}")
    public ResponseEntity<Object> getPages(@PathVariable String query) {
        return new ResponseEntity<>(courseService.getPageCount(query), HttpStatus.OK);
    }*/
    @GetMapping("/fetchAllCourse")
    public ResponseEntity<Object> fetchCourses() {
        return new ResponseEntity<>(courseService.fetchCourses(), HttpStatus.OK);
    }
    @GetMapping("/fetchAllStudents")
    public ResponseEntity<Object> fetchStudents() {
        return new ResponseEntity<>(inferenceService.getStudents(), HttpStatus.OK);
    }
}
