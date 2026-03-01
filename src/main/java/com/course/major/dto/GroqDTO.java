package com.course.major.dto;

import com.course.major.pojo.GroqMsg;

import java.util.List;

public class GroqDTO {
    private String model;
    private List<GroqMsg> messages;
    public String getModel() {
        return model;
    }
    public void setModel(String model) {
        this.model = model;
    }
    public List<GroqMsg> getMessages() {
        return messages;
    }
    public void setMessages(List<GroqMsg> messages) {
        this.messages = messages;
    }
}
