--People

INSERT INTO People(PID, firstName, lastName, gender, age, race, state, emailAddress, password) 
VALUES(‘Kenneth’, ‘Brooks’, ‘M’, 23, ‘caucasian’, ‘CT’, ‘Kenneth.Brooks3@test.com’, ‘password’);

INSERT INTO People(PID, firstName, lastName, gender, age, race, state, emailAddress, password) 
VALUES(‘Tom’, ‘Smith’, ‘M’, 22, ‘asian’, ‘WY’, ‘Tom.Smith@test.com’, ‘password’);

INSERT INTO People(PID, firstName, lastName, gender, age, race, state, emailAddress, password) 
VALUES(‘Jack’, ‘Ripper’, ‘M’, 25, ‘caucasian’, ‘MA’, ‘Jack.the.Ripper@London.com’, ‘password’);

INSERT INTO People(PID, firstName, lastName, gender, age, race, state, emailAddress, password) 
VALUES(‘Bonnie’, ‘Clyde’, ‘F’, 19, ‘caucasian’, ‘CA’, ‘Bonnie.Clyde@test.com’, ‘password’);

INSERT INTO People(PID, firstName, lastName, gender, age, race, state, emailAddress, password) 
VALUES(‘George’, ‘Foreman’, ‘M’, 35, ‘African-American’, ‘TX’, ‘Lean.Mean.Grilling.Machine@Foreman.com’, ‘password’);

INSERT INTO People(PID, firstName, lastName, gender, age, race, state, emailAddress, password) 
VALUES(‘Marcus’, ‘Kane’, ‘M’, 35, ‘caucasian’, ‘NY’, ‘Needles@Clown.com’, ‘password’);

INSERT INTO People(PID, firstName, lastName, gender, age, race, state, emailAddress, password) 
VALUES(‘Jigsaw’, ‘Clownman’, ‘M’, 33, ‘Other’, ‘NY’, ‘Peek.a.boo@saw.com’, ‘password’);


--Employee

INSERT INTO Employee(Eid, Clearance) 
VALUES(1, 3);

INSERT INTO Employee(Eid, Clearance) 
VALUES(2, 1);

INSERT INTO Employee(Eid, Clearance) 
VALUES(3, 3);

INSERT INTO Employee(Eid, Clearance) 
VALUES(4, 1);

INSERT INTO Employee(Eid, Clearance) 
VALUES(5, 2);

--Schools

INSERT INTO Schools(SID, schoolName, country, address1, address2, city, state, zip) VALUES(1, ‘Marist College’, ‘United States’,  ‘’, ‘Poughkeepsie’, ‘NY’, ‘12601’);

INSERT INTO Schools(SID, schoolName, country, address1, address2, city, state, zip) VALUES(2, ‘Dutchess Community College’, ‘United States’,  ‘’, ‘Poughkeepsie’, ‘NY’, ‘12601’);


--SchoolsToUsers

INSERT INTO SchoolsToUsers(UID, SID) 
VALUES(6, 2);

INSERT INTO SchoolsToUsers(UID, SID) 
VALUES(7, 2);


--Departments

INSERT INTO Departments(DID, departmentName, school)
VALUES(CMPT, 1);

INSERT INTO Departments(DID, departmentName, school)
VALUES(MATH, 1);

INSERT INTO Departments(DID, departmentName, school)
VALUES(ENG, 1);

INSERT INTO Departments(DID, departmentName, school)
VALUES(CMPT, 1);

INSERT INTO Departments(DID, departmentName, school)
VALUES(CMPT, 1);

INSERT INTO Departments(DID, departmentName, school)
VALUES(CMPT, 1);