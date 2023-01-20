package com.rockettime.rocketapi.persistence;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.Date;

@Entity
@Table(name = "time", schema = "RocketTime")
public class TimeEntity {

    @Id
    private Integer id;
    private Integer userId;
    private String startTime;
    private String deduction;
    private String endTime;
    private Date date;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String start) {
        this.startTime = start;
    }

    public String getDeduction() {
        return deduction;
    }

    public void setDeduction(String deduction) {
        this.deduction = deduction;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String end) {
        this.endTime = end;
    }

    public Date getTimeDate() {
        return date;
    }

    public void setTimeDate(Date date) {
        this.date = date;
    }
}
