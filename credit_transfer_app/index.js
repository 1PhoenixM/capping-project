var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var pg = require("pg");
var rootDirectory = '/admission/transfer/credits';
var rootAppDirectory = '/admission/transfer/credits/app';
var conString = "pg://postgres:Candi7@localhost:5432/credit_transfer";
var client = new pg.Client(conString);
app.use('/static', express.static(__dirname + '/static'));
app.use(rootAppDirectory+'/static', express.static(__dirname + '/static'));
app.set('views',path.join(__dirname, './views'));
app.set('view engine', 'jade');

function wrapPage(pageBody){
	pageTop = fs.readFileSync(path.join(__dirname, './html/wrapper') + '/top.html', 'utf-8');	
	pageBottom = fs.readFileSync(path.join(__dirname, './html/wrapper') + '/bottom.html', 'utf-8');	
	return page = pageTop + pageBody + pageBottom;
}

//Redirect to the initial page.
app.get('/', function (req, res) {
  pageBody = wrapPage(fs.readFileSync(path.join(__dirname, './html') + '/credits.html', 'utf-8'));	
  res.send(pageBody);
});

//Wireframe #1
//At current Marist /admission/transfer/credits page, contains a link to the app.
app.get(rootDirectory, function (req, res) {
  pageBody = wrapPage(fs.readFileSync(path.join(__dirname, './html') + '/credits.html', 'utf-8'));	
  res.send(pageBody);
});

//Wireframe #2
//The initial start page that greets the user to either log in or choose a school.
app.get(rootAppDirectory + '/start', function (req, res) {
 // pageBody = wrapPage(fs.readFileSync(path.join(__dirname, './html') + '/start.html', 'utf-8'));

client.connect();
var query = client.query("SELECT schoolName From Schools;");
var test = [];
query.on("row", function (row, result) {
        result.addRow(row);
	test[0] = (result.rows[0].schoolname);
        console.log(test);
	res.render("start", {test:test});

//	for (school in result){
//	console.log(school.schoolName);
	
});
query.on("end", function (result) {
//    console.log( JSON.stringify(result.rows, null, "    "));
 
   client.end();
});

// res.send(pageBody);
 });

//Wireframe #9
//The user account creation form. Can pass in query parameters here via the req variable, to handle form errors.
//Redirect user here if account creation fails.
app.get(rootAppDirectory + '/createAccount', function (req, res) {
  pageBody = wrapPage(fs.readFileSync(path.join(__dirname, './html') + '/createAccount.html', 'utf-8'));	
  res.send(pageBody);
});

//(no wireframe)
//Shows message indicating user account was successfully created and contains link to /main
app.get(rootAppDirectory + '/createAccountSuccess', function (req, res) {
  pageBody = wrapPage(fs.readFileSync(path.join(__dirname, './html') + '/createAccountSuccess.html', 'utf-8'));	
  res.send(pageBody);
});

//Wireframe #3
//The user account login page, not usable by employees.
app.get(rootAppDirectory + '/login', function (req, res) {
  pageBody = wrapPage(fs.readFileSync(path.join(__dirname, './html') + '/login.html', 'utf-8'));	
  res.send(pageBody);
});

//Wireframe #4
//The "forgot password" page allowing an email to be sent to the user.
app.get(rootAppDirectory + '/forgotPassword', function (req, res) {
  pageBody = wrapPage(fs.readFileSync(path.join(__dirname, './html') + '/forgotPassword.html', 'utf-8'));	
  res.send(pageBody);
});

//Wireframe #5
//Shows message indicating that a password recovery email was successfully sent.
app.get(rootAppDirectory + '/forgotPasswordEmailSent', function (req, res) {
  pageBody = wrapPage(fs.readFileSync(path.join(__dirname, './html') + '/forgotPasswordEmailSent.html', 'utf-8'));	
  res.send(pageBody);
});

//Wireframe #6
//The main menu for registered users.
app.get(rootAppDirectory + '/main', function (req, res) {
  pageBody = wrapPage(fs.readFileSync(path.join(__dirname, './html') + '/main.html', 'utf-8'));	
  res.send(pageBody);
});

//Wireframe #7
//Page allowing user to change their password.
app.get(rootAppDirectory + '/changePassword', function (req, res) {
  pageBody = wrapPage(fs.readFileSync(path.join(__dirname, './html') + '/changePassword.html', 'utf-8'));	
  res.send(pageBody);
});

//Wireframe #8
//Shows message indicating that password was successfully changed.
app.get(rootAppDirectory + '/changePasswordSuccess', function (req, res) {
  pageBody = wrapPage(fs.readFileSync(path.join(__dirname, './html') + '/changePasswordSuccess.html', 'utf-8'));	
  res.send(pageBody);
});

//Wireframe #11
//Allows user to select courses and update their existing course list.
app.get(rootAppDirectory + '/courseSelection', function (req, res) {
  pageBody = wrapPage(fs.readFileSync(path.join(__dirname, './html') + '/courseSelection.html', 'utf-8'));	
  res.send(pageBody);
});

//Wireframe #12
//If user entered only a major and no courses, shows the required Marist courses for that major.
//If user entered only courses and selected no major, shows their personal percentage completion for all Marist majors in order, based on courses entered.
//If user entered both courses and selected a major, shows a credit evaluation for that particular major with those courses.
app.get(rootAppDirectory + '/courseEvaluation', function (req, res) {
  pageBody = wrapPage(fs.readFileSync(path.join(__dirname, './html') + '/courseEvaluation.html', 'utf-8'));	
  res.send(pageBody);
});

//Wireframe #10
//Form allowing a user to request a course not found in our database.
app.get(rootAppDirectory + '/requestCourse', function (req, res) {
  pageBody = wrapPage(fs.readFileSync(path.join(__dirname, './html') + '/requestCourse.html', 'utf-8'));	
  res.send(pageBody);
});

//Wireframe #13
//Shows message indicating that the course was requested and an email will be sent when a decision has been reached.
app.get(rootAppDirectory + '/requestCourseConfirmation', function (req, res) {
  pageBody = wrapPage(fs.readFileSync(path.join(__dirname, './html') + '/requestCourseConfirmation.html', 'utf-8'));	
  res.send(pageBody);
});

//To be added: Administrator action pages for Admissions/Registrar to alter the database.

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Credit Transfer app listening at http://%s:%s', host, port);
});
