package com.course.major.serviceImpl;

import com.course.major.dto.LoginInfoDto;
import com.course.major.dto.RecruiterInfoDTO;
import com.course.major.dto.TeacherInfoDto;
import com.course.major.entity.Recruiter;
import com.course.major.entity.TeacherEntity;
import com.course.major.repo.RecruiterRepo;
import com.course.major.services.RecruiterService;
import com.course.major.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class RecruiterServiceImpl implements RecruiterService {
    @Autowired
    RecruiterRepo recruiterRepo;
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    JwtUtil jwtUtil;
    @Override
    public Recruiter getRecruiter(String id) {
        return recruiterRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));
    }
    @Override
    public void register(Recruiter recruiter) {
        if (recruiterRepo.findByEmail(recruiter.getEmail()) != null) {
            throw new IllegalStateException("Email already registered");
        }
        recruiter.setPassword(passwordEncoder.encode(recruiter.getPassword()));
        recruiterRepo.save(recruiter);
    }
    @Override
    public RecruiterInfoDTO login(LoginInfoDto loginInfoDto) {
        Recruiter recruiter=recruiterRepo.findByEmail(loginInfoDto.getEmail());
        if(recruiter==null || !passwordEncoder.matches(loginInfoDto.getPassword(),recruiter.getPassword())){
            throw new BadCredentialsException("bad credentials");
        }
        return new RecruiterInfoDTO(recruiter,this.jwtUtil.generateToken(recruiter.getId()));
    }
}
