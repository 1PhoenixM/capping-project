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
VALUES(PYSC, 1);

INSERT INTO Departments(DID, departmentName, school)
VALUES(PHYS, 1);

INSERT INTO Departments(DID, departmentName, school)
VALUES(BIO, 1);