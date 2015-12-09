--Find all courses needed to graduate with a Computer Science degree from Marist:

SELECT courseName
FROM Courses
WHERE school = (SELECT SID
	FROM Schools
	WHERE name = ‘Marist College’)
AND DID = (SELECT DID
	FROM MaristCoursesToMajors
	WHERE majorName = ‘Computer Science’)
AND number = (SELECT number
	FROM MaristCoursesToMajors
	WHERE majorName = ‘Computer Science’);

--Find all courses from other schools that are equivalent to Marist’s CMPT 404:
SELECT courseName, school
FROM CoursesEquivalencies
WHERE NOT IN (“Marist”)
AND maristNumber = 404
AND maristDID = (SELECT DID
    FROM Departments
    WHERE departmentName = “CMPT”
    AND school  = (SELECT SID 
        FROM Schools
        WHERE name = “Marist”);

 --Find all Marist courses that a given external course is equivalent to:

 SELECT name
 FROM courses
 WHERE school = "Marist"
 AND externalNumber == (SELECT externalNumber 
 	FROM CoursesEquivalencies
 	WHERE externalNumber = $givenNumber);

--Get all Marist Majors
 SELECT majorName
 FROM MaristMajors;

--Get all courses from a given school

SELECT name
FROM courses
WHERE school = $givenSchool;

--Get all Schools

SELECT name
FROM Schools;

-- Get all marist courses that match a given users input courses
SELECT DISTINCT UsersToCourses.number,UsersToCourses.school,UsersToCourses.department, CoursesEquivalencies.maristNumber,CoursesEquivalencies.maristDID
FROM UsersToCourses,CoursesEquivalencies,Departments
WHERE UsersToCourses.UID = $givenUID
AND CoursesEquivalencies.externalNumber = UsersToCourses.number
AND CoursesEquivalencies.externalSchool = UsersToCourses.school 
AND CourseEquivalencies.ExternalDID = UsersToCourses.department;


-- Get a department name

SELECT DISTINCT departmentName
FROM Departments
WHERE DID = $givenDID
AND school = $givenSchool;


-- Get all courses needed for a major

SELECT * 
FROM MaristCoursesToMajors
WHERE majorName = $givenMajorName;

-- Get a list of major names
SELECT majorName
FROM MaristMajors;

