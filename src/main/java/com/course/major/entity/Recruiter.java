package com.course.major.entity;

import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Recruiter")
public class Recruiter {
    @Id
    private String id;
    @NotNull
    private String companyName;

    private String name;

    @NotNull
    @Indexed(unique = true)
    private String email;

    private String password;

    // Parameterized Constructor
    public Recruiter(String id, @NotNull String companyName, String name, String email, String password) {
        this.id = id;
        this.companyName = companyName;
        this.name = name;
        this.email = email;
        this.password = password;
    }

    // Getters

    public String getId() {
        return id;
    }

    public @NotNull String getCompanyName() {
        return companyName;
    }

    public String getName() {
        return name;
    }

    public @NotNull String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    // Setters

    public void setId(String id) {
        this.id = id;
    }

    public void setCompanyName(@NotNull String companyName) {
        this.companyName = companyName;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(@NotNull String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}