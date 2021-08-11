/*
 * advisor_reviews.gs
 * 
 * See installation guide of 2D Array Library (ArrayLib) : https://sites.google.com/site/scriptsexamples/custom-methods/2d-arrays-library
 * Need to switch to legacy editor to install this.
 */


// get info of every active student from student_info_sheet
function getAllStudentRecords() {

  var student_info = SpreadsheetApp.openByUrl(student_info_sheet_url).getSheetByName("Sheet1");
  
  /* 
   * Passing an array that includes javascript Date object to client-side script will cause error. since it may not support 
   * such datatype. Therefore, we should convert Date objects to strings of date. 
   */
  var student_records = student_info.getRange(1, 1, 
    student_info.getRange("A1").getDataRegion().getLastRow(), 
    student_info.getRange("A1").getDataRegion().getLastColumn() ).getValues(); 

  // get indices of date elements
  iDate = [ student_records[0].indexOf('prelim_date'), 
    student_records[0].indexOf('proposal_date'), 
    student_records[0].indexOf('final_defense_date') ] ;

  // convert date object to date string
  for( var i = 1; i < student_records.length; i++ ) {
    iDate.forEach(function (item, index) {
      var date = student_records[i][item];
      student_records[i][item] = date !== "" ? toDateString(date) : "-";
    });

  }

  student_records = student_records.slice(1); // trim student_records[0] since it's header

  var this_review_year = getActiveReviewYear();
  var ratings = getThisAndLastYearReviewRaings(this_review_year);
  var documents = getAllDocumentUrlsByYear(this_review_year);

  ret = { "student_records" : student_records, "ratings" : ratings, "documents" : documents };
  return ret;
}


// convert date object to string
function toDateString( date_object ) {
  return Utilities.formatDate(date_object, 'America/Chicago', 'MM dd, yyyy');
}


// return all faculty and admin ratings
function getThisAndLastYearReviewRaings( this_review_year = getActiveReviewYear() ) {

  var ret = {};
  var last_review_year = this_review_year - 1;

  var student_review_sheet = SpreadsheetApp.openByUrl(student_review_sheet_url).getSheetByName("Sheet1");
  var student_records = student_review_sheet.getRange(2, 1, 
    student_review_sheet.getRange("A1").getDataRegion().getLastRow() - 1, 
    student_review_sheet.getRange("A1").getDataRegion().getLastColumn()).getValues();

  for (var i = 0; i < student_records.length; i++) 
  {  
    uin = student_records[i][0];
    rating = student_records[i][4];
    review_year = student_records[i][1];

    if( !(uin in ret) )
    {
      ret[uin] = { 'admin_this_year' : "", 'admin_last_year' : "", 'faculty_this_year' : "" };
    }

    /*
     * It judges the rewviewer as admin by whether "faculty_name" is "admin" or not.
     * Consider change.
     */
    if( student_records[i][2] == "admin" && review_year == this_review_year ){
      ret[uin]['admin_this_year'] += rating + " ";
    }
    else if( student_records[i][2] == "admin" && review_year == last_review_year ){
      ret[uin]['admin_last_year'] += rating + " ";
    }
    else if( review_year == this_review_year ){
      ret[uin]['faculty_this_year'] += rating + " ";
    }
  }
  return ret;
}


// get each review from student_review_sheet
function getAllStudentsReviewData() {

  var ss = SpreadsheetApp.openByUrl(student_review_sheet_url);
  var ws = ss.getSheetByName("Sheet1");
  
  var student_records = ws.getRange(2, 1, ws.getRange("A1").getDataRegion().getLastRow() - 1, ws.getRange("A1").getDataRegion().getLastColumn()).getValues();
  Logger.log(student_records);
  return student_records;
}


