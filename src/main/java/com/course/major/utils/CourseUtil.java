package com.course.major.utils;

import com.course.major.dto.CourseDto;
import com.course.major.entity.Course;
import com.course.major.entity.StudentEntity;
import com.course.major.pojo.StudentCourse;
import com.course.major.repo.CourseRepo;
import com.course.major.repo.StudentRepo;
import com.course.major.services.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CourseUtil {
    @Autowired
    private CourseRepo courseRepo;
    @Autowired
    private StudentRepo studentRepo;
    public CourseDto makeCourseDTO(Course course)
    {
        CourseDto dto=new CourseDto();
        dto.setName(course.getName());
        dto.setDescription(course.getDescription());
        /*if(setQuestions){
            dto.setQuestions(course.getQuestions());
        }*/
        dto.setVideoFilePath(course.getVideoFile());
        List<StudentEntity> studentList=studentRepo.findRatingsByCourseId(course.getId());
        long ratingSum = 0;
        long totalRatings = 0;
        for (StudentEntity s : studentList) {
            StudentCourse sc = s.getEnrolledCourses().get(0);
            long rating = Long.parseLong(sc.getRating());
            if(rating>0 && rating<6){
                ratingSum += rating;
                totalRatings ++;
            }

        }
        dto.setRating(
                studentList.isEmpty()
                        ? "0"
                        : Double.toString((double) ratingSum / totalRatings)
        );
        dto.setLevel(course.getLevel());
        dto.setTotalEnrolled(studentList.size());
        dto.setId(course.getId());
        dto.setCreatedAt(course.getCreatedAt());
        dto.setTimeStamps(course.getTimeStamps());
        return dto;
    }
    public Course getCourse(String id) {
        return courseRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
    }
}
