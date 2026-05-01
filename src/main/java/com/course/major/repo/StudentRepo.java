package com.course.major.repo;
import java.util.List;

import com.course.major.dto.LoginInfoDto;
import com.course.major.dto.StudentInfoDto;
import com.course.major.entity.StudentEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepo extends MongoRepository<StudentEntity, String> {
    StudentEntity findByEmail(String email);
    StudentEntity findByEmailAndPassword(String email, String password);
    @Query(
            value = "{ 'enrolledCourses.courseId': ?0 }",
            fields = "{ 'enrolledCourses.$': 1 }"
    )
    List<StudentEntity> findRatingsByCourseId(String courseId);
    StudentEntity findByIdAndEnrolledCoursesCourseId(String id,String courseId);
    @Query(value = "{}", fields = "{ '_id': 1 }")
    List<StudentEntity> findTopBy(Pageable pageable);
}