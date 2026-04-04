package com.course.major.repo;

import com.course.major.entity.Job;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface JobRepo extends MongoRepository<Job, String> {
    List<Job> findByRecruiterId(String recId);
    @Query("{ '_id': ?0, 'recommendationIds.?1': { $exists: true } }")
    Optional<Job> findByIdAndRecommendationKey(String jobId, String studentId);
    Job findByIdAndRecruiterId(String jobId, String recruiterId);
    @Query("{ 'recommendationIds.?0': { $exists: true }, 'valid': true }")
    List<Job> findByRecommendationKeyOrderByIdDesc(String studentId);

}
