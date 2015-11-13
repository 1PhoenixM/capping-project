function getCourseNumbers(school){
	selectedDept = $('#departments').find(":selected").text();
	$.getJSON( "/api/courseNumbers/" + selectedDept + "/" + school, function( data ) {
	  var courses = [];
	  courses = data.courseNumbers;
	  var coursesDropdown = [];
	  
	  for(var i = 0; i < courses.length; i++){
		coursesDropdown.push('<option>' + courses[i] + '</option>');
	  }
	 
	  if($('#courseSelector').length == 0){
		  $( "<select/>", {
			"id": "courseSelector",
			"style": "display:inline",
			html: coursesDropdown.join( "" )
		  }).appendTo( "#selectors" );
		  $( "<button/>", {
			"id": "plus",
			"type": "button",
			"class": "pluses",
			"style": "display:inline",
			html: "  +"
		  }).appendTo( "#selectors" );
		  $("#plus").bind("click", function(){
			addNewLine(school);
		  });
	  }
	  
	  else{
		$('#courseSelector').html(coursesDropdown.join( "" ));
	  }
	  
	});
}

//$('#plus').click(
function addNewLine(school){
	$.getJSON( "/api/departments/" + school, function( data ) {
	  var depts  =[];
	  depts = data.departments;
	  var deptDropdown = [];

	  for(var i = 0; i < depts.length; i++){
		deptDropdown.push('<option>' + depts[i] + '</option>');
	  }

		$( "<select/>", {
			"id": "deptSelector",
			"style": "display:inline",
			html: deptDropdown.join( "" )
		  }).appendTo( "#selectors" );

	        getCourseNumbers(school);

		$( "<button/>", {
			"value": "2",
			"class": "pluses",
			"type": "button",
			"style": "display:inline",
			html: "  +"
		  }).appendTo( "#selectors" );

		$( "<br/>", {
		  }).appendTo( "#selectors" );


	});
}
