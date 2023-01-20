package com.rockettime.rocketapi.controller;

import com.rockettime.rocketapi.persistence.TimeEntity;
import com.rockettime.rocketapi.service.TimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.server.ResponseStatusException;

import java.util.Date;
import java.util.List;

@Controller
public class TimeController {
    private final TimeService timeService;

    @Autowired
    public TimeController(TimeService timeService) {
        this.timeService = timeService;
    }

    @GetMapping("/times")
    public List<TimeEntity> getAllTimes() {
        try {
            return timeService.getAllTimes();
        }
        catch(Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Times not found", e);
        }
    }

    /*@GetMapping(value = "/time", params = {"date"})
    public TimeEntity getTimeByDate(@RequestParam Date d) {
        try {
            return timeService.getTimeByDate(d);
        }
        catch(Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Time not found", e);
        }
    }*/

    @GetMapping("/time")
    public List<TimeEntity> getTimeByUserId(@RequestParam Integer uid) {
        try {
            return timeService.getTimesByUserId(uid);
        }
        catch(Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Times not found", e);
        }
    }
}
