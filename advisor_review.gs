/*
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
      student_records[i][item] = date !== "" ? toDateString(date) : "n/a";
    });

  }
  return student_records.slice(1); // trim student_records[0] since it's header
}


// convert date object to string
function toDateString( date_object ) {
  return Utilities.formatDate(date_object, 'America/Chicago', 'MM dd, yyyy');
}


// return object containing faculty and admin ratings
function getReviewRaings( review_year ) {

  ratings = {};

  var student_review_sheet = SpreadsheetApp.openByUrl(student_review_sheet_url).getSheetByName("Sheet1");
  var student_records = student_review_sheet.getRange(2, 1, 
    student_review_sheet.getRange("A1").getDataRegion().getLastRow() - 1, 
    student_review_sheet.getRange("A1").getDataRegion().getLastColumn()).getValues();

  for (var i = 0; i < student_records.length; i++) {
    
    uin = student_records[i][0];

    if( !(uin in ratings) ) {
      ratings[uin] = { 'admin' : [], 'faculty' : [] };
    }

    rating = student_records[i][4];
    this_review_year = student_records[i][1];

    if ( review_year != this_review_year ) {
      continue;
    }

    /*
     * It judges the rewviewer as admin by whether "faculty_name" is "admin" or not.
     * Consider change.
     */
    if( student_records[i][2] == "admin" ){
      ratings[uin]['admin'] += rating;
    }
    else {
      ratings[uin]['faculty'] += rating;
    }
  }

  return ratings;
}


// get each review from student_review_sheet
function getAllStudentsReviewData() {
  var ss = SpreadsheetApp.openByUrl(student_review_sheet_url);
  var ws = ss.getSheetByName("Sheet1");
  
  var student_records = ws.getRange(2, 1, ws.getRange("A1").getDataRegion().getLastRow() - 1, ws.getRange("A1").getDataRegion().getLastColumn()).getValues();
  //Logger.log(student_records);
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
  //Logger.log(filteredData);
  if(filteredData.length == 1) {
    //Logger.log(filteredData[0][0]);
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
function handleSearchBtnClickedByUser(userInfo){
  
  var filteredData = getAllStudentRecords();
  
  if(userInfo.firstName != null){
    filteredData = ArrayLib.filterByText(filteredData, 2, userInfo.firstName);
  }

  if(userInfo.lastName != null){
    filteredData = ArrayLib.filterByText(filteredData, 3, userInfo.lastName);
  }
  
  if(userInfo.uin != null){
    filteredData = ArrayLib.filterByText(filteredData, 4, userInfo.uin);
  }
  
  return filteredData;
}


function getReviewInformationForUinAndYear(uin, reviewYear, reviewer_account = getCurrentReviewerEmail() ) {

  var filteredData = getAllStudentsReviewData();

  Logger.log(reviewer_account);
  Logger.log(filteredData);

  if(uin != null && uin != undefined) {
    filteredData = ArrayLib.filterByText(filteredData, 0, uin);
  }
  
  if(reviewYear != null && reviewYear != undefined) {
    filteredData = ArrayLib.filterByText(filteredData, 1, reviewYear);
  }

  // if this reviewer is a faculty, get only the review he left 
  if( getCredential(reviewer_account) == 'faculty' ) {
    filteredData = ArrayLib.filterByText(filteredData, 3, reviewer_account);
  }
  // if this reviewer is an admin, get all admin reviews
  else if ( getCredential(reviewer_account) == 'admin' ) {
    filteredData = filterByAdminReviews(filteredData);
  }

  Logger.log(filteredData);

  if(filteredData != null && filteredData != undefined && filteredData.length > 0) {

    if( filteredData.length > 1 ){
      Logger.log("Multiple reviews found, risk of overriding.");
    }
    return filteredData[0];
  }
  
  return getEmptyReviewData();
}


function updateStudentReviewDetails(studentReviewDetails) {
  
  var ss = SpreadsheetApp.openByUrl(student_review_sheet_url);
  var ws = ss.getSheetByName("Sheet1");
  var dataRange = ws.getDataRange();
  var values = dataRange.getValues();
  var dataExists = false;

  var reviewer_name = getFacultyName();
  
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


function getFacultyName() {

  var email = getCurrentReviewerEmail();
  var name = "";
  
  if(email == "grad-advisor@cse.tamu.edu")
    name = "Department";
  
  else {
    
    var ss = SpreadsheetApp.openByUrl(account_sheet_url);
    var ws = ss.getSheetByName("Faculty");
    var values = ws.getDataRange().getValues();
  
    for (var i = 1; i < values.length; i++) {
      if (rowValue(values, i, "Email") == email) {
        name = rowValue(values, i, "Faculty Name");
        break;
      }
    }
  }
  return name;
}


function getCurrentReviewerEmail() {
  return Session.getActiveUser().getEmail();
}


// return hashset of all admin accounts (email addresses) 
function getAllAdminAccounts() {

  var admin_accounts = {};
  var ss = SpreadsheetApp.openByUrl(account_sheet_url);
  var ws = ss.getSheetByName("Admin");
  var values = ws.getDataRange().getValues();

  for (var i = 1; i < values.length; i++) {
    admin_accounts[ rowValue(values, i, "Email") ] = true;
  }
  return admin_accounts;
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


// this function may be useless
function getStudentInfo(uin){
  var ss = SpreadsheetApp.openByUrl(student_info_sheet_url);
  var ws = ss.getSheetByName("Sheet1");
  
  var student_records = ws.getRange(2, 1, ws.getRange("A1").getDataRegion().getLastRow() - 1, ws.getRange("A1").getDataRegion().getLastColumn()).getValues();
  var filtered_student_record = ArrayLib.filterByText(student_records, 4, uin);
 // Logger.log(filtered_student_record)
  return filtered_student_record;
}


// this function may be useless
function getThatStudentInfo(uin){
  var ss = SpreadsheetApp.openByUrl(student_info_sheet_url);
  var ws = ss.getSheetByName("Sheet1");

  var student_records = ws.getRange(2, 1, ws.getRange("A1").getDataRegion().getLastRow() - 1, ws.getRange("A1").getDataRegion().getLastColumn()).getValues();
  var filtered_student_record = ArrayLib.filterByText(student_records, 4, uin);

  return filtered_student_record;
}

function getStudentReviews(uin){
  Logger.log("In getStudentReviews()");
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




