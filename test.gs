/*
 * Test functions.
 * Todo : include unit test modules.
 */


/*
 * dev note
 * 
 ** At the "review year" drop-down list in add_student_review.html, the default value is a string of "null", not a 
 *  literal null value, which could lead to confusion and data management hardship. Consider changing deafult value 
 *  to "n/a", and disallow default value input.
 * 
 ** While getting review at add_student_review.html, the function getReviewInformationForUinAndYear() 
 *  (advisor_review.gs) is called to search and filter from all the reviews. While submitting review by calling
 *  function updateStudentReviewDetails() (advisor_review.gs). The different routes to fetch and submit the review
 *  is the root cause of admin/faculty review overriding bug. Also, the unnecessary repeat of searching process 
 *  is a waste of time. This can be fixed by specifying the data index during the 1st-search and invoke it in 
 *  later submitting.
 *  
 ** At advisor_review.gs, while reading reviews by getReviewInformationForUinAndYear() (advisor_review.gs) and 
 *  editing/adding reviews by updateStudentReviewDetails() (advisor_review.gs), each review is accessed in array 
 *  and parses by index, which makes it inflexible to data format change. Using heapmap could be better. 
 * 
 ** At add_student_review.html/add_student_review_js.html, student_search.html/student_search_js.html and student_details.html
 *  where admins and faculties share the same webpage. The "view-name" tab, as well as some layouts are set to 
 *  faculty view as default, and reload to admin-view if it detects the current user as admin. The problems here are: 
 *    1. Confuse admin for the first couple of seconds. 
 *    2. The admin may access to faculty's pages or functions through faculty's tabs, which they may not suppose to, 
 *       before layouts are reloaded.   
 *  How to fix:
 *    Hide all the admin/faculty view. If current user is an admin, set to admin-view and make visible, if current user 
 *    is a faculty, set to faculty-view and make visible.
 *   
 * 
*/

function test_getAllAdminAccounts(){
  Logger.log(getAllAdminAccounts());
}

var test_srvd = {
  "needsToSubmitProposal":0.0, "reviewYear":"null", "needsToPassQualiferExam":0.0, 
  "needsToDoPrelim":0.0, "needsToFinishSoon":0.0, "misconduct":0.0, "needsToFileDegreePlan":0.0, 
  "facultyName":null, "needsToImproveGrade":0.0, "commentsForFaculty":null, "uin":"829009530", 
  "commentsForStudents":"May the force be with you, motherfucker.", 
  "noStudentReportAvailable":0.0, "needsToFindAdvisor":0.0, "improvementPlanUrl":null, "rating":"U", "reportUrl":null}

function test_updateStudentReviewDetails(){
  updateStudentReviewDetails(test_srvd);
}

function check_user_identity(){
  Logger.log(getCredential("rob.light@tamu.edu"));
}

function test_getReviewInformationForUinAndYear(){
  //getReviewInformationForUinAndYear(uin, reviewYear, reviewer_account)
  Logger.log(getReviewInformationForUinAndYear("829009530", "", "peterchen33011@gmail.com"));
}

function test(){
  Logger.log(getCurrentReviewerEmail());
}

