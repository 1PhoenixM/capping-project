var express = require('express');
var session = require('express-session');
var app = express();
var fs = require('fs');
var path = require('path');
var pg = require("pg");
var crypto = require('crypto');
var rootDirectory = '/admission/transfer/credits';
var rootAppDirectory = '/admission/transfer/credits/app';
var conString = "pg://postgres:Candi7@localhost:5432/credit_transfer";
var client = new pg.Client(conString);
client.connect();
app.use(express.static(__dirname + '/static'));
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
  //var addressLine1 = req.body.addressLine1;
  //var addressLine2 = req.body.addressLine2;
  var state = req.body.state;
  var school = req.body.school;

  var schoolQueryString = "SELECT SID from SCHOOLS WHERE schoolname = '" + school + "' LIMIT 1;";
  var query = client.query(schoolQueryString); 
  query.on("row", function(row,result){
    schoolID = row.SID;
  });
  client.query('INSERT INTO people (emailAddress, password, firstname, lastname, state) VALUES ($1, $2, $3, $4, $5);',
    [email,doubleHashPass,firstName,lastName,state],
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
    res.render("forgotPassword", {user:req.session.user});
 } else{
    res.redirect(rootAppDirectory + '/accessDenied'); 
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
	     	var courseQuery = "SELECT d.departmentName,c.courseNumber FROM Departments d,UsersToCourses c WHERE d.DID = c.DID AND c.UID IN (SELECT PID FROM People WHERE emailAddress='"+ req.session.user +"')";
		var courseQueryObj = client.query(courseQuery);
		courseQueryObj.on("row", function (row, result){
			userCourses += row.departmentname + "_" + row.coursenumber + "/";
		 });
		 courseQueryObj.on("end", function (result){
			userCourses = userCourses.substring(0,userCourses.length-1);
			res.render("courseSelection", {initialCourses:initialCourses,depts:departments,school:userSchool,majors:maristMajors,user:req.session.user,userCourses:userCourses});
		 });
         }
     });
   });
});

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
    var userCourses = req.body;
    testQuery = "SELECT d.departmentName,c.courseNumber,c.courseName,c.credits FROM Departments d, Courses c WHERE ";
    testQuery += "d.DID = c.DID AND c.DID IN (SELECT DID FROM CoursesToMajors WHERE majorName = '" + chosenMajor + "') ";
    testQuery += "AND c.courseNumber IN (SELECT courseNumber FROM CoursesToMajors WHERE majorName = '" + chosenMajor + "') ";
    testQuery += "AND ("
    multipleFlag = false;
    for (course in userCourses){
	courseDept = userCourses[course][0];
        courseNumber = userCourses[course][1];
        if(multipleFlag){
		testQuery += " OR ";
	}
        testQuery += "(c.DID IN ";
	testQuery += "(SELECT maristDID FROM CourseEquivalencies WHERE externalDID IN "
	testQuery += "(SELECT DID FROM Departments WHERE departmentName='" + courseDept + "' ";
	testQuery += "AND school IN (SELECT SID FROM Schools WHERE schoolName = '"+ externalSchools[0] +"')))";
	testQuery += " AND c.courseNumber IN ";
	testQuery += "(SELECT maristNumber FROM CourseEquivalencies WHERE externalNumber ='" + courseNumber + "'))";
        if(!multipleFlag){
		multipleFlag = true;
	}
    }
    testQuery += ")";
    //console.log(testQuery);
    var theQuery = client.query(testQuery);
    theCourses = [];
    course = "";
    total = 0;
    theQuery.on('row', function (row, result){
	course = row.departmentname + " " + row.coursenumber + "      " + row.coursename + "    " + row.credits;
	theCourses.push(course);
	total += row.credits;
    });
    theQuery.on('end', function(result){
	majorCreditQuery = client.query("SELECT sum(credits) FROM Courses WHERE DID IN " + 
	"(SELECT DID FROM CoursesToMajors WHERE majorName = '" + chosenMajor + "') " + 
	"AND courseNumber IN (SELECT courseNumber FROM CoursesToMajors WHERE majorName = '" + chosenMajor + "')");
	majorCredits = 0;
	majorCreditQuery.on("row", function(row,result){
		majorCredits = row.sum;
	});
	majorCreditQuery.on("end", function(result){
		if(total === 0){
			theCourses.push("Your courses will be applied towards Core credit and/or elective credit!");
		}
		if(total !== 0)
		{
			theCourses.push("Total credits: " + total);
			percentage = Math.round((total / majorCredits) * 100 * 100) / 100;
			theCourses.push("Percentage complete: " + percentage + "%");
		}
		if(req.session.user !== null && typeof req.session.user !== 'undefined'){
			saveCoursesThenRender(userCourses,theCourses,chosenMajor,req.session.user,res);
		}
		else{
    			res.render("courseEvaluation", {user:req.session.user,courses:theCourses,major:chosenMajor});
		}
	});
    });
});

