package com.course.major.dto;

import com.course.major.entity.Recruiter;

public class RecruiterInfoDTO {
    private String id;
    private String name;
    private String email;
    private String token;
    private String companyName;
    public RecruiterInfoDTO() {
    }

    public RecruiterInfoDTO(Recruiter recruiter, String token) {
        this.id = recruiter.getId();
        this.name = recruiter.getName();
        this.email = recruiter.getEmail();
        this.token = token;
        this.companyName = recruiter.getCompanyName();
    }
    public RecruiterInfoDTO(String id, String name, String email, String token, String companyName) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.token = token;
        this.companyName = companyName;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }
}
