package com.course.major.serviceImpl;
import com.course.major.dto.CourseDto;
import com.course.major.dto.LoginInfoDto;
import com.course.major.dto.TeacherInfoDto;
import com.course.major.entity.Course;
import com.course.major.entity.TeacherEntity;
import com.course.major.repo.CourseRepo;
import com.course.major.repo.TeacherRepo;
import com.course.major.services.CourseService;
import com.course.major.services.TeacherService;
import com.course.major.utils.AIUtil;
import com.course.major.utils.CourseUtil;
import com.course.major.utils.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
    public class TeacherServiceImpl implements TeacherService {
        @Autowired
        TeacherRepo teacherRepo;
        @Autowired
        AIUtil aiUtil;
        @Autowired
        JwtUtil jwtUtil;
        @Autowired
        BCryptPasswordEncoder passwordEncoder;
        @Autowired
        CourseRepo courseRepo;
        @Autowired
        CourseUtil courseUtil;
        @Autowired
        TeacherService teacherService;
        @Override
        public TeacherEntity getTeacher(String id) {
            return teacherRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Student not found"));
        }
        @Override
        public void register(TeacherEntity teacher) {
            if (teacherRepo.findByEmail(teacher.getEmail()) != null) {
                throw new IllegalStateException("Email already registered");
            }
            teacher.setPassword(passwordEncoder.encode(teacher.getPassword()));
            teacherRepo.save(teacher);
        }
        @Override
        public TeacherInfoDto login(LoginInfoDto loginInfoDto) {
            TeacherEntity teacherEntity=teacherRepo.findByEmail(loginInfoDto.getEmail());
            if(teacherEntity==null || !passwordEncoder.matches(loginInfoDto.getPassword(),teacherEntity.getPassword())){
                throw new BadCredentialsException("bad credentials");
            }
            return new TeacherInfoDto(teacherEntity,this.jwtUtil.generateToken(teacherEntity.getId()));
        }

    @Override
    public List<CourseDto> teacherCourses(HttpServletRequest request) {
            List<CourseDto> courseDtos = new ArrayList<>();
            String id= jwtUtil.extractUserIdFromRequest(request);
            List<Course> courseList=courseRepo.findByTeacherId(id);
            for(Course course:courseList){
                courseDtos.add(courseUtil.makeCourseDTO(course));
            }
            return courseDtos;
    }
}
