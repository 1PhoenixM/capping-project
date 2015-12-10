//Authors: Conner Ferguson, Melissa Iori, Brian Main
//To run: node index.js
//This is the main file that runs the "server" for the credit transfer app for Marist College.

//Dependencies for Express framework
var express = require('express');
var session = require('express-session');
var app = express();
var fs = require('fs'); //filesystem
var path = require('path'); //url decoder
var pg = require("pg"); //postgres adapter
var crypto = require('crypto');  //crypto
var rootDirectory = '/admission/transfer/credits'; //Main root directory to get to the app
var rootAppDirectory = '/admission/transfer/credits/app'; //All views are found under this path
var conString = "pg://postgres:Candi7@localhost:5432/credit_transfer";  //Postgres DB connection (DB is on the same server)
var client = new pg.Client(conString); //Actual DB connection, starts automatically
client.connect();
app.use(express.static(__dirname + '/static')); //Static assets served here
app.use('/static', express.static(__dirname + '/static'));
app.use('/admission/transfer/static', express.static(__dirname + '/static'));
app.use('/admission/transfer/credits/static', express.static(__dirname + '/static'));
app.use(rootAppDirectory+'/static', express.static(__dirname + '/static'));
app.set('views',path.join(__dirname, './views'));
app.set('view engine', 'jade');
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       
app.use(bodyParser.urlencoded({    
  extended: true
}));
var externalSchools = updateSchools();
app.use(session({
  genid: function(req){
    return  crypto.randomBytes(48).toString('hex');
},
  user: '',
  clearance: 0,
  secret: 'sayanouta',
  resave: true,
  saveUninitialized: true,
}));

var majorsQuery = client.query("SELECT majorName FROM MaristMajors");
var maristMajors = [];
majorsQuery.on("row", function (row, result){
	maristMajors.push(row.majorname);
});

function updateSchools(){
  var query = client.query("SELECT schoolName From Schools WHERE schoolName != 'Marist College';");
  var externalSchools = [];
  query.on("row", function (row, result) {
    externalSchools.push(row.schoolname);
  });
  return externalSchools;
};


/*function wrapPage(pageBody){
	pageTop = fs.readFileSync(path.join(__dirname, './html/wrapper') + '/top.html', 'utf-8');	
	pageBottom = fs.readFileSync(path.join(__dirname, './html/wrapper') + '/bottom.html', 'utf-8');	
	return page = pageTop + pageBody + pageBottom;
}*/

//Redirect to the initial page.
app.get('/', function (req, res) {
  /*pageBody = wrapPage(fs.readFileSync(path.join(__dirname, './html') + '/credits.html', 'utf-8'));	
  res.send(pageBody);*/
  res.render("credits", {startpage:1});
});

//Wireframe #1
//At current Marist /admission/transfer/credits page, contains a link to the app.
app.get(rootDirectory, function (req, res) {
  res.render("credits", {user:req.session.user});
});

app.get(rootAppDirectory, function (req, res) {
  res.render("startPage", {startpage:1});
});

//Wireframe #2
//The initial start page that greets the user to either log in or choose a school.
app.get(rootAppDirectory + '/start', function (req, res) {
    res.render("startPage", {schools:externalSchools, user:req.session.user});
});


//Wireframe #9
//The user account creation form. Can pass in query parameters here via the req variable, to handle form errors.
//Redirect user here if account creation fails.
app.get(rootAppDirectory + '/createAccount', function (req, res) {
  if (req.session.user){
    res.redirect(rootAppDirectory + '/accessDenied'); 
  }else{
    res.render("createAccount", {schools:externalSchools});
  }
});

app.post(rootAppDirectory + '/createAccountAction', function ( req, res) {
  var email = req.body.emailAddress;
  var hashedPass = req.body.password;
  var doubleHashPass = crypto.createHash('sha256').update(hashedPass).digest("hex");
  //Optional vars
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var state = req.body.state;
  var school = req.body.school;
  var gender = req.body.gender;
  var race = req.body.race;
  var age = req.body.age;
  var schoolQueryString = "SELECT SID from SCHOOLS WHERE schoolname = '" + school + "' LIMIT 1;";
  var query = client.query(schoolQueryString); 
  query.on("row", function(row,result){
    schoolID = row.SID;
  });
  client.query('INSERT INTO people (emailAddress, password, firstname, lastname, state, gender, race, age) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);',
    [email,doubleHashPass,firstName,lastName,state,gender,race,age],
    function(err,result) {
      if(err) {
        console.log(err);
  }});
  res.render("createAccountSuccess", {});
});
 
//(no wireframe)
//Shows message indicating user account was successfully created and contains link to /main
app.get(rootAppDirectory + '/createAccountSuccess', function (req, res) {
  res.render("createAccountSuccess", {});
});

//Wireframe #3:
//The user account login page, not usable by employees.
app.get(rootAppDirectory + '/login', function (req, res) {
  if (req.session.user){
    res.redirect(rootAppDirectory + '/accessDenied'); 
  }else{
    res.render("login", {});
  }
});

