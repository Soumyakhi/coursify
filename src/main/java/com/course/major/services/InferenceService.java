package com.course.major.services;

import com.course.major.dto.CourseDto;
import com.course.major.dto.StudentInferenceDTO;
import com.course.major.entity.Course;
import com.course.major.entity.StudentEntity;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

public interface InferenceService {
    public List<StudentInferenceDTO> getStudents();
    public List<CourseDto> recommendCourse(HttpServletRequest request);

}
