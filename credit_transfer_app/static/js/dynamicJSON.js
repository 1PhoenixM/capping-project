//Given a school and a department, gets all its course numbers and renders a dropdown
//Accepts a school name as a string
function getCourseNumbers(school,forLine,alreadyHaveTheCourse,courseNumber){
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
	  if($('#courseSelector' + forLine).length === 0){
  
		  //Create the course dropdown
		  $( "<select/>", {
			"id": "courseSelector" + forLine,
			"style": "display:inline",
			"name": "course" + forLine,
			html: coursesDropdown.join( "" )
		  }).insertAfter( "#dept"+forLine );

		  $('#courseSelector'+forLine).bind("change", function(){
			getCourseTitle(school,forLine);
		  });

	  }
	  
	  //If course selector already exists, i.e. user just chose a new department,
	  else{
		//Update existing course dropdown with new values.
		$('#courseSelector' + forLine).html(coursesDropdown.join( "" ));
	  }

	  //Get title as well
	  //if($('#coursetitle'+forLine).length === 0){
	 	 getCourseTitle(school,forLine);
	  //}
	  
	  //this may be running
	  if(alreadyHaveTheCourse === true){
		optionCounter2 = 0;
		$('#courseSelector'+forLine+' option').each(function()
		{       //get this to supply the real course then continue to the rest of the rows
			//console.log($(this).val() + "  " + courseNumber);
			if($(this).val() === courseNumber){
				$('#courseSelector'+forLine+' option:eq(' + optionCounter2 + ')').prop('selected', true);
				getCourseTitle(school,forLine);
				return;
			}
			optionCounter2++;
		});

	  }
	  
	});
}

//Gets a departments dropdown for a school
function getDepartments(school){

	$.getJSON("/api/departments/" + school, function (data) {
		var depts  =[];
		depts = data.departments;
		var deptDropdown = [];

		for (var i = 0; i < depts.length; i++){
			deptDropdown.push('<option>' + depts[i] + '</option>');
		}

		$( "<select/>", {
			"class": "deptSelector",
			"id": "dept",
			"style": "display:inline",
			"name": "department",
			html: deptDropdown.join( "" )
		  }).appendTo( "body" );


	});
}

//Adds a new course selection line
function addNewLine(school,alreadyHaveTheCourse,courseNumber,courseDept){
	
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

		$("#dept"+count).bind("change", function(){
			getCourseNumbers(school,count,false,'');			
		});

		//Create course number dropdown
		if(alreadyHaveTheCourse === true){
			optionCounter = 0;
			$('#dept'+count+' option').each(function()
			{
				//console.log($(this).val() + "  " + courseDept + " gg");
				if($(this).val() === courseDept){
					$('#dept'+count+' option:eq(' + optionCounter + ')').prop('selected', true);
					return;
				}
				optionCounter++;
			});
			getCourseNumbers(school,count,true,courseNumber);
		}
		else{
	        	getCourseNumbers(school,count,false,'');
		}

		//Remove the old new line button
		//$('#plus').remove();

		//Get the number of current rows
		var count = $('.deptSelector').length-1;

		pastLine = count-1;
		//Remove old new line button
		//$('#plus'+pastLine).remove();

		getCourseTitle(school,count);

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
			"id": "break"+count
		  }).appendTo( "#selectors" );


	});
}

//Removes the specified line or row
function removeLine(count,school){
	if($('#toBeDeleted').length > 0){
		$('#toBeDeleted').val($('#toBeDeleted').val()+$("#dept"+count).val() + "_");
		$('#toBeDeleted').val($('#toBeDeleted').val()+$("#courseSelector"+count).val() + "/");
		console.log($('#toBeDeleted').val());
	}

	$("#dept"+count).remove();
	$("#courseSelector"+count).remove();
	/*if($(".deptSelector").length >= 2){
		$("#plus"+count).remove();
	}*/
	$("#remove"+count).remove();
	$("#coursetitle"+count).remove();
	$("#break"+count).remove();
}

//Preselect courses if they are already known (as in, the user is logged in)
function preselectCourses(courses,school){
	if(courses === "Test"){

	}
	else{
	userCourses = courses.split("/");
	for(i = 0; i < userCourses.length; i++){
		courseParts = userCourses[i].split("_");
		if(i === 0){
			optionCounter = 0;
                        optionCounter2 = 0;
			$('#dept0 option').each(function()
			{
				if($(this).val() === courseParts[0]){
					$('#dept0 option:eq(' + optionCounter + ')').prop('selected', true);
					return;
				}
				optionCounter++;
			});
			getCourseNumbers(school,0,true,courseParts[1]);
			}
		else{
			addNewLine(school,true,courseParts[1],courseParts[0]);
			//getCourseNumbers(school,i,true,courseParts[1]);
		}
	}
     }
}

//Get or update the course title for a certain row
function getCourseTitle(school,count){
	dept = $('#dept'+count).val();
	courseNumber = $('#courseSelector'+count).val();
	$.getJSON("/api/coursetitles/" + school + "/" + dept + "/" + courseNumber, function (data){
		if($('#coursetitle'+count).length  === 0){
			$("<span>", {
				"id": "coursetitle"+count,
				"style": "display:inline",
				html: data.title
			}).insertAfter('#courseSelector'+count);
		}
		else{
			$('#coursetitle'+count).html(data.title);
		}	
	});
}
