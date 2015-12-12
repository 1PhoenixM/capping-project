--People

INSERT INTO People(firstName, lastName, gender, age, race, state, emailAddress, password) 
VALUES('Admin', 'Admin', 'M', 33, 'Other', 'NY', 'admin@marist.edu', '113459eb7bb31bddee85ade5230d6ad5d8b2fb52879e00a84ff6ae1067a210d3');

INSERT INTO People(firstName, lastName, gender, age, race, state, emailAddress, password) 
VALUES ('Kenneth', 'Brooks', 'M', 23, 'caucasian', 'CT', 'Kenneth.Brooks3@test.com', '113459eb7bb31bddee85ade5230d6ad5d8b2fb52879e00a84ff6ae1067a210d3' );

INSERT INTO People(firstName, lastName, gender, age, race, state, emailAddress, password) 
VALUES('Tom', 'Smith', 'M', 22, 'asian', 'WY', 'Tom.Smith@test.com', '113459eb7bb31bddee85ade5230d6ad5d8b2fb52879e00a84ff6ae1067a210d3');

INSERT INTO People(firstName, lastName, gender, age, race, state, emailAddress, password) 
VALUES('Jack', 'Ripper', 'M', 25, 'caucasian', 'MA', 'Jack.the.Ripper@London.com', '113459eb7bb31bddee85ade5230d6ad5d8b2fb52879e00a84ff6ae1067a210d3');

INSERT INTO People(firstName, lastName, gender, age, race, state, emailAddress, password) 
VALUES('Bonnie', 'Clyde', 'F', 19, 'caucasian', 'CA', 'Bonnie.Clyde@test.com', '113459eb7bb31bddee85ade5230d6ad5d8b2fb52879e00a84ff6ae1067a210d3');

INSERT INTO People(firstName, lastName, gender, age, race, state, emailAddress, password) 
VALUES('George', 'Foreman', 'M', 35, 'African-American', 'TX', 'Lean.Mean.Grilling.Machine@Foreman.com', '113459eb7bb31bddee85ade5230d6ad5d8b2fb52879e00a84ff6ae1067a210d3');

INSERT INTO People(firstName, lastName, gender, age, race, state, emailAddress, password) 
VALUES('Marcus', 'Kane', 'M', 35, 'caucasian', 'NY', 'Sweetooth@Clown.com', '113459eb7bb31bddee85ade5230d6ad5d8b2fb52879e00a84ff6ae1067a210d3');

INSERT INTO People(firstName, lastName, gender, age, race, state, emailAddress, password) 
VALUES('Jigsaw', 'Clownman', 'M', 33, 'Other', 'NY', 'Peek.a.boo@saw.com', '113459eb7bb31bddee85ade5230d6ad5d8b2fb52879e00a84ff6ae1067a210d3');

--Employee

INSERT INTO Employees(Eid, Clearance, Office) VALUES(1,'3','Admissions');

--Schools

INSERT INTO Schools(schoolName, country, city, state, zip) VALUES('Marist College', 'United States', 'Poughkeepsie', 'NY', '12601');

INSERT INTO Schools(schoolName, country, city, state, zip) VALUES('Dutchess Community College', 'United States', 'Poughkeepsie', 'NY', '12601');


--SchoolsToUsers

INSERT INTO SchoolsToUsers(UID, SID) 
VALUES(6, 2);

INSERT INTO SchoolsToUsers(UID, SID) 
VALUES(7, 2);


--Departments

INSERT INTO Departments(departmentName, school)
VALUES('CMPT', 1);

INSERT INTO Departments(departmentName, school)
VALUES('MATH', 1);

INSERT INTO Departments(departmentName, school)

VALUES('PHYS', 1);

INSERT INTO Departments(departmentName, school)
VALUES('BIO', 1);

INSERT INTO Departments(departmentName, school)
VALUES('PYSC', 1);