app.post(rootAppDirectory + '/loginAction', function (req, res){
  var email = req.body.emailAddress;
  var hashedPass = req.body.password;
  var doubleHashPass = crypto.createHash('sha256').update(hashedPass).digest("hex");
  var queryString = "SELECT emailaddress, pid  FROM people WHERE UPPER(emailaddress) = UPPER('" + email + "') AND password = '" + doubleHashPass + "' LIMIT 1;";
  var query = client.query(queryString);
  var pid = -1;
  query.on("row",function(row,result){
    req.session.user = row.emailaddress;
    pid  = row.pid
  });
  query.on("end", function(row,result){
     var clearanceQueryString = "SELECT clearance FROM employees WHERE eid = " + pid + ";";
     var clearanceQuery = client.query(clearanceQueryString);
     clearanceQuery.on("row",function(row,result){
       req.session.clearance = row.clearance;
     });
     clearanceQuery.on("end", function(row,result){
       if (req.session.user){
         res.redirect(rootAppDirectory + '/main'); 
       }else{
         res.redirect(rootAppDirectory + '/accessDenied'); 
       }
    });
  }); 
});

app.post(rootAppDirectory + '/changePasswordAction', function ( req, res){
  var hashedPass = req.body.newPassword;
  var doubleHashPass = crypto.createHash('sha256').update(hashedPass).digest("hex");
  var queryString = "UPDATE people SET password = '" + doubleHashPass + "' WHERE emailAddress ='" + req.session.user + "';";
  var query = client.query(queryString);
  query.on("end", function(row,result){
    res.render("changePasswordSuccess", {user:req.session.user});     
  });
});


//Wireframe #4
//The "forgot password" page allowing an email to be sent to the user.
app.get(rootAppDirectory + '/forgotPassword', function (req, res) {
  if (req.session.user){
    res.redirect("main"); 
 } else{
    res.render("forgotPassword", {user:req.session.user});
 }
});

//Wireframe #5
//Shows message indicating that a password recovery email was successfully sent.
app.get(rootAppDirectory + '/forgotPasswordEmailSent', function (req, res) {
  if(req.session.user){
    res.render("forgotPasswordEmailSent", {user:req.session.user});
  }else{
    res.redirect(rootAppDirectory + '/accessDenied'); 
 }
});

//Wireframe #6
//The main menu for registered users.
app.get(rootAppDirectory + '/main', function (req, res) {
  if(req.session.user){ 
    res.render("main", {user:req.session.user, clearance:req.session.clearance});
  }else{
    res.redirect(rootAppDirectory + '/accessDenied'); 
 }
});

//Wireframe #7
//Page allowing user to change their password.
app.get(rootAppDirectory + '/changePassword', function (req, res) {
  if(req.session.user){
    res.render("changePassword", {user:req.session.user});
  }else{
    res.redirect(rootAppDirectory + '/accessDenied'); 
 }
});

//Wireframe #8
//Shows message indicating that password was successfully changed.
app.get(rootAppDirectory + '/changePasswordSuccess', function (req, res) {
  if(req.session.user){  
    res.render("changePasswordSuccess", {user:req.session.user});
  }else{
    res.redirect(rootAppDirectory + '/accessDenied'); 
 }
});

//Wireframe #11
//Allows user to select courses and update their existing course list.
app.post(rootAppDirectory + '/courseSelection', function (req, res) {
  var userSchool = req.body.schools;
  var departments = [];
  var majors = [];
  var subQueryString = "SELECT SID FROM Schools WHERE schoolName = '" + userSchool + "' LIMIT 1";
 // var queryString = "SELECT courseName FROM Courses WHERE school =(" + subQueryString + ");";
  var queryString = "SELECT departmentName FROM Departments WHERE school =(" + subQueryString + ") ORDER BY departmentName;";
  var query = client.query(queryString);
  query.on("row", function (row, result) {
     departments.push(row.departmentname) });
  query.on("end",function ( result){
     var initialCourses = [];
     var getInitialCourses = client.query("SELECT courseNumber FROM Courses WHERE school=(" + subQueryString + ") AND DID IN (SELECT DID FROM Departments WHERE departmentName = '" + departments[0] + "' AND school =(" + subQueryString + "))");
     getInitialCourses.on("row", function(row, result){
	initialCourses.push(row.coursenumber);
     }); 
     getInitialCourses.on("end", function (result){
     	 if(req.session.user === null){
    		 res.render("courseSelection", {initialCourses:initialCourses,depts:departments,school:userSchool,majors:maristMajors,user:req.session.user,courses:"Test"});
    	 }
    	 if(req.session.user !== null){
		var userCourses = "";
	     	var courseQuery = "SELECT d.departmentName,c.courseNumber FROM Departments d,UsersToCourses c WHERE d.DID = c.DID AND c.PID IN (SELECT PID FROM People WHERE emailAddress='"+ req.session.user +"')";
		var courseQueryObj = client.query(courseQuery);
		courseQueryObj.on("row", function (row, result){
			userCourses += row.departmentname + "_" + row.coursenumber + "/";
			//console.log(userCourses);
		 });
		 courseQueryObj.on("end", function (result){
			userCourses = userCourses.substring(0,userCourses.length-1);
			res.render("courseSelection", {initialCourses:initialCourses,depts:departments,school:userSchool,majors:maristMajors,user:req.session.user,userCourses:userCourses});
		 });
         }
     });
   });
});

function deleteCourses(toBeDeleted,uid){
	theCourses = toBeDeleted.split("/");
	courseDept = '';
	courseNumber = '';
		for(var i = 0; i < theCourses.length; i++){
			(function (courseDept,courseNumber){
			courseDept = theCourses[i].split("_")[0];
			courseNumber = theCourses[i].split("_")[1];
			//console.log(courseNumber);
			client.query("DELETE FROM UsersToCourses WHERE PID IN (SELECT PID FROM People WHERE emailAddress = $1) AND DID IN (SELECT DID FROM Departments WHERE departmentName = $2) AND courseNumber = $3",[uid,courseDept,courseNumber],
			function(err,result){
				if(err) {console.log(err)}
			});
			}) (courseDept,courseNumber);
		}
}	

