package com.course.major.controller;

import com.course.major.dto.LoginInfoDto;
import com.course.major.dto.RegFileDto;
import com.course.major.entity.Recruiter;
import com.course.major.entity.StudentEntity;
import com.course.major.entity.TeacherEntity;
import com.course.major.services.RecruiterService;
import com.course.major.services.StudentService;
import com.course.major.services.TeacherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
public class AuthController {
    @Autowired
    private StudentService studentService;
    @PostMapping("/loginStd")
    public ResponseEntity<Object> login(@RequestBody LoginInfoDto loginInfoDTO) {
        return new ResponseEntity<>(studentService.login(loginInfoDTO), HttpStatus.OK);
    }
    @PostMapping("/signUpStd")
    public ResponseEntity<String> signUp(@RequestBody StudentEntity studentEntity) {
        studentService.register(studentEntity);
        return new ResponseEntity<>("Signup Successful", HttpStatus.OK);
    }
    @PostMapping("/signUpStdPdf")
    public ResponseEntity<String> signUpPdf(@ModelAttribute RegFileDto regFileDto) {
        studentService.registerFile(regFileDto);
        return new ResponseEntity<>("Signup Successful", HttpStatus.OK);
    }
    @Autowired
    private TeacherService teacherService;
    @PostMapping("/loginTeacher")
    public ResponseEntity<Object> loginT(@RequestBody LoginInfoDto loginInfoDTO) {
        return new ResponseEntity<>(teacherService.login(loginInfoDTO), HttpStatus.OK);
    }
    @PostMapping("/signUpTeacher")
    public ResponseEntity<String> signUpT(@RequestBody TeacherEntity teacher) {
        teacherService.register(teacher);
        return new ResponseEntity<>("Signup Successful", HttpStatus.OK);
    }
    @Autowired
    private RecruiterService recruiterService;
    @PostMapping("/loginRecruiter")
    public ResponseEntity<Object> loginRecruiter(@RequestBody LoginInfoDto loginInfoDTO) {
        return new ResponseEntity<>(recruiterService.login(loginInfoDTO), HttpStatus.OK);
    }
    @PostMapping("/signUpRecruiter")
    public ResponseEntity<String> signUpRecruiter(@RequestBody Recruiter recruiter) {
        recruiterService.register(recruiter);
        return new ResponseEntity<>("Signup Successful", HttpStatus.OK);
    }
}
