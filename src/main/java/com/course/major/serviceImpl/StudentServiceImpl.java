package com.course.major.serviceImpl;

import com.course.major.dto.LoginInfoDto;
import com.course.major.dto.RegFileDto;
import com.course.major.dto.StudentInfoDto;
import com.course.major.entity.StudentEntity;
import com.course.major.pojo.StudentCourse;
import com.course.major.repo.StudentRepo;
import com.course.major.services.StudentService;
import com.course.major.utils.AIUtil;
import com.course.major.utils.JwtUtil;
import com.course.major.utils.FileUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class StudentServiceImpl implements StudentService {
    @Autowired
    StudentRepo studentRepo;
    @Autowired
    AIUtil aiUtil;
    @Autowired
    JwtUtil jwtUtil;
    @Autowired
    BCryptPasswordEncoder passwordEncoder;
    @Override
    public StudentEntity getStudent(String id) {
        return studentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }
    @Override
    public void register(StudentEntity student) {
        if (studentRepo.findByEmail(student.getEmail()) != null) {
            throw new IllegalStateException("Email already registered");
        }
        student.setPassword(passwordEncoder.encode(student.getPassword()));
        studentRepo.save(student);
    }
    @Override
    public StudentInfoDto login(LoginInfoDto loginInfoDto) {
        StudentEntity studentEntity=studentRepo.findByEmail(loginInfoDto.getEmail());
        if(studentEntity==null || !passwordEncoder.matches(loginInfoDto.getPassword(),studentEntity.getPassword())){
            throw new BadCredentialsException("bad credentials");
        }
        return new StudentInfoDto(studentEntity,this.jwtUtil.generateToken(studentEntity.getId()));
    }

    @Override
    public void registerFile(RegFileDto regFileDto) {
        try{
            File file= FileUtil.convertMultipartFileToFile(regFileDto.getFile());
            if(!FileUtil.isPdf(file)){
                throw new IllegalStateException("not a pdf file");
            }
            String text=FileUtil.extractText(file);
            if(FileUtil.isImagePdf(file)){
                text=FileUtil.runOcr(file);
            }
            String prompt =
                    "You are a data extraction assistant.\n" +
                            "Extract structured information from the given text.\n\n" +

                            "Rules:\n" +
                            "1. Output ONLY valid JSON.\n" +
                            "2. Do NOT include explanations, comments, or markdown.\n" +
                            "3. If a field is missing, use null.\n" +
                            "4. Skills must be an array of strings.\n" +
                            "5. Phone number must be digits only.\n\n" +

                            "Return JSON in the following exact structure:\n" +
                            "{\n" +
                            "  \"description\": string,\n" +
                            "  \"email\": string,\n" +
                            "  \"id\": string,\n" +
                            "  \"name\": string,\n" +
                            "  \"phoneNumber\": string,\n" +
                            "  \"skills\": string[],\n" +
                            "}\n\n" +
                            "Text to extract data from:\n" +
                            text;
            String resp=aiUtil.askGroq(prompt);
            System.out.println(resp);
            ObjectMapper mapper = new ObjectMapper();
            StudentInfoDto studentInfo = mapper.readValue(resp, StudentInfoDto.class);
            StudentEntity studentEntity=new StudentEntity();
            studentEntity.setPassword(passwordEncoder.encode(regFileDto.getPassword()));
            if(studentInfo.getName()==null|| studentInfo.getEmail()==null){
                throw new IllegalArgumentException("name or email is null");
            }
            studentEntity.setEmail(regFileDto.getEmail());
            studentEntity.setName(studentInfo.getName());
            studentEntity.setDescription(studentInfo.getDescription());
            studentEntity.setPhoneNumber(studentInfo.getPhoneNumber());
            studentEntity.setSkills(studentInfo.getSkills());
            studentRepo.save(studentEntity);
        }catch (Exception e){
            throw new IllegalStateException(e);
        }
    }
    @Override
    public void editStudent(HttpServletRequest request,StudentEntity studentEntity) {
        String id=jwtUtil.extractUserIdFromRequest(request);
        try {
            StudentEntity existingStd=studentRepo.findById(id).orElseThrow(() -> new RuntimeException("Student not found"));
            studentEntity.setId(id);
            if(studentEntity.getPassword()!=null){
                studentEntity.setPassword(passwordEncoder.encode(studentEntity.getPassword()));
            }
            else{
                studentEntity.setPassword(existingStd.getPassword());
            }
            studentRepo.save(studentEntity);
        }
        catch (Exception e){
            System.out.println(e.getMessage());
        }
    }
    @Override
    public boolean checkEnrolled(HttpServletRequest request, String courseId) {
        StudentEntity studentEntity=studentRepo.findById(jwtUtil.extractUserIdFromRequest(request)).orElseThrow(() -> new RuntimeException("Student not found"));
        for(StudentCourse studentCourse:studentEntity.getEnrolledCourses()){
            if(studentCourse.getCourseId().equals(courseId)){
                return true;
            }
        }
        return false;
    }
    @Override
    public void rate(HttpServletRequest request, String courseId, String rating) {
        int rateInt=Integer.parseInt(rating);
        if(rateInt<0 || rateInt>5){
            throw new RuntimeException("invalid rating value");
        }
        StudentEntity student=studentRepo.findByIdAndEnrolledCoursesCourseId(jwtUtil.extractUserIdFromRequest(request), courseId);
        if(student==null){
            throw new RuntimeException("Student is not enrolled");
        }
        for(StudentCourse studentCourse:student.getEnrolledCourses()){
            if(studentCourse.getCourseId().equals(courseId)){
                studentCourse.setRating(rating);
            }
        }
        studentRepo.save(student);
    }
}
