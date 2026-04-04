package com.course.major.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Document(collection = "Jobs")
public class Job {
    @Id
    private String id;
    private String recruiterId;
    private String position;
    private String description;
    private String link;
    private Map<String,String> recommendationIds;
    private boolean active;
    public Job(String id, String recruiterId, String position, String description, String link,boolean active) {
        this.id = id;
        this.recruiterId = recruiterId;
        this.position = position;
        this.description = description;
        this.link = link;
        this.active = active;
        this.recommendationIds = new HashMap<>();
    }
    public Job() {
    }
    public Job(String id, String recruiterId, String description, String position, String link, Map<String, String> recommendationIds,boolean active) {
        this.id = id;
        this.recruiterId = recruiterId;
        this.description = description;
        this.position = position;
        this.link = link;
        this.active = active;
        this.recommendationIds = recommendationIds;
    }
    public Job(String id, String recruiterId, String position, String description, String link) {
        this.id = id;
        this.recruiterId = recruiterId;
        this.position = position;
        this.description = description;
        this.link = link;
        this.active = true;
        this.recommendationIds = new HashMap<>();
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRecruiterId() {
        return recruiterId;
    }

    public void setRecruiterId(String recruiterId) {
        this.recruiterId = recruiterId;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public Map<String,String> getRecommendationIds() {
        return recommendationIds;
    }

    public void setRecommendationIds(Map<String,String> recommendationIds) {
        this.recommendationIds = recommendationIds;
    }
}