//JSON API to get data after the page has loaded, say a list of course numbers for a department the user selected.
app.get('/api/' + 'courseNumbers/:dept/:school', function (req, res) {
  var dept = req.params.dept;
  var school = req.params.school;
  var courseNumbers = "";
  var secondsub = "(SELECT SID FROM Schools WHERE schoolName = '" + school + "')";
  var subquery = "(SELECT DID FROM Departments WHERE departmentName = '" + dept + "' AND school = " + secondsub + ")";
  var queryString = "SELECT courseNumber FROM Courses WHERE DID = " + subquery +  " ORDER BY courseNumber;";
  res.setHeader("Content-Type", "application/json");
  var query = client.query(queryString);
  query.on("row", function (row, result) {
     courseNumbers += "\"" + row.coursenumber + "\", ";
  });
  query.on("end",function ( result){
    courseNumbers = courseNumbers.substring(0,courseNumbers.length-2);
    res.send("{ \"courseNumbers\":  [  " + courseNumbers + " ]}");
    res.end();
});
});

app.get('/api/' + 'departments/:school', function (req, res) {
  var school = req.params.school;
  var depts = "";
  var secondsub = "(SELECT SID FROM Schools WHERE schoolname = '" + school + "')";
  var queryString = "(SELECT departmentName FROM Departments WHERE school = " + secondsub + " ORDER BY departmentName)";
  res.setHeader("Content-Type", "application/json");
  var query = client.query(queryString);
  query.on("row", function (row, result) {
     depts += "\"" + row.departmentname + "\", ";
  });
  query.on("end",function ( result){
    depts = depts.substring(0, depts.length-2);
    res.send("{ \"departments\":  [  " + depts + " ]}");
    res.end();
});
});

app.get('/api/' + 'coursetitles/:school/:dept/:coursenumber', function(req, res) {
  var school = req.params.school;
  var dept = req.params.dept;
  var courseNumber = req.params.coursenumber;
  var title = "";
  var secondsub = "(SELECT SID FROM Schools WHERE schoolname = '" + school + "')";
  var queryString = "SELECT courseName FROM Courses WHERE school = " + secondsub + " AND DID IN (SELECT DID FROM Departments WHERE departmentName = '" + dept + "') AND courseNumber = '" + courseNumber + "'";  
  res.setHeader("Content-Type", "application/json");
  theQuery = client.query(queryString);
  theQuery.on("row", function(row,result){
	title = row.coursename;
  });
  theQuery.on("end", function(result){
	res.send(" { \"title\": \" " + title + " \"}");
	res.end();
  });
});

//Wireframe #12
//If user entered only a major and no courses, shows the required Marist courses for that major.
//If user entered only courses and selected no major, shows their personal percentage completion for all Marist majors in order, based on courses entered.
//If user entered both courses and selected a major, shows a credit evaluation for that particular major with those courses.
app.post(rootAppDirectory + '/courseEvaluation', function (req, res) {
    //console.log(req.body);
    //query = "";
    chosenMajor = req.body.major;
    delete req.body.major;
    //console.log(req.body.deletes);
    if(req.body.deletes && req.session.user !== null){
	//console.log("Any");
	toBeDeleted = req.body.deletes;
	delete req.body.deletes;
	deleteCourses(toBeDeleted,req.session.user);
    }
    var userCourses = req.body;
    var numberOfCourses = Object.keys(userCourses).length;
    total = 0;
    courseDept = '';
    courseNumber = '';
    theCourses = [];
    messages = [];
    course = '';
    isEmpty = false;
    for(course in userCourses){  
	(function(course,theCourses,messages) {
	    testQuery = "SELECT d.departmentName,c.courseNumber,c.courseName,c.credits FROM Departments d, Courses c WHERE ";
	    testQuery += "d.DID = c.DID AND c.DID IN (SELECT DID FROM CoursesToMajors WHERE majorName = '" + chosenMajor + "') ";
	    testQuery += "AND c.courseNumber IN (SELECT courseNumber FROM CoursesToMajors WHERE majorName = '" + chosenMajor + "') ";
	    testQuery += "AND (";
	    courseDept = userCourses[course][0];
	    courseNumber = userCourses[course][1];
	    //console.log(courseDept + " " + courseNumber);
	        testQuery += "(c.DID IN ";
		testQuery += "(SELECT maristDID FROM CourseEquivalencies WHERE externalDID IN "
		testQuery += "(SELECT DID FROM Departments WHERE departmentName='" + courseDept + "' ";
		testQuery += "AND school IN (SELECT SID FROM Schools WHERE schoolName = '"+ externalSchools[0] +"')))";
		testQuery += " AND c.courseNumber IN ";
		testQuery += "(SELECT maristNumber FROM CourseEquivalencies WHERE externalNumber ='" + courseNumber + "'))";
	        /*if(!multipleFlag){
			multipleFlag = true;
		}*/
	   
	    testQuery += ")";
	    //console.log(testQuery);
	    var theQuery = client.query(testQuery);
	    
	    aCourse = "";
	    theQuery.on('row', function (row, result){
		aCourse = userCourses[course][0] + " " + userCourses[course][1] + " = " + row.departmentname + " " + row.coursenumber + "      " + row.coursename + "    " + row.credits;
		//console.log(aCourse);
		theCourses.push(aCourse);
		total += row.credits;
	    });

	    theQuery.on('end', function(result){
		numberOfCourses--;
		if(numberOfCourses === 0){
		majorCreditQuery = client.query("SELECT sum(credits) FROM Courses WHERE DID IN " + 
		"(SELECT DID FROM CoursesToMajors WHERE majorName = '" + chosenMajor + "') " + 
		"AND courseNumber IN (SELECT courseNumber FROM CoursesToMajors WHERE majorName = '" + chosenMajor + "')");
		majorCredits = 0;
		majorCreditQuery.on("row", function(row,result){
			majorCredits = row.sum;
		});
		majorCreditQuery.on("end", function(result){
			if(total === 0){
			isEmpty = true;
			messages.push("Your courses will be applied towards Core credit and/or elective credit!");
		}
		if(total !== 0)
		{
			messages.push("Total credits: " + total);
			percentage = Math.round((total / majorCredits) * 100 * 100) / 100;
			messages.push("Percentage complete: " + percentage + "%");
		}
		if(req.session.user !== null && typeof req.session.user !== 'undefined'){
			saveCoursesThenRender(userCourses,isEmpty,messages,theCourses,chosenMajor,req.session.user,res);
		}
		else{
    			res.render("courseEvaluation", {user:req.session.user,isempty:isEmpty,messages:messages,majors:maristMajors,courses:theCourses,major:chosenMajor});
		}
	    });
	    } 
        });
	  }) (course,theCourses,messages); }
});

