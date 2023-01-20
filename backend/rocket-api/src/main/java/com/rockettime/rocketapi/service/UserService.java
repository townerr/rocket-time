package com.rockettime.rocketapi.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rockettime.rocketapi.persistence.UserEntity;
import com.rockettime.rocketapi.persistence.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<UserEntity> getUserById(int id) {
        return userRepository.getUserEntityById(id);
    }

    public Optional<List<UserEntity>> getAllUsers() {
        return Optional.of(userRepository.findAll());
    }

    public Optional<UserEntity> createUser(HttpEntity<String> httpEntity) {
        Optional<UserEntity> createdUser = Optional.empty();
        Optional<UserEntity> convertedUser = jsonToUserEntity(httpEntity.getBody());

        if(convertedUser.isPresent()) {
            UserEntity savedUser = userRepository.save(convertedUser.get());
            createdUser = Optional.of(savedUser);
        }

        return createdUser;
    }

    public Optional<UserEntity> jsonToUserEntity(String json) {
        UserEntity returnUser = null;
        ObjectMapper mapper = new ObjectMapper();
        try {
            returnUser = mapper.readValue(json, UserEntity.class);
        } catch(JsonProcessingException e) {
            e.printStackTrace();
        }

        return Optional.of(returnUser);
    }
}
