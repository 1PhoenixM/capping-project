INSERT INTO Schools VALUES (1, 'Marist College'), (2, 'Dutchess Community College');

INSERT INTO Departments VALUES
(1,'MATH',1),
(2,'CMPT',1),
(3,'PHYS',1),
(4,'CHEM',1),
(5,'BIOL',1);

INSERT INTO Departments(departmentName, school)
VALUES('CHEM', 1);

INSERT INTO Departments(departmentName, school)
VALUES('CIS', 2);

INSERT INTO Departments(departmentName, school)
VALUES('MATH', 2);

INSERT INTO Departments(departmentName, school)
VALUES('ACC', 2);

INSERT INTO Departments(departmentName, school)
VALUES('PHY', 2);

INSERT INTO Departments(departmentName, school)
VALUES('BIO', 2);

INSERT INTO Departments(departmentName, school)
VALUES('CHEM', 2);
INSERT INTO MaristMajors VALUES
('Applied Mathematics','N/A');
INSERT INTO Courses VALUES
(1,1,'241L','"This course introduces the differential and integral calculus of algebraic trigonometric exponential and logarithmic functions on the real line. Limits continuity the mean value theorem and the Fundamental Theorem of Calculus are considered as well as applications using these ideas. Appropriate technology will be selected by the instructor. This course is offered every semester. Prerequisite: Three years of high school mathematics including trigonometry or MATH 120"','Calculus I',4,TRUE),
(1,1,'242L','"This course discusses applications of the definite integral as well as techniques of integration. Sequences and series Taylor�s theorem and polar notation are considered. Appropriate technology will be selected by the instructor. This course is offered every semester. Prerequisite: MATH 241"','Calculus II',4,TRUE),
(1,1,'343L','"This course introduces multivariate calculus. Topics covered include: vector geometry functions of several variables partial derivatives and multiple integration. As time permits line and surface integrals Green�s and Stoke�s theorems with related topics and their applications as well as differential equations may be covered. Appropriate technology will be selected by the instructor. Offered every semester."','Calculus III',4,TRUE),
(1,1,'210L','"This course introduces the theory of vector spaces and linear transformations as abstract systems. Matrices matrix operations and determinants are introduced and they are used to study systems of linear equations characteristic value problems and various applications. Appropriate technology will be selected by the instructor. This course is offered every semester. Corequisite: MATH 241 or permission of the instructor"','Linear Algebra',3,TRUE),
(1,1,'310L','"This course focuses on developing the habits of thought and careful exposition that are essential for successful study of mathematics at the junior/senior level. Fundamental proof methods including proof by contradiction by induction and through case analysis are studied in the context of elementary set and function theory number theory and binary relations. This course is offered every semester. Prerequisite: MATH 242"','Introduction to Mathematical Reasoning',3,TRUE),
(1,1,'321L','"Solutions to linear and non-linear differential equations are generated by use of integration techniques series and transform methods. Numerical methods for generating approximate solutions and geometric methods for the qualitative study of dynamical systems are also considered. Offered at least biennially in the spring. Prerequisites: MATH 210 and MATH 343 or permission of the instructor"','Differential Equations',3,TRUE),
(1,1,'330L','This course is an introduction to probability as a basis for the theory of statistics. The topics covered include sample spaces; conditional probability and independence; discrete and continuous distribution functions; random variables; and joint and marginal probability distributions. Offered at least biennially in the fall. Prerequisite: MATH 343','Probability and Statistics',3,TRUE),
(1,1,'420L','"This course undertakes a rigorous study of the topology of real numbers and more general spaces taking a unified approach to sequences and series and continuity. It may also include sequences of functions differentiation and the Fundamental Theorem of Calculus. Offered at least biennially in the fall. Prerequisites: MATH 210 MATH 310 MATH 343"','Mathematical Analysis I',3,TRUE),
(1,1,'422L','"This course considers advanced techniques in the analysis and applications of systems of ordinary differential equations. Topics may include Laplace transforms Hamiltonian and Lyapunov stability and bifurcations. The roles that matrices and complex variables play in modeling will be discussed. MATH 422 is offered at least biennially in the fall. Prerequisite: MATH 321"','Applied Mathematics',3,TRUE),
(1,1,'477L','TBA','Math Capping Course',3,TRUE),
(1,2,'120L','"This course introduces students to problem solving with computer programming. Students will study some historical context for problem solving with programming while mastering introductory programming skills including but not limited to user interaction design procedures functions scope alternation repetition collections and real-world modeling"','Introduction to Programming',4,TRUE),
(1,3,'211L','A study based on calculus and vector algebra of classical mechanics and sound. Two lectures and one problem session per week. Offered every fall. Pre- or Corequisite: MATH 241','General Physics I',3,TRUE),
(1,3,'213L','"Taken simultaneously with the corresponding lecture course in physics. The lab may or may not be required depending on the student�s major or program of study (e.g. pre-med etc.). One credit is assigned to each semester of the laboratory. Three-hour laboratory per week. Corequisites: PHYS 211-212-221"','Physics Lab I',1,TRUE),
(1,3,'212L','"This course continues the first-level survey of physics with a thorough study of electricity and magnetism optics and some aspects of modern physics. An attempt is made to focus on the nature of scientific inquiry and thought. Two lectures and one problem session per week. Offered every spring. Pre- or Corequisite: MATH 241"','General Physics II',3,TRUE),
(1,3,'214L','"Taken simultaneously with the corresponding lecture course in physics. The lab may or may not be required depending on the student�s major or program of study (e.g. pre-med etc.). One credit is assigned to each semester of the laboratory. Three-hour laboratory per week. Corequisites: PHYS 211-212-221"','Physics Lab II',1,TRUE),
(1,3,'221L','The course begins with the Kinetic Theory of Gases and moves forward through Quantum Mechanics and Relativity. This course provides an introduction to physics in the 20th century. Prerequisite: MATH 241','Modern Physics I',3,TRUE),
(1,3,'222L','"Taken simultaneously with the corresponding lecture course in physics. The lab may or may not be required depending on the student�s major or program of study (e.g. pre-med etc.). One credit is assigned to each semester of the laboratory. Three-hour laboratory per week. Corequisites: PHYS 211-212-221"','Modern Physics Lab',1,TRUE),
(1,4,'131L','"An introduction to the fundamental theories of inorganic chemistry including the structure of atoms electronic structure bonding reactions in aqueous media gas behavior intermolecular forces and properties of solutions. The laboratory course demonstrates the lecture material and emphasizes laboratory technique data treatment and report writing. Two lectures one recitation and one threehour laboratory per week."','General Chemistry I: Introduction to Inorganic Chemistry',4,TRUE),
(1,4,'132L','"An introduction to the principles of physical chemistry beginning with chemical thermodynamics and working through reaction rates equilibrium acid-base chemistry electrochemistry and nuclear chemistry. The lecture and laboratory components of this course are designed to complement each other. Lecture presents background theory while laboratory emphasizes application of theoretical concepts to hands-on discovery. Two lectures one recitation and one three-hour laboratory per week. Prerequisite: CHEM 131"','General Chemistry II: Introduction to Physical Chemistry',4,TRUE),
(1,5,'130L','"This course is designed to introduce science majors to the major generalizations in biology. Topics include the scientific method the chemical and cellular basis of life energy transformation DNA structure and replication protein synthesis"','General Biology I',4,TRUE),
(1,5,'131L','"Designed to introduce science majors to fundamental concepts in biology. Topics include: transmission genetics evolutionary theory and selected ecological principles along with an examination of science as a process and the distinction between science and religion. The laboratory will emphasize experimental design genetics evolution and animal diversity and taxonomy. Three-hour lecture three-hour laboratory per week. Offered every spring. Prerequisite: BIOL 130"','General Biology II',4,TRUE),
(1,2,'220L','This course builds on CMPT 120 to introduce our students to the art and science of software development. Students will study software development history while mastering SD skills including but not limited to real-world modeling and multi-language software development. Prerequisite: CMPT 120','Software Development I',4,TRUE),
(1,2,'435L','"This course continues the study of data abstraction and algorithm complexity from a more mathematically formal viewpoint. Time complexity of algorithms will be examined using Big Oh notation and worst- best- and average-case analyses. The ideas of polynomial-time NP exponential and intractable algorithms will be introduced. Elementary-recurrence relation problems relating to recursive procedures will be solved. Sorting algorithms will be formally analyzed. Strategies of algorithm design such as backtracking divide and conquer dynamic programming and greedy techniques will be emphasized. Prerequisites: CMPT 221 MATH 205"','Algorithm Analysis & Design',4,TRUE),
(1,2,'404L','"This course is an introduction to the major problems techniques and issues of artificial intelligence. Emphasis is placed upon the topics of knowledge representation and problem solving. The languages LISP or PROLOG will be used to illustrate various AI techniques. Offered every fall. Prerequisite: CMPT 435"','Artificial Intelligence',3,TRUE),
(1,2,'446L','"In this course students study the mathematical foundations and essential techniques in the field of modern computer graphics. Central topics include modeling & meshes viewing transformations graphics pipeline lighting models programmable shaders scene graphs animation user interaction and graphics hardware. Through both guided and self-directed learning opportunities students gain experience with industry-standard programming interfaces and tools and develop an understanding of design and implementation of interactive 3D graphics applications. Prerequisite: CMPT 220"','Computer Graphics',4,TRUE),
(1,1,'205L','"This course introduces the algebraic concepts methods and techniques that form the basis of computer science including the relevant areas of logic set theory matrices graphs geometric linear algebra and the theory of relations; functions; bounds; and permutations. Offered every semester. Prerequisite: Three years of high school mathematics"','Discrete Mathematics',4,TRUE);
INSERT INTO Courses(school, DID, courseNumber, description, courseName, credits, isActive)
VALUES(2, 9, '101', 'Learn the basic principles of accounting.', 'Principles of Accounting I', 3, true);