function saveCoursesThenRender(userCourses, isEmpty, messages, theCourses, chosenMajor, user, res){
	var numberOfCourses = Object.keys(userCourses).length;
	if(userCourses.length === 0){
		res.render("courseEvaluation", {user:user,courses:theCourses,major:chosenMajor});
	}
	did = 0;
	uid = 0;
	hasChecked = false;
	for(course in userCourses){
		
		(function(course,did,uid,hasChecked) { getDataQuery = client.query("SELECT DID FROM Departments WHERE departmentName = '" + userCourses[course][0] + "' AND school = 2");
		getDataQuery.on("row", function(row, result){
			did = row.did;
		});
		getDataQuery.on("end", function(result){
			getUserQuery = client.query("SELECT PID FROM People WHERE emailAddress = '" + user + "'");
			getUserQuery.on("row", function(row, result){
				uid = row.pid;
			});
			getUserQuery.on("end", function(result){
                                checkQuery = "SELECT * FROM UsersToCourses WHERE PID = " + uid + " AND DID = " + did + " AND school = " + 2 + " AND courseNumber = '" + userCourses[course][1] + "'";
				if(true){
					kept = false;
					getUsersCourses = client.query("SELECT * FROM UsersToCourses WHERE PID = " + uid + "");
					getUsersCourses.on("row", function(row,result){
						if(did === row.did && row.coursenumber === userCourses[course][1]){
							kept = true;	
						} 
						//console.log(did + " " + row.did + "/" + userCourses[course][1] + " " + row.coursenumber);
						//console.log(kept + "");
					});
					getUsersCourses.on("end", function(result){
						if(!kept){
						        client.query("DELETE FROM UsersToCourses WHERE PID = $1 AND DID = $2 AND courseNumber = $3 AND school = 2", [uid,did,courseNumber], 
							function(err,result){
								if(err) {console.log(err)}
							});
						}
					});
					hasChecked = true;
				}
				client.query("INSERT INTO UsersToCourses SELECT $1, $2, $3, $4 WHERE NOT EXISTS ("+ checkQuery  +")", [2,did,userCourses[course][1],uid],
				function(err,result){
					//console.log(did);
					numberOfCourses--; 
					if(err) 
						{console.log(err)}
					if(numberOfCourses === 0){
						res.render("courseEvaluation", {user:user,isempty:isEmpty,messages:messages,majors:maristMajors,courses:theCourses,major:chosenMajor});
					}});
			});
		}); })(course,did,uid,hasChecked);
	}
}

//Wireframe #10
//Form allowing a user to request a course not found in our database.
app.get(rootAppDirectory + '/requestCourse', function (req, res) {
  res.render("requestCourse", {schools:externalSchools,user:req.session.user});
});

//Wireframe #13
//Shows message indicating that the course was requested and an email will be sent when a decision has been reached.
app.post(rootAppDirectory + '/requestCourseConfirmation', function (req, res) {
  res.render("requestCourseConfirmation", {user:req.session.user});
});

//Course Management
app.get(rootAppDirectory + '/addCourse', function(req,res) {
  if (req.session.clearance > 1){
    var schools = [];
    var schoolQueryString = "SELECT DISTINCT sid, schoolName FROM Schools ORDER BY schoolName;";
    var query = client.query(schoolQueryString);
    query.on("row", function(row,result){
      schools.push(row);
    });
    query.on("end",function(row,result){
      res.render("addCourse",{user:req.session.user, schools:schools});
    });
  }else {
    res.redirect("accessDenied");
}});

app.post(rootAppDirectory + '/addCourseAction', function(req,res) {
  if (req.session.clearance >= 1){
    var courseNumber = req.body.courseNumber;this
    var credits =  req.body.credits;
    var description = req.body.description;
    client.query('INSERT INTO courses (coursenumber,credits,description) VALUES ($1, $2, $3);',
                 [courseNumber,credits,description],
                 function(err,result) {
                   if(err){
                     console.log(err);
                  }});  
    res.redirect("main"); 
  }else{
    res.redirect("accessDenied");
}});

