//Given a school and a department, gets all its course numbers and renders a dropdown
//Accepts a school name as a string
function getCourseNumbers(school){
	//First get department chosen by the user.
	selectedDept = $('#departments').find(":selected").text();

	//Make a call to the JSON API providing both department and school
	$.getJSON( "/api/courseNumbers/" + selectedDept + "/" + school, function( data ) {
	  
	  //The data will come over as an array of course numbers
	  var courses = [];
	  courses = data.courseNumbers;

	  //Will hold the options for the dropdown
	  var coursesDropdown = [];
	  
	  //For each course number, convert it to an option
	  for(var i = 0; i < courses.length; i++){
		coursesDropdown.push('<option>' + courses[i] + '</option>');
	  }
	 
	  //If the course selector does not exist...
	  if($('#courseSelector').length == 0){

		  //Create the course dropdown
		  $( "<select/>", {
			"id": "courseSelector",
			"style": "display:inline",
			html: coursesDropdown.join( "" )
		  }).appendTo( "#selectors" );

		  //Create a new line button
		  $( "<button/>", {
			"id": "plus",
			"type": "button",
			"class": "pluses",
			"style": "display:inline",
			html: "+"
		  }).appendTo( "#selectors" );
	
		  //Bind the new line event to the button
		  $("#plus").bind("click", function(){
			addNewLine(school);
		  });
	  }
	  
	  //If course selector already exists, i.e. user just chose a new department,
	  else{
		//Update existing course dropdown with new values.
		$('#courseSelector').html(coursesDropdown.join( "" ));
	  }
	  
	});
}

//Adds a new course selection line
function addNewLine(school){
	
	//Make a call to the JSON API to get a list of departments for the school
	$.getJSON( "/api/departments/" + school, function( data ) {

	  //Make list of departments
	  var depts  = [];
	  depts = data.departments;
	  var deptDropdown = [];

	  //Convert to options
	  for(var i = 0; i < depts.length; i++){
		deptDropdown.push('<option>' + depts[i] + '</option>');
	  }
	
		//Create department dropdown
		$( "<select/>", {
			"class": "deptSelector",
			"style": "display:inline",
			html: deptDropdown.join( "" )
		  }).appendTo( "#selectors" );

		//Create course number dropdown
	        getCourseNumbers(school);

		//Remove the old new line button
		$('#plus').remove();

		//Get the number of current rows
		var count = $('.deptSelector').length;

		//Create a new line button for this row
		$( "<button/>", {
			"value": count + "",
			"id": "plus",
			"type": "button",
			"style": "display:inline",
			html: "+"
		  }).appendTo( "#selectors" );
		
		//Bind the click event
		$("#plus").bind("click", function(){
			addNewLine(school);
		});

		//Add line break for next row
		$( "<br/>", {
		  }).appendTo( "#selectors" );


	});
}
