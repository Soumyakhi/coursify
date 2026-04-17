package com.course.major.utils;

import com.course.major.entity.StudentEntity;
import com.course.major.pojo.StudentCourse;
import com.course.major.repo.StudentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Component
public class TimerUtil {

    @Autowired
    private StudentRepo studentRepo;

    private final Map<String, String> examKey = new ConcurrentHashMap<>();

    private final ScheduledExecutorService scheduler =
            Executors.newSingleThreadScheduledExecutor();

    private final long EXAM_DURATION_SECONDS = 2000000000;

    public String startExam(String id, StudentEntity student, String courseId) {

        String examVal = UUID.randomUUID().toString();

        String val = examKey.putIfAbsent(id, examVal);
        if (val != null) {
            throw new RuntimeException("Exam already started");
        }

        scheduler.schedule(() -> {
            examKey.remove(id);

            for (int i = 0; i < student.getEnrolledCourses().size(); i++) {

                StudentCourse stdCourse = student.getEnrolledCourses().get(i);

                if (stdCourse.getCourseId().equals(courseId)) {
                    stdCourse.setPercentageMarks("0");
                    stdCourse.setComplete(true);
                }
            }

            studentRepo.save(student);

        }, EXAM_DURATION_SECONDS, TimeUnit.SECONDS);

        return examVal;
    }

    public boolean isLegalKey(String id, String examVal) {
        if (examVal.equals(examKey.getOrDefault(id, "-1"))) {
            examKey.remove(id);
            return true;
        }
        return false;
    }
}