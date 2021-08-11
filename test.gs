/*
 * test.gs
 * 
 * Test functions.
 * Todo : include unit test modules.
 * 
 * Consider using spreadsheet[0].indexOf(column_title) instead of using constant index to find items from spreadsheet.
 * 
 * Do we need to add "Review for the faculty" textbox at see_review.html?
 * 
 * Need to have a function to classify reviewer email address as admin / faculty. Now it judges by whether 2."faculty_name" is "admin" 
 * or not at the student review sheet, not so good.
 * 
 * student_details.html is obsolete (but not depricated yet), since student details are no longer availabe on student search table.
 * 
 * Why links to student documents (report / improvement plan / deptartment letter) are at add_student_review.html, not at see_reviews.html?
 * 
 * Gloabal variables are widely used in server-side script (*.gs) and client-side script (*_js.html / *_javascript.html), which is a bad idea. Should avoid declaring 
 * global variables using immediated invoked function expression, or wrap them by page onload listeners.
 * 
 */


function test()
{
  Logger.log(getStudentDocumentUrls("829009530", "2022"));

}

//getAllReviewRaings
//getReviewRaingsByYear(2021)