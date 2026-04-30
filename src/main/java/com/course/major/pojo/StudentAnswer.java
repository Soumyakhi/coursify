package com.course.major.pojo;

public class StudentAnswer {
    private int index;
    private int answer;
    public StudentAnswer() {
    }
    public StudentAnswer(int index, int answer) {
        setIndex(index);
        this.answer = answer;
    }
    public int getIndex() {
        return index;
    }
    public void setIndex(int index) {
        if (index < 0) {
            throw new IllegalArgumentException("Index must be between 0 and 4");
        }
        this.index = index;
    }
    public int getAnswer() {
        return answer;
    }
    public void setAnswer(int answer) {
        this.answer = answer;
    }
}