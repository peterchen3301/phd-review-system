var url_student_personal_details = "https://docs.google.com/spreadsheets/d/1vSpjuhHL4BpCgV7-mdMYtCIVd4VfQpKHw16218awcV8/edit#gid=0";
var url_student_review_details = "https://docs.google.com/spreadsheets/d/1Ndizu-BwuJ8-rexcruRsrPfot9mgVtP5RE1Qz6PDxFw/edit#gid=0";
var url_review_year_information = "https://docs.google.com/spreadsheets/d/18EJyEDD-NufR0dtzzoXbA9mtvIQC-jr0zxF13IkWqIc/edit#gid=0";

var login_sheet = "https://docs.google.com/spreadsheets/d/1UWcbToPpGux2qT_u7YHJROfdH_jlSp4-apZGEs52w08/edit#gid=287583425";

function getAllStudentRecords() {
  var ss = SpreadsheetApp.openByUrl(url_student_personal_details);
  var ws = ss.getSheetByName("Sheet1");
  
  var student_records = ws.getRange(2, 1, ws.getRange("A1").getDataRegion().getLastRow() - 1, ws.getRange("A1").getDataRegion().getLastColumn()-3).getValues(); // note: explicitly excluding date columns (they cause error?)
  Logger.log(student_records);
  return student_records;
}

function getAllStudentsReviewData() {
  var ss = SpreadsheetApp.openByUrl(url_student_review_details);
  var ws = ss.getSheetByName("Sheet1");
  
  var student_records = ws.getRange(2, 1, ws.getRange("A1").getDataRegion().getLastRow() - 1, ws.getRange("A1").getDataRegion().getLastColumn()).getValues();
  Logger.log(student_records);
  return student_records;
}

function getAllReviewYearInformation() {
  var ss = SpreadsheetApp.openByUrl(url_review_year_information);
  var ws = ss.getSheetByName("review_years");
  var review_year_records = ws.getRange(2, 1, ws.getRange("A1").getDataRegion().getLastRow() - 1, ws.getRange("A1").getDataRegion().getLastColumn()).getValues();
  Logger.log(review_year_records);
  return review_year_records;
}

function getActiveReviewYear() {
  var filteredData = getAllReviewYearInformation();
  filteredData = ArrayLib.filterByText(filteredData, 1, "1");
  Logger.log(filteredData);
  if(filteredData.length == 1) {
    Logger.log(filteredData[0][0]);
    return filteredData[0][0];
  }
  else {
    return "None";
  }
}

function addNewReviewYear(newReviewYear) {
  var ss = SpreadsheetApp.openByUrl(url_review_year_information);
  var ws = ss.getSheetByName("Sheet1");
  var dataRange = ws.getDataRange();
  var values = dataRange.getValues();
  var dataExists = false;
  
  for (var i = 0; i < values.length; i++) {
    if (values[i][0] == newReviewYear) {
      dataExists = true;
      Logger.log("review year exists");
      return "The review year already exists!";
    } 
  }
  
  Logger.log("adding new review year");
    ws.appendRow([newReviewYear, 0]);
  return "Review year added! Please refresh the page to view the latest review year.";
}

function endCurrentReviewYear() {
  var ss = SpreadsheetApp.openByUrl(url_review_year_information);
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
    Logger.log("Ended current review year");
    return "Ended the review year " + currentReviewYear + "! Please refresh the page to view the latest state.";
  }
  return "No active review year found!";
}

function beginThisReviewYear(reviewYear) {
  var ss = SpreadsheetApp.openByUrl(url_review_year_information);
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
    Logger.log("Ended current review year");
    return "Started the review year " + reviewYear + "! Please refresh the page to view the latest state.";
  }
  return "Review year " + reviewYear + " not found!";
}

function getEmptyReviewData() {
  var student_records = [];
  for(var i = 0; i < 21; i++) {
    student_records.push("");
  }
  Logger.log("student_records: " + student_records);
  return student_records;
}



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

function getReviewInformationForUinAndYear(uin, reviewYear) {
  //uin = parseInt(uin);
  //reviewYear = parseInt(reviewYear);
  
  Logger.log("uin =" + uin + ", reviewYear =" + reviewYear +".");
  
  var filteredData = getAllStudentsReviewData();
  Logger.log("before filtering: " + filteredData);
  
  if(uin != null && uin != undefined) {
    filteredData = ArrayLib.filterByText(filteredData, 0, uin);
  }
  
  Logger.log("after first filtering: " + filteredData);
  
  if(reviewYear != null && reviewYear != undefined) {
    filteredData = ArrayLib.filterByText(filteredData, 1, reviewYear);
  }
  
  Logger.log("after second filtering: " + filteredData);
  
  if(filteredData != null && filteredData != undefined && filteredData.length > 0) {
    return filteredData[0];
  }
  Logger.log("getting empty review data now");
  
  emptyReviewData = getEmptyReviewData();
  Logger.log("emptyReviewdat = " + emptyReviewData);
  return emptyReviewData;
}

