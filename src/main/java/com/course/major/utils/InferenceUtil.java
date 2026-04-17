package com.course.major.utils;

import com.course.major.dto.CourseDto;
import com.course.major.dto.RecommendDTO;
import com.course.major.dto.StudentInferenceDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;

@Component
public class InferenceUtil {
    @Autowired
    @Qualifier("localWebClient")
    private WebClient webClient;
    public String postStudent(StudentInferenceDTO studentInferenceDTO) {
        List<StudentInferenceDTO> list = new ArrayList<>();
        list.add(studentInferenceDTO);
        return postStudent(list);
    }
    public String postCourse(CourseDto courseDto) {
        List<CourseDto> list = new ArrayList<>();
        list.add(courseDto);
        return postCourse(list);
    }
    public String postStudent(List<StudentInferenceDTO> studentInferenceDTO) {

        return webClient.post()
                .uri("/postStudents")
                .bodyValue(studentInferenceDTO)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
    public String postCourse(List<CourseDto> courseDto) {
        return webClient.post()
                .uri("/postCourses")
                .bodyValue(courseDto)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
    public List<RecommendDTO> callRecommend(String studentId) {
        return webClient.get()
                .uri("/recommend/{id}", studentId)
                .retrieve()
                .bodyToFlux(RecommendDTO.class)
                .collectList()
                .block();
    }

}
