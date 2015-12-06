-- Credit Transfer system Database --
-- PostgreSQL --
-- WARNING: This script DROPS all tables first before recreating them, use caution --

-- TODO: In some cases, it needs to be checked whether a course is from Marist or not. --
-- This can be made easier by assigning Marist an SID of 0 or 1. Since we know Marist won't be deleted from this database, its unique ID should not be changed. --
-- This is one way to check if it's a Marist course or not, test if school = 0. --

DROP TABLE IF EXISTS CourseEquivalencies;
DROP TABLE IF EXISTS CoursesToMajors;
DROP TABLE IF EXISTS CoursesToCore;
DROP TABLE IF EXISTS MaristMajors;
DROP TABLE IF EXISTS MaristCore;
DROP TABLE IF EXISTS UsersToCourses;
DROP TABLE IF EXISTS Courses;
DROP TABLE IF EXISTS Departments;
DROP TABLE IF EXISTS SchoolsToUsers;
DROP TABLE IF EXISTS Schools;
DROP TABLE IF EXISTS Employees;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS People;
DROP TYPE IF EXISTS Gender;
DROP TYPE IF EXISTS Office;
DROP TYPE IF EXISTS Clearance;

-- Enumerated types --
CREATE TYPE Gender AS ENUM ('M', 'F');
CREATE TYPE Office AS ENUM ('Admissions', 'Registrar', 'IT');
CREATE TYPE Clearance AS ENUM ('1', '2', '3');

-- Stores all people, including registered user data and employee data --
CREATE TABLE People
(
PID serial primary key,
firstName text,
lastName text,
gender Gender,
age int,
race text,
state text,
emailAddress text unique not null,
password text not null
);

-- Stores all users (all of which are also people) --
CREATE TABLE Users
(
UID int references People(PID) primary key
);

-- Stores all employee users (all of which are also people) --
CREATE TABLE Employees
(
EID int references People(PID) primary key ON DELETE CASCADE,
office Office,
clearance Clearance
);

-- Stores all schools such as Marist, DCC and so on. --
CREATE TABLE Schools
(
SID serial primary key,
schoolName text,
country text,
address1 text,
address2 text,
city text,
state text,
zip text
);

-- Maps users to the school(s) they want to transfer courses in from. --
CREATE TABLE SchoolsToUsers
(
UID int references Users(UID),
SID int references Schools(SID)
); -- TODO: check constaint that school is NOT Marist, should be an external school --

-- Stores all departments at all schools such as ENG for the English department, CMPT for Computing Technology, and so on --
CREATE TABLE Departments
(
DID serial primary key,
departmentName text,
school int references Schools(SID)
);

-- Stores all courses. --
-- A course's key is a tuple of the school that offers it, the department at that school, and the course number. --
-- Example: (DCC, ENG, 101) is a unique course, though school would be DCC's SID and ENG would be DCC's ENG department DID. --
CREATE TABLE Courses
(
school int references Schools(SID),
DID int references Departments(DID),
courseNumber text,
description text,
courseName text,
credits int,
isActive boolean,
PRIMARY KEY (school, DID, courseNumber)
);

-- Maps users to the courses they have already input from their school(s) for later retrieval -- 
CREATE TABLE UsersToCourses
(
UID int references Users(UID),
school int,
DID int,
courseNumber text,
FOREIGN KEY (school, DID, courseNumber) REFERENCES Courses (school, DID, courseNumber)
); -- TODO: check constraint that the courses are NOT Marist courses --

-- Stores the names of Marist core requirements such as Mathematics, Fine Art, Ethics, etc. --
CREATE TABLE MaristCore
(
coreRequirement text primary key,
contactPerson text
);

-- Stores the names of Marist majors such as Computer Science: Software Development, Business: Marketing, and so on. --
-- Different concentrations are considered to be different majors in this database, because there are different courses associated with them. --
CREATE TABLE MaristMajors
(
majorName text primary key,
contactPerson text
);

-- Maps Marist courses to the Core Requirements they satisfy. --
-- For example, Marist's ART 101 maps to Fine Arts. --
CREATE TABLE CoursesToCore
(
coreRequirement text references MaristCore(coreRequirement),
school int,
DID int,
courseNumber text,
FOREIGN KEY (school, DID, courseNumber) REFERENCES Courses (school, DID, courseNumber)
); -- TODO: check constraint that the course is from Marist --

-- Maps Marist courses to the Majors they satisfy. --
-- For example, Marist's CMPT 120 maps to Computer Science: Software Development. --
CREATE TABLE CoursesToMajors
(
majorName text references MaristMajors(majorName),
school int,
DID int,
courseNumber text,
FOREIGN KEY (school, DID, courseNumber) REFERENCES Courses (school, DID, courseNumber)
); -- TODO: check constraint that the course is from Marist --

-- Maps courses from other schools to their equivalent Marist course. --
-- Allows for one link per row, allowing for one link like (DCC, ENG, 101) = (MARIST, ENG, 120) --
-- If multiple associations need to be made, just use multiple rows. Like: --
-- (DCC, MAT, 231) = (MARIST, MATH, 240) --
-- (DCC, MAT, 231) = (MARIST, MATH, 241) -- 
-- A Marist course may appear many times in this table since different courses from different schools will be equal to it. --
CREATE TABLE CourseEquivalencies
(
externalSchool int,
externalDID int,
externalNumber text,
maristSchool int,
maristDID int,
maristNumber text,
FOREIGN KEY (externalSchool, externalDID, externalNumber) REFERENCES Courses (school, DID, courseNumber),
FOREIGN KEY (maristSchool, maristDID, maristNumber) REFERENCES Courses (school, DID, courseNumber)
); -- TODO: check constraint that the Marist course is actually a Marist course --