// get each review years
function getAllReviewYearInformation() {

  var ss = SpreadsheetApp.openByUrl(review_year_information_url);
  
  var ws = ss.getSheetByName("Sheet1");
  var review_year_records = ws.getRange(2, 1, ws.getRange("A1").getDataRegion().getLastRow() - 1, ws.getRange("A1").getDataRegion().getLastColumn()).getValues();

  Logger.log(review_year_records);

  return review_year_records;
}


// get currently active review year
function getActiveReviewYear() {
  var filteredData = getAllReviewYearInformation();
  filteredData = ArrayLib.filterByText(filteredData, 1, "1");
  if(filteredData.length == 1) {
    return filteredData[0][0];
  }
  else {
    return "None";
  }
}

function addNewReviewYear(newReviewYear) {

  var ss = SpreadsheetApp.openByUrl(review_year_information_url);
  var ws = ss.getSheetByName("Sheet1");
  var dataRange = ws.getDataRange();
  var values = dataRange.getValues();
  var dataExists = false;
  
  for (var i = 0; i < values.length; i++) {
    if (values[i][0] == newReviewYear) {
      dataExists = true;
     // Logger.log("review year exists");
      return "The review year already exists!";
    } 
  }
  
  //Logger.log("adding new review year");
    ws.appendRow([newReviewYear, 0]);
  return "Review year added! Please refresh the page to view the latest review year.";
}

function endCurrentReviewYear() {

  var ss = SpreadsheetApp.openByUrl(review_year_information_url);
  var ws = ss.getSheetByName("Sheet1");
  var dataRange = ws.getDataRange();
  var values = dataRange.getValues();
  var ended = false;
  var currentReviewYear = getActiveReviewYear();
  
  for (var i = 0; i < values.length; i++) {
    if (values[i][0] == currentReviewYear) {
      ended = true;
      ws.getRange(i + 1,1 + 1).setValue(0);
      break;
    } 
  }
  
  if(ended) {
    return "Ended the review year " + currentReviewYear + "! Please refresh the page to view the latest state.";
  }
  return "No active review year found!";
}

function beginThisReviewYear(reviewYear) {

  var ss = SpreadsheetApp.openByUrl(review_year_information_url);
  var ws = ss.getSheetByName("Sheet1");
  var dataRange = ws.getDataRange();
  var values = dataRange.getValues();
  var begun = false;
  var currentReviewYear = getActiveReviewYear();
  
  for (var i = 0; i < values.length; i++) {
    if (values[i][0] == reviewYear) {
      ws.getRange(i + 1,1 + 1).setValue(1);
      begun = true;
      break;
    } 
  }
  
  if(begun) {
    return "Started the review year " + reviewYear + "! Please refresh the page to view the latest state.";
  }
  return "Review year " + reviewYear + " not found!";
}

function getEmptyReviewData() {
  var student_records = [];
  for(var i = 0; i < 21; i++) {
    student_records.push("");
  }
  //Logger.log("student_records: " + student_records);
  return student_records;
}


// filter and get wanted student info from all 
function getFilteredStudentRecords( filter ){

  console.log()
  
  var student_data = getAllStudentRecords();
  var filtered_records = student_data["student_records"];
  
  if(filter.first_name != null){
    filtered_records = ArrayLib.filterByText(filtered_records, 2, filter.first_name);
  }

  if(filter.last_name != null){
    filtered_records = ArrayLib.filterByText(filtered_records, 3, filter.last_name);
  }
  
  if(filter.uin != null){
    filtered_records = ArrayLib.filterByText(filtered_records, 4, filter.uin);
  }

  student_data["student_records"] = filtered_records;

  console.log("filter", filter);
  console.log("student data", student_data);

  return student_data;
}


