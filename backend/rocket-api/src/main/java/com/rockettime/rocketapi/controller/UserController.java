package com.rockettime.rocketapi.controller;

import com.rockettime.rocketapi.persistence.UserEntity;
import com.rockettime.rocketapi.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserEntity>> getAllUsers() {
        Optional<List<UserEntity>> getSuccess = userService.getAllUsers();
        List<UserEntity> users = null;
        HttpStatus status = HttpStatus.NOT_FOUND;

        if(getSuccess.isPresent()) {
            users = getSuccess.get();
            status = HttpStatus.OK;
        }

        return new ResponseEntity<>(users, status);
    }

    @GetMapping("/user")
    public ResponseEntity<UserEntity> getUserById(@RequestParam Integer id) {
        Optional<UserEntity> getSuccess = userService.getUserById(id);
        UserEntity user = null;
        HttpStatus status = HttpStatus.NOT_FOUND;

        if(getSuccess.isPresent()) {
            user = getSuccess.get();
            status = HttpStatus.OK;
        }

        return new ResponseEntity<>(user, status);
    }

    @PostMapping("/create-user")
    public ResponseEntity<UserEntity> createUser(HttpEntity<String> httpEntity) {
        Optional<UserEntity> createSuccess = userService.createUser(httpEntity);
        UserEntity user = null;
        HttpStatus status = HttpStatus.CONFLICT;

        if(createSuccess.isPresent()) {
            user = createSuccess.get();
            status = HttpStatus.OK;
        }

        return new ResponseEntity<>(user, status);
    }
}
