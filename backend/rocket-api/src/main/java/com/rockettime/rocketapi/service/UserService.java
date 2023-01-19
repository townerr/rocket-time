package com.rockettime.rocketapi.service;

import com.rockettime.rocketapi.persistence.UserEntity;
import com.rockettime.rocketapi.persistence.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserEntity getUserById(int id) {
        return userRepository.getUserEntityById(id);
    }

    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }
}