INSERT INTO Courses(school, DID, courseNumber, description, courseName, credits, isActive)
VALUES(2, 9, '102', 'Expand on the Principles of Accounting to more advanced topics.', 'Principles of Accounting I', 3, true);

INSERT INTO Courses(school, DID, courseNumber, description, courseName, credits, isActive)
VALUES(2, 9, '104', 'Learn about Financial Accounting principles and personal accounting techniques.', 'Financial Accounting', 3, true);

INSERT INTO Courses(school, DID, courseNumber, description, courseName, credits, isActive)
VALUES(2, 9, '201', 'Learn about intermediate accounting practices related to business management.', 'Managerial Accounting', 3, true);

INSERT INTO Courses(school, DID, courseNumber, description, courseName, credits, isActive)
VALUES(2, 7, '108', 'Information & computer Literacy', 'Information & computer Literacy', 3, true);

INSERT INTO Courses(school, DID, courseNumber, description, courseName, credits, isActive)
VALUES(2, 7, '111', 'Computer Systems & Applications.', 'Computer Systems & Applications', 3, true);

INSERT INTO Courses(school, DID, courseNumber, description, courseName, credits, isActive)
VALUES(2, 7, '126', 'UNIX.', 'UNIX', 3, true);

INSERT INTO Courses(school, DID, courseNumber, description, courseName, credits, isActive)
VALUES(2, 7, '117', 'Data Communications.', 'Data Communications', 3, true);

