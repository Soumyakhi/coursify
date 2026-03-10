package com.course.major.repo;

import com.course.major.entity.Recruiter;
import com.course.major.entity.StudentEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecruiterRepo extends MongoRepository<Recruiter, String> {
    Recruiter findByEmail(String email);
    Recruiter findByEmailAndPassword(String email, String password);
}
