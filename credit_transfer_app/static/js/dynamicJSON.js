function getCourseNumbers(){
	$.getJSON( "/api/courseNumbers", function( data ) {
	  var courses = [];
	  courses = data.courseNumbers;
	  var coursesDropdown = [];
	  
	  for(var i = 0; i < courses.length; i++){
		coursesDropdown.push('<option>' + courses[i] + '</option>');
	  }
	 
	  $( "<select/>", {
		"class": "courseList",
		html: coursesDropdown.join( "" )
	  }).appendTo( "#selectors" );
	});
}