INSERT INTO Courses(school, DID, courseNumber, description, courseName, credits, isActive)
VALUES(2, 8, '115', 'Pre-Calculus.', 'Pre-Calculus', 3, true);

INSERT INTO Courses(school, DID, courseNumber, description, courseName, credits, isActive)
VALUES(2, 8, '118', 'Introduction to Statistics.', 'Introduction to Statistics.', 3, true);

INSERT INTO Courses(school, DID, courseNumber, description, courseName, credits, isActive)
VALUES(2, 8, '125', 'Calculus with Management Applications.', 'Calculus with Management Applications', 3, true);

INSERT INTO Courses(school, DID, courseNumber, description, courseName, credits, isActive)
VALUES(2, 8, '140', 'Discrete Math I.', 'Discrete Math I.', 3, true);

INSERT INTO Courses(school, DID, courseNumber, description, courseName, credits, isActive)
VALUES(2, 10, '121', 'General Physics I & Lab.', 'General Physics I & Lab.', 4, true);

INSERT INTO Courses(school, DID, courseNumber, description, courseName, credits, isActive)
VALUES(2, 10, '122', 'General Physics II & Lab.', 'General Physics II & Lab', 4, true);

INSERT INTO Courses(school, DID, courseNumber, description, courseName, credits, isActive)
VALUES(2, 10, '115', 'Fundamentals of Electricity.', 'Fundamentals of Electricity', 3, true);

INSERT INTO Courses(school, DID, courseNumber, description, courseName, credits, isActive)
VALUES(2, 10, '132', 'Physics Course.', 'Physics Course', 3, true);

INSERT INTO Courses(school, DID, courseNumber, description, courseName, credits, isActive)
VALUES(2, 11, '101', 'General Biology I & Lab.', 'General Biology I & Lab', 4, true);

INSERT INTO Courses(school, DID, courseNumber, description, courseName, credits, isActive)
VALUES(2, 11, '102', 'General Biology II & Lab.', 'General Biology II & Lab', 4, true);

INSERT INTO Courses(school, DID, courseNumber, description, courseName, credits, isActive)
VALUES(2, 11, '103', 'Human Biology.', 'Human Biology', 3, true);

INSERT INTO Courses(school, DID, courseNumber, description, courseName, credits, isActive)
VALUES(2, 11, '107', 'Ecology.', 'Ecology', 3, true);

