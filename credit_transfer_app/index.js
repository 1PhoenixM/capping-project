var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var pg = require("pg");
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
	query.on("end", function (result) {
			res.render("startPage", {schools:externalSchools});
		});
});


//Wireframe #9
//The user account creation form. Can pass in query parameters here via the req variable, to handle form errors.
//Redirect user here if account creation fails.
app.get(rootAppDirectory + '/createAccount', function (req, res) {
  res.render("createAccount", {});
});

//(no wireframe)
//Shows message indicating user account was successfully created and contains link to /main
app.get(rootAppDirectory + '/createAccountSuccess', function (req, res) {
  res.render("createAccountSuccess", {});
});

//Wireframe #3
//The user account login page, not usable by employees.
app.get(rootAppDirectory + '/login', function (req, res) {
  res.render("login", {});
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
  var courses = [];
  var subQueryString = "SELECT SID FROM Schools WHERE schoolName = '" + userSchool + "'";
  var queryString = "SELECT courseName FROM Courses WHERE school =(" + subQueryString + ");";
  var query = client.query(queryString);
  query.on("row", function (row, result) {
     courses.push(row.coursename) });
  query.on("end",function ( result){
     console.log(courses);
     res.render("courseSelection", {courses:courses,depts:['CMPT','PHYS']});
});
});

//JSON API to get data after the page has loaded, say a list of course numbers for a department the user selected.
app.get('/api/' + 'courseNumbers', function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.send("{ \"courseNumbers\":  [ \"120L\", \"123L\", \"500L\" ]}");
  res.end();
});

//Wireframe #12
//If user entered only a major and no courses, shows the required Marist courses for that major.
//If user entered only courses and selected no major, shows their personal percentage completion for all Marist majors in order, based on courses entered.
//If user entered both courses and selected a major, shows a credit evaluation for that particular major with those courses.
app.get(rootAppDirectory + '/courseEvaluation', function (req, res) {
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
