CREATE DATABASE RocketTime;
USE RocketTime;

CREATE TABLE users(
    id INT NOT NULL AUTO_INCREMENT,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    passwordHash VARCHAR(255) NOT NULL,
    role INT DEFAULT 0,
    PRIMARY KEY (id)
);

CREATE TABLE timesheets(
    id INT NOT NULL AUTO_INCREMENT,
    userId INT NOT NULL,
    startTime VARCHAR(255) NOT NULL,
    deduction VARCHAR(255) NOT NULL,
    endTime VARCHAR(255) NOT NULL,
    timeDate VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (userId) REFERENCES users(id)
);

INSERT INTO users (firstName, lastName, email, passwordHash) VALUES("Ryan", "Towner", "ryan@towner.com", "test");
INSERT INTO users (firstName, lastName, email, passwordHash) VALUES("Bob", "Johnson", "bob@johnson.com", "test2");

INSERT INTO timesheets (userId, startTime, endTime, deduction, timeDate) VALUES(
    (SELECT (id) FROM users WHERE id='1') , "09:00", "17:00", "00:00", "2023-01-09");
INSERT INTO timesheets (userId, startTime, endTime, deduction, timeDate) VALUES(
    (SELECT (id) FROM users WHERE id='1') , "09:00", "17:00", "00:00", "2023-01-10");
INSERT INTO timesheets (userId, startTime, endTime, deduction, timeDate) VALUES(
    (SELECT (id) FROM users WHERE id='1') , "09:00", "17:00", "00:00", "2023-01-11");
INSERT INTO timesheets (userId, startTime, endTime, deduction, timeDate) VALUES(
    (SELECT (id) FROM users WHERE id='1') , "09:00", "17:00", "00:00", "2023-01-12");
INSERT INTO timesheets (userId, startTime, endTime, deduction, timeDate) VALUES(
    (SELECT (id) FROM users WHERE id='1') , "09:00", "17:00", "00:00", "2023-01-13");
INSERT INTO timesheets (userId, startTime, endTime, deduction, timeDate) VALUES(
    (SELECT (id) FROM users WHERE id='1') , "00:00", "00:00", "00:00", "2023-01-14");
INSERT INTO timesheets (userId, startTime, endTime, deduction, timeDate) VALUES(
    (SELECT (id) FROM users WHERE id='1') , "00:00", "00:00", "00:00", "2023-01-15");