INSERT INTO Courses(school, DID, courseNumber, description, courseName, credits, isActive)
VALUES(2, 12, '121', 'General Chemistry I & Lab.', 'General Chemistry I & Lab', 4, true);

INSERT INTO Courses(school, DID, courseNumber, description, courseName, credits, isActive)
VALUES(2, 12, '122', 'General Chemistry II & Lab.', 'General Chemistry II & Lab', 4, true);

INSERT INTO Courses(school, DID, courseNumber, description, courseName, credits, isActive)
VALUES(2, 12, '231', 'Organic Chemistry I & Lab.', 'Organic Chemistry I & Lab', 4, true);

INSERT INTO Courses(school, DID, courseNumber, description, courseName, credits, isActive)
VALUES(2, 12, '232', 'Organic Chemistry II & Lab.', 'Organic Chemistry II & Lab', 4, true);
INSERT INTO Courses VALUES
(2,8,'000','...',NULL,3,TRUE),
(2,8,'222','...','Calculus II',3,TRUE),
(2,8,'223','...','Calculus III',3,TRUE),
(2,8,'215','...','Linear Algebra',3,TRUE),
(2,8,'217','...','INT MATH REASON',3,TRUE),
(2,8,'224','...','DIFFERENT EQUAT',3,TRUE),
--(2,8,'118','...','INTRO-STATISTICS',3,TRUE),--
(2,8,'273','...','MATH ELECTIVE',3,TRUE),
(2,8,'901','...','MATH COURSE',3,TRUE),
(2,8,'904','...','MATH COURSE',3,TRUE),
(2,7,'112','...','COMPUTER PROGRAMMING I',3,TRUE),
(2,10,'151','...','GENERAL PHYSICS I',3,TRUE),
(2,10,'151L','...','GEN PHYSICS LAB I',1,TRUE),
(2,10,'252','...','GEN PHYSICS II',3,TRUE),
(2,10,'152L','...','GEN PHYSICS LAB II',1,TRUE),
(2,10,'253','...','GEN PHYSICS III',3,TRUE),
(2,10,'253L','...','GEN PHYSICS LAB III',1,TRUE),
--(2,12,'121','...','GEN CHEMISTRY I',3,TRUE),--
(2,12,'121L','...','GEN CHEM LAB I',1,TRUE),
--(2,11,'101','...','GENERAL BIOLOGY I',3,TRUE),--
(2,11,'101L','...','GEN BIO LAB I',1,TRUE),
(2,7,'215','...','COMP SCI I',3,TRUE),
(2,7,'272','...','CMSC ELECTIVES',3,TRUE),
(2,7,'801','...','CIS ELECTIVE',3,TRUE),
(2,7,'801L','...','COMPCI ELECTIVE',3,TRUE);
--(2,8,'215','...','LINEAR ALGERBRA',3,TRUE);--
INSERT INTO CoursesToMajors VALUES
('Applied Mathematics',1,1,'241L'),
('Applied Mathematics',1,1,'242L'),
('Applied Mathematics',1,1,'343L'),
('Applied Mathematics',1,1,'210L'),
('Applied Mathematics',1,1,'310L'),
('Applied Mathematics',1,1,'321L'),
('Applied Mathematics',1,1,'330L'),
('Applied Mathematics',1,1,'420L'),
('Applied Mathematics',1,1,'422L'),
('Applied Mathematics',1,1,'477L'),
('Applied Mathematics',1,2,'120L'),
('Applied Mathematics',1,3,'211L'),
('Applied Mathematics',1,3,'213L'),
('Applied Mathematics',1,3,'212L'),
('Applied Mathematics',1,3,'214L'),
('Applied Mathematics',1,3,'221L'),
('Applied Mathematics',1,3,'222L'),
('Applied Mathematics',1,4,'131L'),
('Applied Mathematics',1,4,'132L'),
('Applied Mathematics',1,5,'130L'),
('Applied Mathematics',1,5,'131L'),
('Applied Mathematics',1,2,'220L'),
('Applied Mathematics',1,2,'435L'),
('Applied Mathematics',1,2,'404L'),
('Applied Mathematics',1,2,'446L'),
('Applied Mathematics',1,1,'205L');
--INSERT INTO CourseEquivalencies(maristDID, maristNumber, maristSchool, externalSchool, externalDID, externalNumber) 
VALUES (1, '241L', 1, 2, 8, NULL);--

INSERT INTO CourseEquivalencies(maristDID, maristNumber, maristSchool, externalSchool, externalDID, externalNumber) 
VALUES (1, '242L', 1, 2, 8, '222');