function updateStudentReviewDetails(studentReviewDetails) {
  
  //Adding code for fetching file URLs from review_year_information spreadsheet
//  var uin = studentReviewDetails.uin;
//  var year = studentReviewDetails.reviewYear;
//  var urls = get_urls(uin,year);
//  Logger.log("In updateStudentReviewDetails");
//  Logger.log("URLs: ", urls);
//  Logger.log(urls.report);
//  Logger.log(urls.improvement);
//  
  var ss = SpreadsheetApp.openByUrl(url_student_review_details);
  var ws = ss.getSheetByName("Sheet1");
  var dataRange = ws.getDataRange();
  var values = dataRange.getValues();
  var dataExists = false;
  
  for (var i = 0; i < values.length; i++) {
    Logger.log(getFacultyName());
    if (values[i][0] == studentReviewDetails.uin && values[i][1] == studentReviewDetails.reviewYear && values[i][2] == getFacultyName()) {
      dataExists = true;
      Logger.log("data exists");
      //ws.getRange(i + 1, 3).setValue("Dummy Name");
      //Adding column for Faculty Name
      ws.getRange(i + 1,3).setValue(getFacultyName());
      ws.getRange(i + 1,3 + 2).setValue(studentReviewDetails.rating);
      ws.getRange(i + 1,8).setValue(studentReviewDetails.reportUrl);
      ws.getRange(i + 1,9).setValue(studentReviewDetails.improvementPlanUrl);
      
      ws.getRange(i + 1,8 + 2).setValue(studentReviewDetails.commentsForStudents);
      ws.getRange(i + 1,10 + 2).setValue(studentReviewDetails.needsToImproveGrade);
      ws.getRange(i + 1,11 + 2).setValue(studentReviewDetails.noStudentReportAvailable);
      ws.getRange(i + 1,12 + 2).setValue(studentReviewDetails.misconduct);
      ws.getRange(i + 1,13 + 2).setValue(studentReviewDetails.needsToPassQualiferExam);
      ws.getRange(i + 1,14 + 2).setValue(studentReviewDetails.needsToFindAdvisor);
      ws.getRange(i + 1,15 + 2).setValue(studentReviewDetails.needsToFileDegreePlan);
      ws.getRange(i + 1,16 + 2).setValue(studentReviewDetails.needsToDoPrelim);
      ws.getRange(i + 1,17 + 2).setValue(studentReviewDetails.needsToSubmitProposal);
      ws.getRange(i + 1,18 + 2).setValue(studentReviewDetails.needsToFinishSoon);
      
      break;  
    } 
  }
  
  if (!dataExists){ 
    Logger.log("adding new row");
    ws.appendRow([studentReviewDetails.uin, studentReviewDetails.reviewYear,getFacultyName(), getFacultyEmail(), studentReviewDetails.rating, "", "", studentReviewDetails.reportUrl,studentReviewDetails.improvementPlanUrl,
                  studentReviewDetails.commentsForStudents, "", studentReviewDetails.needsToImproveGrade,
                  studentReviewDetails.noStudentReportAvailable, studentReviewDetails.misconduct, studentReviewDetails.needsToPassQualiferExam,
                  studentReviewDetails.needsToFindAdvisor, studentReviewDetails.needsToFileDegreePlan, studentReviewDetails.needsToDoPrelim,
                  studentReviewDetails.needsToSubmitProposal, studentReviewDetails.needsToFinishSoon
                 ]);
  }  
}

function getUser() {
  var user = Session.getActiveUser().getEmail();
  if(user == "walker@tamu.edu" || user == "karrie@tamu.edu") {
    return "admin";
  }
  return user;
}
//Function to fetch Faculty Name
function getFacultyName() {
  var email = getFacultyEmail();
  var name = "";
  if(email == "walker@tamu.edu" || email == "karrie@tamu.edu" || email == "dolapinaki@tamu.edu")
    name = "Department";
  else {
  var ss = SpreadsheetApp.openByUrl(login_sheet);
  var ws = ss.getSheetByName("Faculty");
  var data = ws.getRange(1, 1, ws.getLastRow(), 1).getValues();
  
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

function getFacultyEmail() {
  var email = Session.getActiveUser().getEmail();
  return email;
}

function getStudentInfo(uin){
  var ss = SpreadsheetApp.openByUrl(url_student_personal_details);
  var ws = ss.getSheetByName("Sheet1");
  
  var student_records = ws.getRange(2, 1, ws.getRange("A1").getDataRegion().getLastRow() - 1, ws.getRange("A1").getDataRegion().getLastColumn()).getValues();
  var filtered_student_record = ArrayLib.filterByText(student_records, 4, uin);
  Logger.log(filtered_student_record)
  return filtered_student_record;
}

function getThatStudentInfo(uin){
  var ss = SpreadsheetApp.openByUrl(url_student_personal_details);
  var ws = ss.getSheetByName("Sheet1");

  var student_records = ws.getRange(2, 1, ws.getRange("A1").getDataRegion().getLastRow() - 1, ws.getRange("A1").getDataRegion().getLastColumn()).getValues();
  var filtered_student_record = ArrayLib.filterByText(student_records, 4, uin);

  return filtered_student_record;
}

function getStudentReviews(uin){
  Logger.log("In getStudentReviews()");
  var ss = SpreadsheetApp.openByUrl(url_student_review_details);
  var ws = ss.getSheetByName("Sheet1");

  var student_reviews = ws.getRange(2, 1, ws.getRange("A1").getDataRegion().getLastRow() - 1, ws.getRange("A1").getDataRegion().getLastColumn()).getValues();
  Logger.log("Raw student_reviews " + student_reviews);
  var filtered_student_reviews = ArrayLib.filterByText(student_reviews, 0, uin);
  Logger.log("Filtered student reviews \n" + filtered_student_reviews);
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