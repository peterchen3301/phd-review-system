/*
 * sheet_urls.gs
 * 
 * Sheet url variables and functions. These are used by the whole project so you only have to modify here while migrating databasae.
 * 
 * Note that this scipt must be at top to make it accessable by later immediately-invoked function expressions.
 */

var account_sheet_url = "https://docs.google.com/spreadsheets/d/16q1qt5JTmCsSaUz_ixYswOWi6LDDOC8SZz2NvYTx7zI/edit#gid=0";
var student_info_sheet_url = "https://docs.google.com/spreadsheets/d/1Wq-zmCeYI_12uUVXAbPQfbM2FphfV0B0M9pEjt7LV8E/edit#gid=0";
var student_review_sheet_url = "https://docs.google.com/spreadsheets/d/1Gs5b7c4ADRMQjeNJxFB8gv0yBXoK0pPFTsFLxqyC9yc/edit#gid=0";
var review_year_information_url = "https://docs.google.com/spreadsheets/d/1itGFcZYze2Ev0yETquZoKdUnrgQjbo2M4GfQtoFfsY0/edit#gid=0";


// return object containing sheet urls 
function getSheetUrls()
{
  ret = {
    "account_sheet_url" : account_sheet_url,
    "student_info_sheet_url" : student_info_sheet_url,
    "student_review_sheet_url" : student_review_sheet_url,
    "review_year_information_url" : review_year_information_url
  };
  return ret;
}