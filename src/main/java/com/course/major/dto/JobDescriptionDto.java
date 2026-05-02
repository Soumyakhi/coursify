package com.course.major.dto;

import com.course.major.entity.Job;
import com.course.major.entity.Recruiter;

public class JobDescriptionDto {
    private String id;
    private String recruiterName;
    private String recruiterId;
    private String position;
    private String description;
    private String link;
    private String companyName;
    private String recommendationKey;
    public JobDescriptionDto(Job job, Recruiter recruiter,String key) {
        this.id = job.getId();
        this.position = job.getPosition();
        this.description = job.getDescription();
        this.link = job.getLink();
        this.recruiterName = recruiter.getName();
        this.recruiterId = recruiter.getId();
        this.companyName = recruiter.getCompanyName();
        this.recommendationKey = key;
    }
    public JobDescriptionDto(Job job, Recruiter recruiter) {
        this.id = job.getId();
        this.position = job.getPosition();
        this.description = job.getDescription();
        this.link = job.getLink();
        this.recruiterName = recruiter.getName();
        this.recruiterId = recruiter.getId();
        this.companyName = recruiter.getCompanyName();
        this.recommendationKey = "";
    }
    public JobDescriptionDto(Job job) {
        this.id = job.getId();
        this.position = job.getPosition();
        this.description = job.getDescription();
        this.link = job.getLink();
        this.recruiterName = "";
        this.recruiterId = "";
        this.companyName = "";
        this.recommendationKey = "";
    }
    public String getRecommendationKey() {
        return recommendationKey;
    }

    public void setRecommendationKey(String recommendationKey) {
        this.recommendationKey = recommendationKey;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRecruiterName() {
        return recruiterName;
    }

    public void setRecruiterName(String recruiterName) {
        this.recruiterName = recruiterName;
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

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }
}
