package com.rockettime.rocketapi.service;

import com.rockettime.rocketapi.persistence.TimeEntity;
import com.rockettime.rocketapi.persistence.TimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class TimeService {
    TimeRepository timeRepository;

    @Autowired
    public TimeService(TimeRepository timeRepository) {
        this.timeRepository = timeRepository;
    }

    public TimeEntity getTimeByDate(Date d) {
        return timeRepository.getTimeByDate(d);
    }

    public List<TimeEntity> getTimesByUserId(Integer uid) {
        return timeRepository.getTimesByUserId(uid);
    }

    public List<TimeEntity> getAllTimes() {
        return timeRepository.findAll();
    }
}