package com.course.major.serviceImpl;
import com.course.major.dto.LoginInfoDto;
import com.course.major.dto.TeacherInfoDto;
import com.course.major.entity.TeacherEntity;
import com.course.major.repo.TeacherRepo;
import com.course.major.services.TeacherService;
import com.course.major.utils.AIUtil;
import com.course.major.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

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
}
