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