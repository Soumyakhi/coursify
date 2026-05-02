package com.course.major.serviceImpl;

import com.course.major.dto.JobDescriptionDto;
import com.course.major.dto.LoginInfoDto;
import com.course.major.dto.RecruiterInfoDTO;
import com.course.major.dto.TeacherInfoDto;
import com.course.major.entity.Job;
import com.course.major.entity.Recruiter;
import com.course.major.entity.TeacherEntity;
import com.course.major.repo.JobRepo;
import com.course.major.repo.RecruiterRepo;
import com.course.major.services.RecruiterService;
import com.course.major.utils.JobUtil;
import com.course.major.utils.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RecruiterServiceImpl implements RecruiterService {
    @Autowired
    RecruiterRepo recruiterRepo;
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    JwtUtil jwtUtil;
    @Autowired
    private JobUtil jobUtil;
    @Autowired
    private JobRepo jobRepo;

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

    @Override
    public boolean checkValidReference(HttpServletRequest request, String jobId, String referenceId) {
        String id=jwtUtil.extractUserIdFromRequest(request);
        Job job=jobRepo.findByIdAndRecruiterId(jobId,id);
        if(job!=null){
            Map<String,String > validRefMap=job.getRecommendationIds();
            if(validRefMap==null || validRefMap.isEmpty()){
                return false;
            }
            for (Map.Entry<String, String> entry : validRefMap.entrySet()) {
                String recommendationId = entry.getValue();
                if(recommendationId.equals(referenceId)){
                    return true;
                }
            }
            return false;
        }
        return false;
    }
    @Override
    public List<JobDescriptionDto> fetchJobsRecruiter(HttpServletRequest request) {
        List<Job> jobs= jobRepo.findAllByRecruiterId(jwtUtil.extractUserIdFromRequest(request));
        List<JobDescriptionDto> jobDescriptionDtos=new ArrayList<>();
        for(Job job:jobs){
            jobDescriptionDtos.add(new JobDescriptionDto(job));
        }
        return jobDescriptionDtos;
    }
}
