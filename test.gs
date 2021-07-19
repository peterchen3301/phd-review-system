/*
 * Test functions.
 * Todo : include unit test modules.
 */


/*
 * dev note
 * 
 ** === Todo ===
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
 ** While reading reviews at getReviewInformationForUinAndYear() (advisor_review.gs), editing/adding reviews at 
 *  updateStudentReviewDetails() (advisor_review.gs), also at onSuccess() (student_search_js.html) each element 
 *  is accessed in hard index (e.g. UIN = review[5]), which makes it vulnerable when spreadsheet format changes.
 *  How to fix:
 *    Make a dict of index{ item_name : index } to store spreadsheet items (1st row) and access element 
 *    through it (e.g. UIN = review[ index.UIN ]) in all later operations.
 * 
 ** At add_student_review.html/add_student_review_js.html, student_search.html/student_search_js.html and student_details.html
 *  where admins and faculties share the same webpage. The "view-name" tab, as well as some layouts are set to 
 *  faculty view as default, and reload to admin-view if it detects the current user as admin. The problems here are: 
 *    1. Confuse admin for the first couple of seconds. 
 *    2. The admins can access to faculty's pages or functions through faculty's tabs right before layouts are reloaded, 
 *       which they should not be able to. 
 *         
 *  How to fix:
 *    Hide all the admin/faculty view. If current user is an admin, set to admin-view and make visible, if current user 
 *    is a faculty, set to faculty-view and make visible.
 *
 ** While selecting student's prelim/proposal/final-defense dates using datepicker class in add_student.html, the timezone
 *  is recognized through the browser's current IP. This may not be a problem: Since most of the users are at Texas, so as 
 *  these events will be held. However, suppose that a user selects his/her proposal date at a different location, let's 
 *  say Taiwan (UTC +8), to be 7/31 00:00, then it becomes 7/30 10:00 to Texas (UTC -6). 
 *  How to fix:
 *    The key is to make sure the users are aware of timezone issue.
 *    1. Store date as a string of "MM/DD/YYYY" and notice the user to enter dates on Texas basis. << should be better
 *    2. Add a drop-down list to let users specify their timezone.
 * 
*/

function test_getAllAdminAccounts(){
  Logger.log(getAllAdminAccounts());
}

var test_srvd = {
  "needsToSubmitProposal":0.0, "reviewYear":"null", "needsToPassQualiferExam":0.0, 
  "needsToDoPrelim":0.0, "needsToFinishSoon":0.0, "misconduct":0.0, "needsToFileDegreePlan":0.0, 
  "facultyName":null, "needsToImproveGrade":0.0, "commentsForFaculty":null, "uin":"829009530", 
  "commentsForStudents":"May the force be with you.", 
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

function test_getAllStudentRecords(){
  Logger.log(getAllStudentRecords());
}

function test_date(){
  var date = getAllStudentRecords()[2][16];
  Logger.log(date)
  var util = Utilities.formatDate(date, 'America/New_York', 'MMMM dd, yyyy HH:mm:ss Z')
  Logger.log(util);
  var util = Utilities.formatDate(date, 'America/Chicago', 'MMMM dd, yyyy')
  Logger.log(util);
}

function test(){
  Logger.log(getScriptUrl());
  Logger.log(getMyScriptUrl());
}

