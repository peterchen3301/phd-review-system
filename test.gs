/*
 * Test functions.
 * Todo : include unit test modules.
 */


/*
 * dev note
 * 
 ** At line 69 of add_student_review.html, where user select the review year, the default value is a "null"
 *  string, not a literal null value, which could be confusing. Consider changing deafult value to "n/a" or 
 *  disallow default value input.
 * 
 ** While getting review at add_student_review.html, the function getReviewInformationForUinAndYear() (line 142, 
 *  advisor_review.gs) is called to search and filter from all the reviews. While submitting review by calling
 *  function updateStudentReviewDetails() (line 167, advisor_review.gs), the searching process unnecessarily
 *  repeated, which can be saved by storing the data index during the 1st-search and invoke it in later submitting.
 *  
 ** At advisor_review.gs, while reading reviews by getReviewInformationForUinAndYear() (line 142, advisor_review.gs)
 *  and editing / adding reviews by updateStudentReviewDetails() (line 167, advisor_review.gs), each review is 
 *  accessed in array, which makes it vulnerable while data format changes. Using heapmap could be better. 
 * 
*/

function test_getAllStudentRecords() {
  console.log(getAllStudentRecords());
}

function test_getFacultyName(){
  console.log(getFacultyName());
}

function test_getFacultyEmail(){
  console.log(getFacultyEmail());
}

function test_getAllReviewYearInformation(){
  console.log(getAllReviewYearInformation());
}

var test_srvd = {
  "needsToSubmitProposal":0.0, "reviewYear":"null", "needsToPassQualiferExam":0.0, 
  "needsToDoPrelim":0.0, "needsToFinishSoon":0.0, "misconduct":0.0, "needsToFileDegreePlan":0.0, 
  "facultyName":null, "needsToImproveGrade":0.0, "commentsForFaculty":null, "uin":"829009530", 
  "commentsForStudents":"You are literally a retard, I'm ashamed to admit that I approved your application.", 
  "noStudentReportAvailable":0.0, "needsToFindAdvisor":0.0, "improvementPlanUrl":null, "rating":"U", "reportUrl":null}

function test_updateStudentReviewDetails(){
  updateStudentReviewDetails(test_srvd);
}