function getReviewInformationFromUinAndYear(uin, reviewYear, reviewer_account = getCurrentReviewerEmail() ) {

  var filteredData = getAllStudentsReviewData();

  console.log(reviewer_account);
  console.log(filteredData);

  if(uin != null && uin != undefined) {
    filteredData = ArrayLib.filterByText(filteredData, 0, uin);
  }
  
  if(reviewYear != null && reviewYear != undefined) {
    filteredData = ArrayLib.filterByText(filteredData, 1, reviewYear);
  }

  var identity = getCredential(reviewer_account);
  // if this reviewer is a faculty, get only the review he left 
  if( identity == 'Faculty' ) {
    console.log("review is faulty")
    filteredData = ArrayLib.filterByText(filteredData, 3, reviewer_account);
  }
  // if this reviewer is an admin, get all admin reviews
  else if ( identity == 'Admin' ) {
    console.log("review is admin")
    filteredData = filterByAdminReviews(filteredData);
  }

  console.log(filteredData);

  if(filteredData != null && filteredData != undefined && filteredData.length > 0) {

    if( filteredData.length > 1 ){
      console.log("Multiple reviews found, risk of overriding.");
    }
    return filteredData[0];
  }
  
  return getEmptyReviewData();
}


/* 
 *  update student review to student_review_sheet by:
 *    
 *    if there's a review that matches student_uin, review_year & reviewer_name  : overwrite it
 *    otherwise                                                                  : append with a new review
 *
 *  This function can be improved from many aspects. 
 */ 
function updateStudentReviewDetails(studentReviewDetails) {
  
  var ss = SpreadsheetApp.openByUrl(student_review_sheet_url);
  var ws = ss.getSheetByName("Sheet1");
  var dataRange = ws.getDataRange();
  var values = dataRange.getValues();
  var dataExists = false;

  var reviewer_name = getReviewerNameByAccount();
  
  for (var i = 0; i < values.length; i++) {

    if (values[i][0] == studentReviewDetails.uin && values[i][1] == studentReviewDetails.reviewYear && values[i][2] == reviewer_name) { // bad code: what if two reviewer have the same anme?
      dataExists = true;

      var student_id = i + 1;
      ws.getRange( student_id, 3 ).setValue(reviewer_name);
      ws.getRange( student_id, 5 ).setValue(studentReviewDetails.rating);
      ws.getRange( student_id, 8 ).setValue(studentReviewDetails.reportUrl);
      ws.getRange( student_id, 9 ).setValue(studentReviewDetails.improvementPlanUrl);
      
      ws.getRange( student_id, 10).setValue(studentReviewDetails.commentsForStudents);
      ws.getRange( student_id, 11).setValue(studentReviewDetails.commentsForFaculty);
      ws.getRange(student_id, 12 ).setValue(studentReviewDetails.needsToImproveGrade);
      ws.getRange( student_id, 13 ).setValue(studentReviewDetails.noStudentReportAvailable);
      ws.getRange( student_id, 14 ).setValue(studentReviewDetails.misconduct);
      ws.getRange( student_id, 15 ).setValue(studentReviewDetails.needsToPassQualiferExam);
      ws.getRange( student_id, 16 ).setValue(studentReviewDetails.needsToFindAdvisor);
      ws.getRange( student_id, 17 ).setValue(studentReviewDetails.needsToFileDegreePlan);
      ws.getRange( student_id, 18 ).setValue(studentReviewDetails.needsToDoPrelim);
      ws.getRange( student_id, 19 ).setValue(studentReviewDetails.needsToSubmitProposal);
      ws.getRange( student_id, 20 ).setValue(studentReviewDetails.needsToFinishSoon);
      
      break;  
    } 
  }
  
  if (!dataExists){ 
    Logger.log("adding new row");
    ws.appendRow([
      studentReviewDetails.uin, 
      studentReviewDetails.reviewYear,
      reviewer_name, 
      getCurrentReviewerEmail(), 
      studentReviewDetails.rating, 
      "", 
      "", 
      studentReviewDetails.reportUrl,
      studentReviewDetails.
      improvementPlanUrl,
      studentReviewDetails.commentsForStudents, 
      "", 
      studentReviewDetails.needsToImproveGrade,
      studentReviewDetails.noStudentReportAvailable, 
      studentReviewDetails.misconduct, 
      studentReviewDetails.needsToPassQualiferExam,
      studentReviewDetails.needsToFindAdvisor, 
      studentReviewDetails.needsToFileDegreePlan, 
      studentReviewDetails.needsToDoPrelim,
      studentReviewDetails.needsToSubmitProposal, 
      studentReviewDetails.needsToFinishSoon
      ]);
  }  
}


