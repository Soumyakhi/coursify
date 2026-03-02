package com.course.major.serviceImpl;
import com.course.major.dto.CourseDto;
import com.course.major.entity.*;
import com.course.major.pojo.Question;
import com.course.major.pojo.StudentAnswer;
import com.course.major.pojo.StudentCourse;
import com.course.major.repo.CourseRepo;
import com.course.major.repo.StudentRepo;
import com.course.major.services.CourseService;
import com.course.major.services.StudentService;
import com.course.major.services.TeacherService;
import com.course.major.utils.CourseUtil;
import com.course.major.utils.FileUtil;
import com.course.major.utils.JwtUtil;
import com.course.major.utils.TimerUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
@Service
public class CourseServiceImpl implements CourseService {
    @Autowired
    JwtUtil jwtUtil;
    @Autowired
    TeacherService teacherService;
    @Autowired
    CourseRepo courseRepo;
    @Autowired
    private StudentRepo studentRepo;
    @Override
    public void addCourse(HttpServletRequest req, String courseJSON, MultipartFile material) {
        try {
            String teacherId = jwtUtil.extractUserIdFromRequest(req);
            TeacherEntity teacher = teacherService.getTeacher(teacherId);
            ObjectMapper mapper = new ObjectMapper();
            CourseDto courseDTO = mapper.readValue(courseJSON, CourseDto.class);
            if (!FileUtil.isMp4(material)) {
                throw new RuntimeException("Not an MP4 video");
            }
            String videoId = UUID.randomUUID().toString();
            String originalFileName = videoId + ".mp4";
            String originalPath = FileUtil.saveVideo(material, originalFileName);
            File originalFile = new File(originalPath);
                    String lowResPath = FileUtil.convertToHLS(originalFile, videoId, 640, 360, "800k");
                    System.out.println("360p Complete: " + lowResPath);
                    String highResPath = FileUtil.convertToHLS(originalFile, videoId, 1920, 1080, "2500k");
                    System.out.println("1080p Complete: " + highResPath);
                    Course course = new Course(
                            courseDTO.getName(),
                            teacherId,
                            teacher.getName(),
                            courseDTO.getQuestions(),
                            courseDTO.getDescription(),
                            videoId,
                            courseDTO.getLevel()
                    );
                    courseRepo.save(course);
        } catch (Exception e) {
            System.err.println("Upload Error: " + e.getMessage());
            throw new RuntimeException("Failed to add course", e);
        }
    }
    @Override
    public Course getCourse(String id) {
        return courseRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
    }
    @Autowired
    StudentService studentService;
    @Override
    public void enroll(HttpServletRequest request, String courseId) {
        String id=jwtUtil.extractUserIdFromRequest(request);
        Course course=getCourse(courseId);
        StudentEntity student=studentService.getStudent(id);
        if(student.getEnrolledCourses()==null){
            student.setEnrolledCourses(new ArrayList<>());
        }
        for(StudentCourse studentCourse:student.getEnrolledCourses()){
            if(studentCourse.getCourseId().equals(courseId)){
                throw new RuntimeException("Student already enrolled");
            }
        }
        student.getEnrolledCourses().add(new StudentCourse(courseId,"0",false,"0"));
        studentRepo.save(student);
    }
    @Autowired
    CourseUtil courseUtil;
    @Override
    public CourseDto fetchCourse(String courseId) {
        return courseUtil.makeCourseDTO(getCourse(courseId));
    }
    @Override
    public List<CourseDto> findMyCourses(HttpServletRequest request) {
        StudentEntity studentEntity=studentRepo.findById(jwtUtil.extractUserIdFromRequest(request)).orElseThrow(() -> new RuntimeException("Student not found"));
        List<CourseDto> courseDtoList = new ArrayList<>();
        for(StudentCourse studentCourse:studentEntity.getEnrolledCourses()){
            courseDtoList.add(courseUtil.makeCourseDTO(getCourse(studentCourse.getCourseId())));
        }
        return courseDtoList;
    }
    @Override
    public List<CourseDto> search(String query,int page) {
        if(query==null || query.trim().isEmpty()){
            throw new RuntimeException("query is empty");
        }
        query = query.trim();
        Pageable pageable = PageRequest.of(page-1, 2, Sort.by("name").ascending());
        List<Course> courses = query.length() >= 3
                ? courseRepo.findByNameContainingIgnoreCase(query,pageable)
                : courseRepo.findByNameStartingWithIgnoreCase(query,pageable);
        List<CourseDto> courseDtoList = new ArrayList<>();
        for(Course course:courses){
            courseDtoList.add(courseUtil.makeCourseDTO(course));
        }
        return courseDtoList;
    }
    @Override
    public String takeExam(HttpServletRequest request, String courseId){
        String id=jwtUtil.extractUserIdFromRequest(request);
        StudentEntity student=studentRepo.findByIdAndEnrolledCoursesCourseId(id,courseId);
        if(student==null){
            throw new RuntimeException("Student is not enrolled");
        }
        for(int i=0;i<student.getEnrolledCourses().size();i++){
            StudentCourse stdCourse=student.getEnrolledCourses().get(i);
            if(stdCourse.getCourseId().equals(courseId)){
                stdCourse.setComplete(true);
            }
        }
        studentRepo.save(student);
        return TimerUtil.startExam(id);
    }
    public String submitExam(HttpServletRequest request, String courseId,String examVal,List<StudentAnswer> answers){
        String id=jwtUtil.extractUserIdFromRequest(request);
        if(!TimerUtil.isLegalKey(id,examVal)){
            throw new RuntimeException("not a valid key");
        }
        int marks=0;
        StudentEntity student=studentRepo.findByIdAndEnrolledCoursesCourseId(id,courseId);
        Course course=getCourse(courseId);
        List<Question> questions=course.getQuestions();
        for(int i=0;i<Math.min(3,answers.size());i++){
            StudentAnswer answer=answers.get(i);
            Integer correctAnswer=questions.get(answer.getIndex()).getCorrectAnswer();
            if(correctAnswer.equals(answer.getAnswer())){
                marks++;
            }
        }
        marks= Math.min(marks, 3);
        for(int i=0;i<student.getEnrolledCourses().size();i++){
            StudentCourse stdCourse=student.getEnrolledCourses().get(i);
            if(stdCourse.getCourseId().equals(courseId)){
                stdCourse.setPercentageMarks(Integer.toString(marks*100/3));
            }
        }
        studentRepo.save(student);
        System.out.println("Exam Submitted");
        return marks+" Out of "+3;
    }



    public ResponseEntity<byte[]> getKeyVideo(HttpServletRequest request, String videoKeyId){
        try {
            String id=jwtUtil.extractUserIdFromRequest(request);
            String vidId="";
            if(videoKeyId.endsWith("1080")){
                vidId=videoKeyId.substring(0,videoKeyId.length()-4);
            }
            else if(videoKeyId.endsWith("360")){
                vidId=videoKeyId.substring(0,videoKeyId.length()-3);
            }
            Course course=courseRepo.findByVideoFile(vidId);
            StudentEntity student=studentRepo.findByIdAndEnrolledCoursesCourseId(id,course.getId());
            if(student==null){
                throw new RuntimeException("Student is not enrolled");
            }

                File keyFile = new File(
                        System.getProperty("user.dir")
                                + File.separator + "uploads"
                                + File.separator + "hls-keys"
                                + File.separator + videoKeyId + ".key"
                );
                if (!keyFile.exists()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
                }

                byte[] key = Files.readAllBytes(keyFile.toPath());

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
                headers.setCacheControl(CacheControl.noStore());

                return new ResponseEntity<>(key, headers, HttpStatus.OK);

        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}




