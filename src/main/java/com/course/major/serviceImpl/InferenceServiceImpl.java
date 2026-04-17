package com.course.major.serviceImpl;

import com.course.major.dto.CourseDto;
import com.course.major.dto.RecommendDTO;
import com.course.major.dto.StudentInferenceDTO;
import com.course.major.entity.Course;
import com.course.major.entity.StudentEntity;
import com.course.major.repo.CourseRepo;
import com.course.major.repo.StudentRepo;
import com.course.major.services.CourseService;
import com.course.major.services.InferenceService;
import com.course.major.utils.CourseUtil;
import com.course.major.utils.InferenceUtil;
import com.course.major.utils.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
@Service
public class InferenceServiceImpl implements InferenceService {
    @Autowired
    private StudentRepo studentRepo;
    @Autowired
    private CourseRepo courseRepo;
    @Autowired
    private CourseUtil  courseUtil;
    @Autowired
    private InferenceUtil inferenceUtil;
    @Autowired
    JwtUtil jwtUtil;
    @Autowired
    CourseService courseService;

    @Override
    public List<StudentInferenceDTO> getStudents() {
        List<StudentEntity> students = studentRepo.findAll();
        List<StudentInferenceDTO> studentsDto =new ArrayList<>();
        for (StudentEntity student : students) {
            studentsDto.add(new StudentInferenceDTO(student));
        }
        inferenceUtil.postStudent(studentsDto);
        return studentsDto;
    }

    @Override
    public List<CourseDto> recommendCourse(HttpServletRequest request) {
        String studentId = jwtUtil.extractUserIdFromRequest(request);
        List<CourseDto> courseDtos = new ArrayList<>();
        List<RecommendDTO> recommendDTOs = inferenceUtil.callRecommend(studentId);
        for(RecommendDTO recommendDTO:recommendDTOs){
            courseDtos.add(courseUtil.makeCourseDTO(courseService.getCourse(recommendDTO.getCourse_id())));
        }
        return courseDtos;
    }


}
