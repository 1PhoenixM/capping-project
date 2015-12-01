//Given a school and a department, gets all its course numbers and renders a dropdown
//Accepts a school name as a string
function getCourseNumbers(school,forLine){
	//First get department chosen by the user.
	selectedDept = $('#dept' + forLine).val(); //.find(":selected").text();

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
	  if($('#courseSelector' + forLine).length == 0){

		  //Create the course dropdown
		  $( "<select/>", {
			"id": "courseSelector" + forLine,
			"style": "display:inline",
			"name": "course" + forLine,
			html: coursesDropdown.join( "" )
		  }).insertAfter( "#dept"+forLine );

		  
		  //Create a new line button
		  $( "<button/>", {
			"id": "plus"+forLine,
			"type": "button",
			"class": "pluses",
			"style": "display:inline",
			html: "+"
		  }).insertAfter( "#courseSelector"+forLine );
	
		  //Bind the new line event to the button
		  $("#plus"+forLine).bind("click", function(){
			addNewLine(school);
		  });
	  }
	  
	  //If course selector already exists, i.e. user just chose a new department,
	  else{
		//Update existing course dropdown with new values.
		$('#courseSelector' + forLine).html(coursesDropdown.join( "" ));
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
	
		var count = $('.deptSelector').length;

		//Create department dropdown
		$( "<select/>", {
			"class": "deptSelector",
			"id": "dept" + count,
			"style": "display:inline",
			"name": "course" + count,
			html: deptDropdown.join( "" )
		  }).appendTo( "#selectors" );
	
		$(".deptSelector").bind("change", function(){
			getCourseNumbers(school,count);			
		});

		//Create course number dropdown
	        //getCourseNumbers(school,count);

		//Remove the old new line button
		//$('#plus').remove();

		//Get the number of current rows
		var count = $('.deptSelector').length-1;

		pastLine = count-1;
		//Remove old new line button
		$('#plus'+pastLine).remove();

		//Create a remove button for this row
		$( "<button/>", {
			"value": count + "",
			"id": "remove"+count,
			"type": "button",
			"style": "display:inline",
			html: "X"
		}).appendTo( "#selectors" );

		$("#remove"+count).bind("click", function(){
			removeLine(count,school);
		});	

		//Create a new line button for this row
		/*$( "<button/>", {
			"value": count + "",
			"id": "plus"+count,
			"type": "button",
			"style": "display:inline",
			html: "+"
		  }).appendTo( "#selectors" );
		
		//Bind the click event
		$("#plus"+count).bind("click", function(){
			addNewLine(school);
		});*/

		//Add line break for next row
		$( "<br/>", {
		  }).appendTo( "#selectors" );


	});
}

//Removes the specified line or row
function removeLine(count,school){
	$("#dept"+count).remove();
	$("#courseSelector"+count).remove();
	/*if($(".deptSelector").length >= 2){
		$("#plus"+count).remove();
	}*/
	$("#remove"+count).remove();
}