/*
 *  return reviewer's name
 *    
 *    if reviewer is admin    : return "admin"
 *        this is to make it compatible with "getThisAndLastYearReviewRaings()" in advisor_review.gs & "getReviewDetails()"" in Code.gs.
 *        If definition in above functions change, change this function also.
 *    if reviewer is faculty  : return his/her name
 *    otherwise               : return "unidentified" 
 * 
 */
function getReviewerNameByAccount( email = getCurrentReviewerEmail() ) {

  if(email == "grad-advisor@cse.tamu.edu")
  {
    //return "Department";
    return "admin";
  } 

  var admin_account_map = PropertiesService.getScriptProperties().getProperties()["Admin"];
  admin_account_map = JSON.parse(admin_account_map);

  var faculty_account_map = PropertiesService.getScriptProperties().getProperties()["Faculty"];
  faculty_account_map = JSON.parse(faculty_account_map);

  if( email in admin_account_map )
  {
    return "admin";
  }
  else if( email in faculty_account_map )
  {
    return faculty_account_map[email];
  }
  return "unidentified";
}


// get email address of current user
function getCurrentReviewerEmail() {
  return Session.getActiveUser().getEmail();
}


// return hashset of all admin accounts (email addresses) 
function getAllAdminAccounts() {

  var admin_account_map = PropertiesService.getScriptProperties().getProperties()["Admin"];
  var admin_accounts = Object.keys(JSON.parse(admin_account_map));

  var ret = {};
  for (var i = 0; i < admin_accounts.length; i++) 
  {
    ret[ admin_accounts[i] ] = true;
  }

  return ret;
}


// return all the reviews made by admins
function filterByAdminReviews( reviews ){

  filtered = [];
  admin_accounts = getAllAdminAccounts();

  for (var i = 0; i < reviews.length; i++) {

    var reviewer_account = reviews[i][3];
    if( admin_accounts[reviewer_account] ){
      filtered.push(reviews[i]);
    }
  }
  return filtered;
}


function getStudentReviews(uin){
  var ss = SpreadsheetApp.openByUrl(student_review_sheet_url);
  var ws = ss.getSheetByName("Sheet1");

  var student_reviews = ws.getRange(2, 1, ws.getRange("A1").getDataRegion().getLastRow() - 1, ws.getRange("A1").getDataRegion().getLastColumn()).getValues();
  //Logger.log("Raw student_reviews " + student_reviews);
  var filtered_student_reviews = ArrayLib.filterByText(student_reviews, 0, uin);
  //Logger.log("Filtered student reviews \n" + filtered_student_reviews);
  return filtered_student_reviews;
}

function convertFilteredStudentReviewsDataToHTMLTable(filtered_student_reviews){
  var tableDataHtml = "";
  for(var i = 0; i < filtered_student_reviews.length; i++){
    //var reviewer = (filtered_student_reviews[i][2] == "admin") ? "Admin" : "Faculty";
    
    tableDataHtml = tableDataHtml + "<tr>" + 
                                        "<td>" + filtered_student_reviews[i][2] + "</td>" +
                                        "<td>" + filtered_student_reviews[i][4] + "</td>" + 
                                        "<td>" + filtered_student_reviews[i][1] + "</td>" + 
                                        "<td>" + filtered_student_reviews[i][9] + "</td>" + 
                                    "</tr>";
  }
  return tableDataHtml;
}