app.get(rootAppDirectory + '/viewCourse', function(req,res) {
  if (req.session.clearance >= 1){
    var courses = [];
    var courseQueryString = "SELECT DISTINCT schools.schoolname, departments.departmentName, courses.courseNumber, courses.courseNumber, courses.description, courses.courseName, courses.credits, courses.isActive FROM courses, schools, departments WHERE courses.DID = departments.DID AND courses.school = schools.SID ORDER BY schools.schoolname,departments.departmentName;";
    var query = client.query(courseQueryString);
    query.on("row", function(row,result){
      courses.push(row);
    });
    query.on("end", function(row,result){ 
      res.render("viewCourse", {user:req.session.user,courses:courses});
    });
  } else {
    res.redirect("accessDenied");
}});

app.get(rootAppDirectory + '/editCourse', function(req,res) {
  if (req.session.clearance >= 1){
    var courses = [];
    var courseQueryString = "SELECT DISTINCT schools.schoolname,schools.sid, departments.departmentName, departments.did, courses.courseNumber, courses.courseNumber, courses.description, courses.courseName, courses.credits, courses.isActive FROM courses, schools, departments WHERE courses.DID = departments.DID AND courses.school = schools.SID ORDER BY schools.schoolname,departments.departmentName;";
    var query = client.query(courseQueryString);
    query.on("row", function(row,result){
      courses.push(row);
    });
    query.on("end", function(row,result){ 
      res.render("editCourse", {user:req.session.user,courses:courses});
    });
  } else {
    res.redirect("accessDenied");

}});

app.post(rootAppDirectory + '/editSelectedCourse', function(req,res) { 
  if (req.session.clearance >= 1){
    var cid =  req.body.cid;
    var split =  cid.split("|");
    var courseData;
    var departments = [];
    var courseEditString = " SELECT DISTINCT  schools.schoolname, departments.departmentName, courses.courseNumber,courses.did, courses.description, courses.courseName, courses.credits, courses.isActive FROM courses, schools, departments WHERE courses.school = " + split[0] + "  AND courses.did = " + split[1] + " AND courses.courseNumber = " + split[2] + " LIMIT 1;";
    var query = client.query(courseEditString);
    query.on("row",function(row,result){
      courseData = row;
    });
    query.on("end",function(row,result){
       var departmentQueryString = "SELECT DISTINCT did, departmentName FROM Departments WHERE school = " + split[0] + " ORDER BY departmentName;";
       var departmentsQuery = client.query(departmentQueryString);
       departmentsQuery.on("row",function(row,result){
         departments.push(row);  
       });
       departmentsQuery.on("end",function(row,result){
         console.log(split);
         res.render("editSelectedCourse", {user:req.session.user,courseData:courseData,departments:departments,cid:cid});
       });    
    });
  } else {
    res.redirect("accessDenied");
}});

app.post(rootAppDirectory + '/editCourseAction', function(req,res) {
  if (req.session.clearance >= 1){
    var cid = req.body.cid;
    var split = cid.split("|");
    var courseNumber = req.body.courseNumber;
    var department = req.body.department;
    var description = req.body.description;
    var courseName = req.body.courseName;
    var credits = req.body.credits;
    var isActive = req.body.isActive;
    console.log(cid);
    var updateString = "UPDATE Courses SET courseNumber='" + courseNumber  +"',did=" + department +  ",description='" + description + "',courseName='" + courseName + "',credits='" + credits  + "',isActive=" + isActive + " WHERE school=" + split[0] + " AND did=" + split[1] + " AND courseNumber = " + split[2] + ";";
    console.log(updateString);
    client.query(updateString,
                function(err,result) {
                  if(err) {
                    console.log(err);
                  }
                }); 
   res.redirect("main");  

  }else{
    res.redirect("accessDenied");
}});

app.get(rootAppDirectory + '/deleteCourse', function(req,res) {
  if (req.session.clearance >= 1){
    var courses = [];
    var courseQueryString = "SELECT DISTINCT schools.schoolname, schools.sid, departments.departmentName,departments.did, courses.courseNumber, courses.courseNumber, courses.description, courses.courseName, courses.credits, courses.isActive FROM courses, schools, departments WHERE courses.DID = departments.DID AND courses.school = schools.SID ORDER BY schools.schoolname,departments.departmentName;";
    var query = client.query(courseQueryString);
    query.on("row", function(row,result){
      courses.push(row);
    });
    query.on("end", function(row,result){ 
      res.render("deleteCourse", {user:req.session.user,courses:courses});
    });
  } else {
    res.redirect("accessDenied");
}});

app.post(rootAppDirectory + '/deleteCourseAction', function(req,res) {
  if (req.session.clearance >= 1){
    var cids =  req.body.cid;
    if (typeof cids == 'string')
      cids = [cids];
    for (i = 0; i < cids.length; i++){    
      var split =  cids[i].split("|");
      var courseDeleteString = " DELETE FROM Courses WHERE school = " + split[0] + "  AND did = " + split[1] + " AND courseNumber = " + split[2] + ";";
      client.query(courseDeleteString);
    };
    res.redirect("main");
  }else{
    res.redirect("accessDenied");
}});

//User Management
app.get(rootAppDirectory + '/addUser', function(req,res) {
   if (req.session.clearance >= 2){
    res.render("addUser",{user:req.session.user});
  }else {
    res.redirect("accessDenied");
}});

