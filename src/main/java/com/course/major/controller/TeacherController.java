package com.course.major.controller;
import com.course.major.services.CourseService;
import com.course.major.services.TeacherService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin
@RestController
@RequestMapping("/teacher")
public class TeacherController {
    @Autowired
    TeacherService teacherService;
    @Autowired
    CourseService courseService;
    @GetMapping("/hi")
    public ResponseEntity<Object> hi() {
        return new ResponseEntity<>("hello", HttpStatus.OK);
    }
    @PostMapping(
            value = "/addCourse",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Object> addCourse(
            HttpServletRequest request,
            @RequestParam("course") String courseJson,
            @RequestParam("material") MultipartFile material
    ) throws Exception {
        courseService.addCourse(request, courseJson,material);
        return new ResponseEntity<>("course added", HttpStatus.OK);
    }
}