INSERT INTO CourseEquivalencies(maristDID, maristNumber, maristSchool, externalSchool, externalDID, externalNumber) 
VALUES (1, '343L', 1, 2, 8, '223');

INSERT INTO CourseEquivalencies(maristDID, maristNumber, maristSchool, externalSchool, externalDID, externalNumber) 
VALUES (1, '210L', 1, 2, 8, '215');

INSERT INTO CourseEquivalencies(maristDID, maristNumber, maristSchool, externalSchool, externalDID, externalNumber) 
VALUES (1, '310L', 1, 2, 8, '217');

INSERT INTO CourseEquivalencies(maristDID, maristNumber, maristSchool, externalSchool, externalDID, externalNumber) 
VALUES (1, '321L', 1, 2, 8, '224');

--INSERT INTO CourseEquivalencies(maristDID, maristNumber, maristSchool, externalSchool, externalDID, externalNumber) 
VALUES (1, '330L', 1, 2, 8, '118');--

INSERT INTO CourseEquivalencies(maristDID, maristNumber, maristSchool, externalSchool, externalDID, externalNumber) 
VALUES (1, '420L', 1, 2, 8, '273');

INSERT INTO CourseEquivalencies(maristDID, maristNumber, maristSchool, externalSchool, externalDID, externalNumber) 
VALUES (1, '422L', 1, 2, 8, '901');

INSERT INTO CourseEquivalencies(maristDID, maristNumber, maristSchool, externalSchool, externalDID, externalNumber) 
VALUES (1, '477L', 1, 2, 8, '904');

INSERT INTO CourseEquivalencies(maristDID, maristNumber, maristSchool, externalSchool, externalDID, externalNumber) 
VALUES (2, '120L', 1, 2, 7, '112');

INSERT INTO CourseEquivalencies(maristDID, maristNumber, maristSchool, externalSchool, externalDID, externalNumber) 
VALUES (3, '211L', 1, 2, 10, '151');

INSERT INTO CourseEquivalencies(maristDID, maristNumber, maristSchool, externalSchool, externalDID, externalNumber) 
VALUES (3, '213L', 1, 2, 10, '151L');

INSERT INTO CourseEquivalencies(maristDID, maristNumber, maristSchool, externalSchool, externalDID, externalNumber) 
VALUES (3, '212L', 1, 2, 10, '252');

INSERT INTO CourseEquivalencies(maristDID, maristNumber, maristSchool, externalSchool, externalDID, externalNumber) 
VALUES (3, '214L', 1, 2, 10, '152L');

INSERT INTO CourseEquivalencies(maristDID, maristNumber, maristSchool, externalSchool, externalDID, externalNumber) 
VALUES (3, '221L', 1, 2, 10, '253');

INSERT INTO CourseEquivalencies(maristDID, maristNumber, maristSchool, externalSchool, externalDID, externalNumber) 
VALUES (3, '222L', 1, 2, 10, '253L');

--INSERT INTO CourseEquivalencies(maristDID, maristNumber, maristSchool, externalSchool, externalDID, externalNumber) 
VALUES (4, '131L', 1, 2, 12, '121');--

INSERT INTO CourseEquivalencies(maristDID, maristNumber, maristSchool, externalSchool, externalDID, externalNumber) 
VALUES (4, '132L', 1, 2, 12, '121L');

--INSERT INTO CourseEquivalencies(maristDID, maristNumber, maristSchool, externalSchool, externalDID, externalNumber) 
VALUES (5, '130L', 1, 2, 11, '101');--

INSERT INTO CourseEquivalencies(maristDID, maristNumber, maristSchool, externalSchool, externalDID, externalNumber) 
VALUES (5, '131L', 1, 2, 11, '101L');

INSERT INTO CourseEquivalencies(maristDID, maristNumber, maristSchool, externalSchool, externalDID, externalNumber) 
VALUES (2, '220L', 1, 2, 7, '215');

INSERT INTO CourseEquivalencies(maristDID, maristNumber, maristSchool, externalSchool, externalDID, externalNumber)
VALUES (2, '435L', 1, 2, 7, '272');

INSERT INTO CourseEquivalencies(maristDID, maristNumber, maristSchool, externalSchool, externalDID, externalNumber)
VALUES (2, '404L', 1, 2, 7, '801');

INSERT INTO CourseEquivalencies(maristDID, maristNumber, maristSchool, externalSchool, externalDID, externalNumber) 
VALUES (2, '446L', 1, 2, 7, '801L');

INSERT INTO CourseEquivalencies(maristDID, maristNumber, maristSchool, externalSchool, externalDID, externalNumber)
VALUES (1, '205L', 1, 2, 8, '215');
