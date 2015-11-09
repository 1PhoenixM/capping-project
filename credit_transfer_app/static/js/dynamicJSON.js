function getCourseNumbers(){
	selectedDept = $('#departments').find(":selected").text();
	$.getJSON( "/api/courseNumbers/" + selectedDept, function( data ) {
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
	  }
	  
	  else{
		$('#courseSelector').html(coursesDropdown.join( "" ));
	  }
	  
	});
}