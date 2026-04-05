package com.course.major.dto;

import java.util.List;

public class PageResDto {
    private List<CourseDto> courseDto;
    private long pageCount;

    public PageResDto(List<CourseDto> courseDto, long pageCount) {
        this.courseDto = courseDto;
        this.pageCount = pageCount;
    }

    public List<CourseDto> getCourseDto() {
        return courseDto;
    }

    public void setCourseDto(List<CourseDto> courseDto) {
        this.courseDto = courseDto;
    }

    public long getPageCount() {
        return pageCount;
    }

    public void setPageCount(long pageCount) {
        this.pageCount = pageCount;
    }
}