app.post(rootAppDirectory + '/addUserAction', function(req,res) {
   if (req.session.clearance >= 2){
    var emailAddress = req.body.emailAddress;
    var hashedPass = req.body.password;
    var doubleHashPass = crypto.createHash('sha256').update(hashedPass).digest("hex");
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var gender = req.body.gender;
    var race = req.body.race;
    var office = req.body.office;
    var clearance = req.body.clearance;
    client.query('INSERT INTO people (emailAddress, password, firstName, lastName, gender, race) VALUES ($1, $2, $3, $4, $5, $6) RETURNING pid;', [emailAddress, doubleHashPass, firstName, lastName, gender, race],
    function(err,result){
      if(err){
        console.log(err);
    } else{
    var newID = result.rows[0].pid;
    client.query('INSERT INTO employees (eid, office, clearance) VALUES ($1, $2, $3);', [newID, office, clearance]);
}}); 
    res.redirect("main");
}});

app.get(rootAppDirectory + '/viewUser', function(req,res) {
   if (req.session.clearance >= 2){
     var users = [];
     var employees = [];
     var employeeQueryString = "SELECT people.firstName, people.lastName, people.emailAddress, people.gender, people.race, employees.office, employees.clearance FROM people, employees WHERE people.pid = employees.eid ORDER BY people.lastName;"
     var userQueryString = "SELECT DISTINCT people.firstName, people.lastName, people.emailAddress, people.state, people.gender, people.age, people.race FROM people, employees WHERE pid NOT IN (SELECT people.pid FROM people,employees WHERE people.pid = employees.eid) ORDER BY people.lastName;"
     var employeeQuery = client.query(employeeQueryString);
     employeeQuery.on("row", function(row, result){
       employees.push(row);
     });
     var userQuery = client.query(userQueryString);
     userQuery.on("row", function(row, result){
       users.push(row);
     });
     employeeQuery.on("end", function(row,result){
       userQuery.on("end", function(row,result){
         res.render("viewUser",{user:req.session.user,users:users,employees:employees});
       });
     });  
 }else{
    res.redirect("accessDenied");
}});

app.get(rootAppDirectory + '/editUser', function(req,res) {
  if (req.session.clearance >= 2){
    var users = [];
    var employees = [];
    var employeeQueryString = "SELECT people.pid, people.firstName, people.lastName, people.emailAddress, people.gender, people.race, employees.office, employees.clearance FROM people, employees WHERE people.pid = employees.eid AND employees.clearance != '3' ORDER BY people.lastName;"
    var userQueryString = "SELECT DISTINCT people.pid, people.firstName, people.lastName, people.emailAddress, people.state, people.gender, people.age, people.race FROM people, employees WHERE pid NOT IN (SELECT people.pid FROM people,employees WHERE people.pid = employees.eid) ORDER BY people.lastName;"
    var employeeQuery = client.query(employeeQueryString);
    employeeQuery.on("row", function(row, result){
      employees.push(row);
    });
    var userQuery = client.query(userQueryString);
    userQuery.on("row", function(row, result){
      users.push(row);
    });
    employeeQuery.on("end", function(row,result){
      userQuery.on("end", function(row,result){
        res.render("editUser",{user:req.session.user,users:users,employees:employees});
      });
    });  
  }else{
    res.redirect("accessDenied");
}});

app.post(rootAppDirectory + '/editSelectedUser', function(req,res) {
if (req.session.clearance >= 2){
    var pid = req.body.pid;
    var userData;
    var userQueryString = "SELECT DISTINCT people.pid, people.firstName, people.lastName, people.emailAddress, people.state, people.gender, people.age, people.race FROM people WHERE pid = " + pid + " LIMIT 1;"
    var userQuery = client.query(userQueryString);
    userQuery.on("row",function(row,result){
      userData = row;
    });
    userQuery.on("end",function(row,result){
      res.render("editSelectedUser",{user:req.session.user,userData:userData});
    });
  }else{
    res.redirect("accessDenied");
}});
 
app.post(rootAppDirectory + '/editUserAction', function(req,res) {
  if (req.session.clearance >= 2){
    var pid = req.body.pid;
    var emailAddress = req.body.emailAddress;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var updateString = "UPDATE people SET emailAddress='" + emailAddress + "', firstName = '" + firstName + "', lastName = '" + lastName + "' WHERE PID=" + pid + ";";
    client.query(updateString,
                function(err,result) {
                  if(err) {
                    console.log(err);
                  }
                }); 
    res.redirect("main");  
  }else{
    res.redirect("accessDenied");
}});

app.get(rootAppDirectory + '/deleteUser', function(req,res) {
  if (req.session.clearance >= 2){
    var users = [];
    var employees = [];
    var employeeQueryString = "SELECT people.pid, people.firstName, people.lastName, people.emailAddress, people.gender, people.race, employees.office, employees.clearance FROM people, employees WHERE people.pid = employees.eid AND employees.clearance != '3' ORDER BY people.lastName;"
    var userQueryString = "SELECT DISTINCT people.pid, people.firstName, people.lastName, people.emailAddress, people.state, people.gender, people.age, people.race FROM people, employees WHERE pid NOT IN (SELECT people.pid FROM people,employees WHERE people.pid = employees.eid) ORDER BY people.lastName;"
    var employeeQuery = client.query(employeeQueryString);
    employeeQuery.on("row", function(row, result){
      employees.push(row);
    });
    var userQuery = client.query(userQueryString);
    userQuery.on("row", function(row, result){
      users.push(row);
    });
    employeeQuery.on("end", function(row,result){
      userQuery.on("end", function(row,result){
        res.render("deleteUser",{user:req.session.user,users:users,employees:employees});
      });
    });  
  }else{
    res.redirect("accessDenied");
}});

