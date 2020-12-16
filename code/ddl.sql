--host: cis550-proj.cgiatc8pv5yd.us-east-1.rds.amazonaws.com
--port: 3306 (default)
--user name: Group40
--password: included in the report
--db name: aws_db

SHOW DATABASES;
use aws_db;
SHOW TABLES;

CREATE TABLE Users(
username varchar(20),
email varchar(50),
password varchar(20),
PRIMARY KEY (username)
);

CREATE TABLE Books(
ISBN varchar(13),
title varchar(300),
author varchar(200),
year int,
publisher varchar(200),
image_url_l varchar(200),
decade varchar(5),
PRIMARY KEY (ISBN)
);

CREATE TABLE Ratings(
username varchar(20),
ISBN varchar(13),
rating int,
PRIMARY KEY (username, ISBN),
FOREIGN KEY (username) REFERENCES Users(username),
FOREIGN KEY (ISBN) REFERENCES Books(ISBN)
);

CREATE TABLE Bookshelf(
username varchar(20),
ISBN varchar(13),
PRIMARY KEY (username, ISBN),
FOREIGN KEY (username) REFERENCES Users(username),
FOREIGN KEY (ISBN) REFERENCES Books(ISBN)
);

--DELETE FROM books;
--DROP TABLES ..;

LOAD DATA LOCAL INFILE 'books.csv' 
INTO TABLE Books
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

LOAD DATA LOCAL INFILE 'user.csv' 
INTO TABLE Users
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

LOAD DATA LOCAL INFILE 'rating.csv' 
INTO TABLE Ratings
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;