var userCourses = req.body;
for(course in userCourses){
	 courseDept = course[0];
	 courseNumber = course[1];
	 query += "OR (c.DID = " + courseDept + " AND c.courseNumber ='" + courseNumber + "')";
}