app.post(rootAppDirectory + '/deleteUserAction', function(req,res) {
  if (req.session.clearance >= 2){
    var pid = req.body.pid;
    var userDeleteQuery = "DELETE FROM people WHERE pid IN (" + pid + ");";
    client.query(userDeleteQuery); 
    res.redirect("main");
  }else{
    res.redirect("accessDenied");
}});

//School Management
app.get(rootAppDirectory + '/addSchool', function(req,res) {
 if (req.session.clearance >= 2){
    res.render("addSchool",{schools:externalSchools, user:req.session.user});
  }else {
    res.redirect("accessDenied")
}});

app.post(rootAppDirectory + '/addSchoolAction', function(req,res) {
  if (req.session.clearance >= 2){
    var schoolName = req.body.schoolName;
    var country = req.body.country;
    var address1 = req.body.address1;
    var address2 = req.body.address2;
    var city  = req.body.city;
    var state = req.body.state;
    var zip = req.body.zip;
    client.query('INSERT INTO schools (schoolName, country, address1, address2, city, state, zip) VALUES ($1, $2, $3, $4, $5, $6, $7);', 
                [schoolName, country, address1, address2, city, state, zip],
                function(err,result) {
                  if(err) {
                    console.log(err);
                  }else{
                    externalSchools = updateSchools();
                  }
                });
    res.redirect("main");  
  }else{
    res.redirect("accessDenied");
}});

app.get(rootAppDirectory + '/viewSchool', function(req,res) {
  if (req.session.clearance >= 2){
    schools = [];
    var schoolQueryString = "SELECT DISTINCT sid, schoolName, country, address1, address2,city, state, zip FROM Schools ORDER BY schoolName;";
    var query = client.query(schoolQueryString);
    query.on("row", function(row, result){
      schools.push(row);
    });
    query.on("end", function(row,result){
      res.render("viewSchool", {user:req.session.user,schools:schools});
    });
  } else {
    res.redirect("accessDenied");
}});

 app.get(rootAppDirectory + '/editSchool', function(req,res) {
  if (req.session.clearance >= 2){
    schools = [];
    var schoolQueryString = "SELECT DISTINCT sid, schoolName, country, address1, address2,city, state, zip FROM Schools ORDER BY schoolName;";
    var query = client.query(schoolQueryString);
    query.on("row", function(row, result){
      schools.push(row);
    });
    query.on("end", function(row,result){
      res.render("editSchool", {user:req.session.user,schools:schools});
    });
  } else {
    res.redirect("accessDenied");

}});   

app.post(rootAppDirectory + '/editSelectedSchool', function(req,res) {
  if (req.session.clearance >= 2){
    var sid = req.body.sid;
    var schoolData;
    var schoolQueryString = "SELECT * FROM Schools where sid = " + sid + "LIMIT 1;";
    var query = client.query(schoolQueryString);
    query.on("row", function(row, result){
      schoolData = row;
    });
    query.on("end", function(row, result){
      res.render("editSelectedSchool", {user:req.session.user,schoolData:schoolData});
    });
  }else{
    res.redirect("accessDenied");
}});

app.post(rootAppDirectory + '/editSchoolAction', function(req,res) {
  if (req.session.clearance >= 2){
    var sid = req.body.sid;
    var schoolName = req.body.schoolName;
    var country = req.body.country;
    var address1 = req.body.address1;
    var address2 = req.body.address2;
    var city = req.body.city;
    var state = req.body.state;
    var zip = req.body.zip;
    var updateString = "UPDATE Schools SET schoolName='" + schoolName + "',country='" + country + "',address1='" + address1 + "',address2='" + address2  + "',city='"+ city + "',state='" + state + "', zip=" + zip + "  WHERE SID=" + sid + ";";
    console.log(updateString);
    client.query(updateString,
                function(err,result) {
                  if(err) {
                    console.log(err);
                  }
                }); 
   res.redirect("main");  
  }else{
    res.redirect("accessDenied");
}});

app.get(rootAppDirectory + '/deleteSchool', function(req,res) {
  if (req.session.clearance >= 2){
    schools = [];
    var schoolQueryString = "SELECT DISTINCT sid, schoolName, country, address1, address2,city, state, zip FROM Schools ORDER BY schoolName;";
    var query = client.query(schoolQueryString);
    query.on("row", function(row, result){
      schools.push(row);
    });
    query.on("end", function(row,result){
      res.render("deleteSchool", {user:req.session.user,schools:schools});
    });
  } else {
    res.redirect("accessDenied");
}});

app.post(rootAppDirectory + '/deleteSchoolAction', function(req,res) {
   if (req.session.clearance >= 2){
    var sid = req.body.sid;
    var userDeleteQuery = "DELETE FROM schools WHERE sid IN (" + sid + ");";
    client.query(userDeleteQuery); 
    res.redirect("main");
  }else{
    res.redirect("accessDenied"); 
}});

//Department management
app.get(rootAppDirectory + '/addDepartment', function(req,res) {
 if (req.session.clearance >= 1){
    var queryString = "SELECT DISTINCT sid,schoolname FROM Schools ORDER BY schoolname;";
    var query =  client.query(queryString);
    var schools = [];
    query.on("row",function (row,result) {
      schools.push(row);
    });
    query.on("end",function (row,result) {
      res.render("addDepartment",{schools:schools, user:req.session.user});
   });
  }else {
    res.redirect("accessDenied")
}});

app.post(rootAppDirectory + '/addDepartmentAction', function(req,res) {
  if (req.session.clearance >= 1){
    var school = req.body.school;
    var departmentName = req.body.departmentName;
    client.query('INSERT INTO departments (departmentName, school) VALUES ($1, $2);', 
                [departmentName,school],
                function(err,result) {
                  if(err) {
                    console.log(err);
                  }
                }); 
    res.redirect("main");  
  }else{
    res.redirect("accessDenied");
}});

