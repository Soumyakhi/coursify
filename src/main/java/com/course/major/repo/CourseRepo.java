package com.course.major.repo;

import com.course.major.entity.Course;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepo extends MongoRepository<Course, String> {
    Course findByVideoFile(String vidId);
    List<Course> findByNameContainingIgnoreCase(String query);
    List<Course> findByNameStartingWithIgnoreCase(String query);
}
