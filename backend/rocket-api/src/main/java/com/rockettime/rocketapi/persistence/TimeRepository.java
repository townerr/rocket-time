package com.rockettime.rocketapi.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface TimeRepository extends JpaRepository<TimeEntity, Integer> {
    TimeEntity getTimeByDate(Date d);
    List<TimeEntity> getTimesByUserId(Integer uid);
}