app.get(rootAppDirectory + '/viewDepartment', function(req,res) {
  if (req.session.clearance >= 1){
    var departments = [];
    var departmentQueryString = "SELECT departments.departmentName, schools.schoolName FROM schools, departments WHERE departments.school = schools.sid ORDER BY schools.schoolname, departments.departmentname;";
    var query = client.query(departmentQueryString);
    query.on("row",function (row,result) {
      departments.push(row);
    });
    query.on("end",function (row,result) {
      res.render("viewDepartment", {user:req.session.user,departments:departments});
    });
  } else {
    res.redirect("accessDenied");
}});

app.get(rootAppDirectory + '/editDepartment', function(req,res) {
  if (req.session.clearance >= 1){
    var departments = [];
    var departmentQueryString = "SELECT departments.did, departments.departmentName, schools.schoolName FROM schools, departments WHERE departments.school = schools.sid ORDER BY schools.schoolname, departments.departmentname;";
    var query = client.query(departmentQueryString);
    query.on("row",function (row,result) {
      departments.push(row);
    });
    query.on("end",function (row,result) {
      res.render("editDepartment", {user:req.session.user,departments:departments});
    });
  } else {
    res.redirect("accessDenied");

}});

app.post(rootAppDirectory + '/editSelectedDepartment', function(req,res) {
  if (req.session.clearance >= 1){
    var did = req.body.did; 
    var departmentData;
    var departmentQueryString = "SELECT departments.did, departments.departmentName, schools.schoolName FROM schools, departments WHERE departments.did = " + did  + " AND schools.sid = departments.school LIMIT 1;";
    var query = client.query(departmentQueryString);
    query.on("row",function (row,result) {
      departmentData = row;
    });
    query.on("end",function (row,result) {
      res.render("editSelectedDepartment", {user:req.session.user,departmentData:departmentData});
      });
  } else {
    res.redirect("accessDenied");
}});

app.post(rootAppDirectory + '/editDepartmentAction', function(req,res) {
  if (req.session.clearance >= 1){
    var departmentName = req.body.departmentName;
    var departmentID = req.body.did;
    var updateString = "UPDATE departments SET departmentName='" + departmentName + "' WHERE DID=" + departmentID + ";";
    client.query(updateString,
                function(err,result) {
                  if(err) {
                    console.log(err);
                  }
                }); 
    res.redirect("main");  
  }else{
    res.redirect("accessDenied");
}});

app.get(rootAppDirectory + '/deleteDepartment', function(req,res) {
  if (req.session.clearance >= 1){
    var departments = [];
    var departmentQueryString = "SELECT departments.did, departments.departmentName, schools.schoolName FROM schools, departments WHERE departments.school = schools.sid ORDER BY schools.schoolname, departments.departmentname;";
    var query = client.query(departmentQueryString);
    query.on("row",function (row,result) {
      departments.push(row);
    });
    query.on("end",function (row,result) {
      res.render("deleteDepartment", {user:req.session.user,departments:departments});
    });
  } else {
    res.redirect("accessDenied");
}});

app.post(rootAppDirectory + '/deleteDepartmentAction', function(req,res) {
  if (req.session.clearance >= 1){
    res.redirect("main");
  }else{
    res.redirect("accessDenied");
}});

app.get(rootAppDirectory + '/accessDenied', function (req, res) {
  res.render("accessDenied", {user:req.session.user});
});


//Equivalency Section
app.get(rootAppDirectory + '/addEquivalency', function(req,res) {
  if (req.session.clearance >= 1){
    res.redirect("main");
  }else{
    res.redirect("accessDenied");
}});

app.post(rootAppDirectory + 'addEquivalencyAction', function(req,res){
  if (req.session.clearance >= 1){
    res.redirect("main");
  }else{
    res.redirect("accessDenied");
}});

app.get(rootAppDirectory + 'viewEquivalency', function(req,res){
  if (req.session.clearance >= 1){
    res.redirect("main");
  }else{
    res.redirect("accessDenied");
}});

app.get(rootAppDirectory + 'editEquivalency', function(req,res){
  if (req.session.clearance >= 1){
    res.redirect("main");
  }else{
    res.redirect("accessDenied");
}});

app.post(rootAppDirectory + 'editSelectedEquivalency', function(req,res){
  if (req.session.clearance >= 1){
    res.redirect("main");
  }else{
    res.redirect("accessDenied");
}});

app.post(rootAppDirectory + 'editEquivalencyAction', function(req,res){
  if (req.session.clearance >= 1){
    res.redirect("main");
  }else{
    res.redirect("accessDenied");
}});

app.get(rootAppDirectory + 'deleteEquivalency', function(req,res){
  if (req.session.clearance >= 1){
    res.redirect("main");
  }else{
    res.redirect("accessDenied");
}});

app.post(rootAppDirectory + 'deleteEquivalencyAction', function(req,res){
  if (req.session.clearance >= 1){
    res.redirect("main");
  }else{
    res.redirect("accessDenied");
}});

app.get(rootAppDirectory + '/logout', function (req, res) {
  req.session.user = null;
  req.session.clearance = 0;
  app.locals.user = null;
  res.render("logout", {});
});

app.use(function(req, res, next) {
    res.render("404", {user:req.session.user});
});

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Credit Transfer app listening at http://%s:%s', host, port);
});
