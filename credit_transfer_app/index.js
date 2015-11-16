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

//app.use(express.cookieParser());
app.use(session({
  genid: function(req){
    return  crypto.randomBytes(48).toString('hex');
},
  user: '',
  secret: 'sayanouta',
  resave: true,
  saveUninitialized: true,
}));

var query = client.query("SELECT schoolName From Schools WHERE schoolName != 'Marist College';");
var externalSchools = [];
query.on("row", function (row, result) {
    externalSchools.push(row.schoolname);
  });


/*function wrapPage(pageBody){
	pageTop = fs.readFileSync(path.join(__dirname, './html/wrapper') + '/top.html', 'utf-8');	
	pageBottom = fs.readFileSync(path.join(__dirname, './html/wrapper') + '/bottom.html', 'utf-8');	
	return page = pageTop + pageBody + pageBottom;
}*/

//Redirect to the initial page.
app.get('/', function (req, res) {
  /*pageBody = wrapPage(fs.readFileSync(path.join(__dirname, './html') + '/credits.html', 'utf-8'));	
  res.send(pageBody);*/
  res.render("credits", {});
});

//Wireframe #1
//At current Marist /admission/transfer/credits page, contains a link to the app.
app.get(rootDirectory, function (req, res) {
  res.render("credits", {});
});

app.get(rootAppDirectory, function (req, res) {
  res.render("startPage", {test:[]});
});

//Wireframe #2
//The initial start page that greets the user to either log in or choose a school.
app.get(rootAppDirectory + '/start', function (req, res) {
  if (req.session.user != null)
    res.render("startPage", {schools:externalSchools, user:req.session.user});
  else
    res.render("startPage", {schools:externalSchools}); 
});


//Wireframe #9
//The user account creation form. Can pass in query parameters here via the req variable, to handle form errors.
//Redirect user here if account creation fails.
app.get(rootAppDirectory + '/createAccount', function (req, res) {
  res.render("createAccount", {schools:externalSchools});
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
  res.render("login", {});
});

app.post(rootAppDirectory + '/loginAction', function (req, res){
  var email = req.body.emailAddress;
  var hashedPass = req.body.password;
  var doubleHashPass = crypto.createHash('sha256').update(hashedPass).digest("hex");
  var queryString = "SELECT emailaddress FROM people WHERE emailaddress = '" + email + "' AND password = '" + doubleHashPass + "' LIMIT 1;"
  var query = client.query(queryString);
  query.on("row",function(row,result){
   console.log(row);
   req.session.user = row;   
});
  query.on("end", function(row,result){
  if (req.session.user){
  res.render("main", {}); 
  } else{
  res.render("accessDenied", {});
 }
});
});

app.post(rootAppDirectory + '/changePasswordAction', function ( req, res){
  
  var hashedPass = req.body.newPassword;
  var doubleHashPass = crypto.createHash('sha256').update(hashedPass).digest("hex");
  var queryString = "UPDATE people SET password = '" + doubleHashPass + "' WHERE emailAddress ='" + req.session.user + "';";
  var query = client.query(queryString);
  query.on("end", function(row,result){
    res.render("changePasswordSuccess", {});     
  });
});


//Wireframe #4
//The "forgot password" page allowing an email to be sent to the user.
app.get(rootAppDirectory + '/forgotPassword', function (req, res) {
  res.render("forgotPassword", {});
});

//Wireframe #5
//Shows message indicating that a password recovery email was successfully sent.
app.get(rootAppDirectory + '/forgotPasswordEmailSent', function (req, res) {
  res.render("forgotPasswordEmailSent", {});
});

//Wireframe #6
//The main menu for registered users.
app.get(rootAppDirectory + '/main', function (req, res) {
  res.render("main", {});
});

//Wireframe #7
//Page allowing user to change their password.
app.get(rootAppDirectory + '/changePassword', function (req, res) {
  res.render("changePassword", {});
});

//Wireframe #8
//Shows message indicating that password was successfully changed.
app.get(rootAppDirectory + '/changePasswordSuccess', function (req, res) {
  res.render("changePasswordSuccess", {});
});

//Wireframe #11
//Allows user to select courses and update their existing course list.
app.post(rootAppDirectory + '/courseSelection', function (req, res) {
  var userSchool = req.body.schools;
  console.log(userSchool);
  var departments = [];
  var majors = [];
  var subQueryString = "SELECT SID FROM Schools WHERE schoolName = '" + userSchool + "'";
 // var queryString = "SELECT courseName FROM Courses WHERE school =(" + subQueryString + ");";
  var queryString = "SELECT departmentName FROM Departments WHERE school =(" + subQueryString + ");";
  var query = client.query(queryString);
  query.on("row", function (row, result) {
     departments.push(row.departmentname) });
  query.on("end",function ( result){
     res.render("courseSelection", {depts:departments,school:userSchool});
});
});

//JSON API to get data after the page has loaded, say a list of course numbers for a department the user selected.
app.get('/api/' + 'courseNumbers/:dept/:school', function (req, res) {
  var dept = req.params.dept;
  var school = req.params.school;
  var courseNumbers = "";
  var secondsub = "(SELECT SID FROM Schools WHERE schoolName = '" + school + "')";
  var subquery = "(SELECT DID FROM Departments WHERE departmentName = '" + dept + "' AND school = " + secondsub + ")";
  var queryString = "SELECT courseNumber FROM Courses WHERE DID = " + subquery +  ";";
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
  var queryString = "(SELECT departmentName FROM Departments WHERE school = " + secondsub + ")";
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

//Wireframe #12
//If user entered only a major and no courses, shows the required Marist courses for that major.
//If user entered only courses and selected no major, shows their personal percentage completion for all Marist majors in order, based on courses entered.
//If user entered both courses and selected a major, shows a credit evaluation for that particular major with those courses.
app.post(rootAppDirectory + '/courseEvaluation', function (req, res) {
    console.log(req.body);
    //query = 'SELECT c.maristNumber FROM CourseEquivalencies c, CoursesToMajors m WHERE c.maristNumber = m.courseNumber AND';
    //query += ' c.maristDID = m.DID';
    //query += 'AND m.majorName = req.body.major';
    //query += " AND c.externalNumber = '" + req.body.course1[1] + "'";
    //query += " AND c.externalDID = (SELECT DID FROM Departments WHERE departmentName = '" + req.body.dept1 + "'";
    res.render("courseEvaluation", {});
});

//Wireframe #10
//Form allowing a user to request a course not found in our database.
app.get(rootAppDirectory + '/requestCourse', function (req, res) {
  res.render("requestCourse", {schools:externalSchools});
});

//Wireframe #13
//Shows message indicating that the course was requested and an email will be sent when a decision has been reached.
app.post(rootAppDirectory + '/requestCourseConfirmation', function (req, res) {
  res.render("requestCourseConfirmation", {});
});

//To be added: Administrator action pages for Admissions/Registrar to alter the database.

//Route to post the account data to (accessed as an object)
app.post(rootAppDirectory + '/createAccount', function (req, res){
	console.log(req.body);
});

app.use(function(req, res, next) {
    res.render("404", {});
});

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Credit Transfer app listening at http://%s:%s', host, port);
});
