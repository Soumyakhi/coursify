package com.course.major.serviceImpl;

import com.course.major.entity.StudentEntity;
import com.course.major.pojo.StudentCourse;
import com.course.major.repo.StudentRepo;
import com.course.major.services.InferenceService;
import com.course.major.services.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
@Service
public class InferenceServiceImpl implements InferenceService {
    @Autowired
    private StudentRepo studentRepo;
    @Override
    public List<StudentEntity> getStudents() {
        List<StudentEntity> students = studentRepo.findAll();
        for (StudentEntity student : students) {
            student.setPassword("");

        }
        return students;
    }
}
