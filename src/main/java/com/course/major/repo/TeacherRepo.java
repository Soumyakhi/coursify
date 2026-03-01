package com.course.major.repo;
import com.course.major.entity.StudentEntity;
import com.course.major.entity.TeacherEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface TeacherRepo extends MongoRepository<TeacherEntity, String> {
    TeacherEntity findByEmail(String email);
}