function saveCoursesThenRender(userCourses, theCourses, chosenMajor, user, res){
	var numberOfCourses = Object.keys(userCourses).length;
	if(userCourses.length === 0){
		res.render("courseEvaluation", {user:user,courses:theCourses,major:chosenMajor});
	}
	did = 0;
	uid = 0;
	for(course in userCourses){
		
		(function(course,did,uid) { getDataQuery = client.query("SELECT DID FROM Departments WHERE departmentName = '" + userCourses[course][0] + "' AND school = 2");
		getDataQuery.on("row", function(row, result){
			did = row.did;
		});
		getDataQuery.on("end", function(result){
			getUserQuery = client.query("SELECT UID FROM Users WHERE UID IN (SELECT PID FROM People WHERE emailAddress = '" + user + "')");
			getUserQuery.on("row", function(row, result){
				uid = row.uid;
			});
			getUserQuery.on("end", function(result){
				client.query("INSERT INTO UsersToCourses VALUES ($1, $2, $3, $4)", [uid,2,did,userCourses[course][1]],
				function(err,result){
					numberOfCourses--; 
					if(err) 
						{console.log(err)}
					if(numberOfCourses === 0){
						res.render("courseEvaluation", {user:user,courses:theCourses,major:chosenMajor});
					}});
			});
		}); })(course,did,uid);
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
    res.render("addCourse",{user:req.session.user, schools:externalSchools});
  }else {
    res.redirect("accessDenied");
}});

app.post(rootAppDirectory + '/addCourseAction', function(req,res) {
  if (req.session.clearance > 1){
    var courseNumber = req.body.courseNumber;
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
  if (req.session.clearance > 1){
    res.render("viewCourse", {user:req.session.user});
  } else {
    res.redirect("accessDenied");
}});

app.get(rootAppDirectory + '/editCourse', function(req,res) {
  if (req.session.clearance > 2){
    res.render("editCourse",{user:req.session.user});
  }else {
    res.redirect("accessDenied");
}});

app.get(rootAppDirectory + '/deleteCourse', function(req,res) {
  if (req.session.clearance > 2){
    res.render("deleteCourse",{user:req.session.user});
  }else {
    res.redirect("accessDenied");
}});

//User Management
app.get(rootAppDirectory + '/addUser', function(req,res) {
   if (req.session.clearance > 2){
    res.render("addUser",{user:req.session.user});
  }else {
    res.redirect("accessDenied");
}});

app.post(rootAppDirectory + '/addUserAction', function(req,res) {
   if (req.session.clearance > 2){
    var emailAddress = req.body.emailAddress;
    var hashedPass = req.body.password;
    var doubleHashPass = crypto.createHash('sha256').update(hashedPass).digest("hex");
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var clearance = req.body.clearance;
    var office = req.body.office;
    client.query('INSERT INTO people (emailAddress, password, firstname, lastname) VALUES ($1, $2, $3, $4) RETURNING pid;', [emailAddress, doubleHashPass, firstName, lastName],
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
   if (req.session.clearance > 2){
    res.render("viewUser",{user:req.session.user});
    client.query('SELECT * from people;'); 
  }else {
    res.redirect("accessDenied");
}});

app.get(rootAppDirectory + '/editUser', function(req,res) {
  if (req.session.clearance > 2){
    res.render("editUser",{user:req.session.user});
  }else {
    res.redirect("accessDenied");
}});

app.get(rootAppDirectory + '/deleteUser', function(req,res) {
  if (req.session.clearance > 2){
    res.render("deleteUser",{user:req.session.user});
  }else {
    res.redirect("accessDenied");
}});

//School Management
app.get(rootAppDirectory + '/addSchool', function(req,res) {
 if (req.session.clearance > 2){
    res.render("addSchool",{schools:externalSchools, user:req.session.user});
  }else {
    res.redirect("accessDenied")
}});

app.post(rootAppDirectory + '/addSchoolAction', function(req,res) {
  if (req.session.clearance > 2){
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
  if (req.session.clearance > 2){
    res.render("viewSchool", {user:req.session.user});
  } else {
    res.redirect("accessDenied");
}});

 app.get(rootAppDirectory + '/editSchool', function(req,res) {
  if (req.session.clearance > 2){
    res.render("editSchool",{user:req.session.user});
  }else {
    res.redirect("accessDenied");
}});   

app.get(rootAppDirectory + '/deleteSchool', function(req,res) {
  if (req.session.clearance > 2){
    res.render("deleteSchool",{user:req.session.user});
  }else {
    res.redirect("accessDenied");
}});

//Department management
app.get(rootAppDirectory + '/addDepartment', function(req,res) {
 if (req.session.clearance > 1){
    res.render("addDepartment",{schools:externalSchools, user:req.session.user});
  }else {
    res.redirect("accessDenied")
}});

app.post(rootAppDirectory + '/addDepartmentAction', function(req,res) {
  if (req.session.clearance > 1){
    var schoolName = req.body.school;
    var school;
    var departmentName = req.body.departmentName;
    var schoolQueryString = "SELECT SID FROM Schools WHERE schoolname = '" + school + "' LIMIT 1;";
    var query = client.query(schoolQueryString);
    query.on("row", function (row,result) {
        school = row.sid;
    });
    query.on("end",function (result){
      client.query('INSERT INTO departments (departmentName, school) VALUES ($1, $2);', 
                  [departmentName,school],
                  function(err,result) {
                    if(err) {
                      console.log(err);
                    }
                  });
    });
    res.redirect("main");  
  }else{
    res.redirect("accessDenied");
}});

app.get(rootAppDirectory + '/viewDepartment', function(req,res) {
  if (req.session.clearance > 1){
    res.render("viewDepartment", {user:req.session.user});
  } else {
    res.redirect("accessDenied");
}});

app.get(rootAppDirectory + '/editDepartment', function(req,res) {
  if (req.session.clearance > 1){
    res.render("editDepartment",{user:req.session.user});
  }else {
    res.redirect("accessDenied");
}});

app.get(rootAppDirectory + '/deleteDepartment', function(req,res) {
  if (req.session.clearance > 1){
    res.render("deleteDepartment",{user:req.session.user});
  }else {
    res.redirect("accessDenied");
}});

app.get(rootAppDirectory + '/accessDenied', function (req, res) {
  res.render("accessDenied", {user:req.session.user});
});

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
