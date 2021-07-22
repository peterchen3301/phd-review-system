/*
 * Test functions.
 * Todo : include unit test modules.
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

function test_getFileName() {
  var file = DriveApp.getFileById( "17x1ykX8I0YrfRZgx-nrUUmtmCGg43GN9" );
  var fileName = file.getName();    
  Logger.log(fileName);
  return fileName;  
}

function test(){
  getAllReviewYears() 
}

