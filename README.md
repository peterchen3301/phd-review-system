# phd-review-system

A dev branch of PhD review system for Department of Computer Science and Engineering, Texas A&amp;M University, College Station

## How to migrate datasheets?

4 Google datasheets are used in this projects, which are:
* Account Sheet
* Student Info Sheet
* Student Review Sheet
* Review Year Information Sheet

Urls of these datasheets are directed to [sheet_urls.gs](sheet_urls.gs), simply modify them to your target datasheet urls to complete migration.

## Things I wish I knew beforehand

* Google App Script IDE sucks. If you encouter eternal deploying (The waitbar never ends while deploying) all of the sudden, I faced that twice: it looks like the only way you can do is to create another new project, copy all the files and configs and start it over.

* You'll have to import Googlesheet API Service ("Sheet") and ArrayLib Library to this project. Setting up Googlesheet API Service is straightforward but setting up ArrayLib Library will bring you some trouble. Save your trouble by [looking at this](https://sites.google.com/site/scriptsexamples/custom-methods/2d-arrays-library). Remember to switch your IDE to legacy editor for this.

* You can manage your project through github using [Google App Script GitHub Assistant](https://chrome.google.com/webstore/detail/google-apps-script-github/lfjcgcmkmjjlieihflfhjopckgpelofo/related?hl=en) add-on. However, it has kinda limited functionality. For example, each log-in and each token is only available to link to the project through one particular computer. If you switched to another computer, since there's no log-out option, you have to remove this GitHub add-on, reinstall it and re-generate a token for it to log-in. Also, I tried accessing to TAMU GitHub but failed so I suggest using [ordinary one](https://github.com/). If this stuff drives you crazy, try primitive way: copy then past. It works for sure. 

* The file-uploading functions: ```uploadFileToDrive()```, ```uploadDLToDrive()``` & ```uploadIp_R_ToDrive()``` at [Code.gs](Code.gs) are miracles: I tried to debug and maintain them but gave it up after all, considering my limited intelligence and lifetime. Anyone manages to do this will earn my ultimate respect.
 
## dev note

### Completed

* **"Temporarily" solved the bug of student review overriding. However, current code can still be improved.**

* Implemented dynamic hyperlinks for cv / report / improvement plan at student_info.html. Deprecated student_review.html and merge contents with student_info.html to simplify operations from student view.

* Fixed the url mangling bug, where domain name "a/tamu.edu/" repeated erroneously.

* Added "Comments For Faculty" function & textarea at add_student_review.html.

* Made "Comments For Student" textarea auto-resizable depending on content length, also manual resizable at add_student_review.html.

* Made "Attempts Completed" and "Degree Plan Submitted" label texts in student_details.htm.

* At student search table (student_search.html) added Prelim / Propose / Final Defense dates / ths year dept. & faculty ratings / last year dept. ratings / Report link, removed student details.

* Student_details.html is obsolete (but not depricated yet), since student details are no longer needed from student search table.

* Implemented dynamic hyperlinks for department letter / report / improvement plan at add_student_review.html.

* Made account_sheet data loaded onto Script Properties as local storage to increase account identity searching speed. By doing that the functions doesn't have to call the external spreadshhet and loop ot over everytime it searches an account name. This idea could be implemented on student_info_sheet, student_review_sheet & review_year_info_sheet to optimize total speed performance.

### What to do

* Gloabal variables are widely used in server-side script (.gs) ~~and client-side script (XXX_js.html / XXX_javascript.html)~~, which should be avoided.
  > suppl. : Variables in client-side script are not-so-much a matter since they survive on the user's browser and only when the pages are opened.
 
  *Threatens:* 
  - risk of race conditions, declaration and definotion chaos, and many more... 

  *Possible solutions:*
  - for variables that persist within whole session, ~~use [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)~~ refer to [Property Service](https://developers.google.com/apps-script/guides/properties) or [Cache Service](https://developers.google.com/apps-script/reference/cache/cache-service) for Google App Script.
  - for variables that are used in initialization, wrap them with immediately-invoked function expression.
  - for client-side scripts, wrap them with page onload listener functions.

* **The root cause of admin/faculty review overriding bug is that the routes to fetch from / submit the reviews are different.** While getting review at [add_student_review.html](add_student_review.html), the function ```getReviewInformationForUinAndYear()``` at [advisor_review.gs](advisor_review.gs) is called to search and filter from all the reviews. However, while submitting review, a different function ```updateStudentReviewDetails()``` at [advisor_review.gs](advisor_review.gs) is called.

  *Threatens:* 
  - risk of admin / faculty review intervention, lead to error access and overriding
  - unnecessary increase of process time

  *Possible solutions:*
  - Specify "review index" and do all the later operation based on this. Never do 2nd search. 

* Loading data from spreadsheet could be slow, since most of the server-side functions loop over the spreadsheet using Google Sheet APIs every time they are called.
 
  *Threatens:* 
  - Time effeciency issue, especially when loading abundant data like what student_search.html does.

  *Possible solutions:*
  - load spreadsheet data into script properties as local storage using [Property Service](https://developers.google.com/apps-script/guides/properties), wrap with immediately-invoked function expression.

    > Note : [Property Service](https://developers.google.com/apps-script/guides/properties) for Google App Script only accepts primitive data & strings as key storage. Therefore, before saving a hasp talbe / map to properties, you have convert it to JSON string format. 

    > hint 1 : every functions that call the sheet by `var ss = SpreadsheetApp.openByUrl(certain_sheet_url)` and do not write back to the sheet have potential to be optimized this way. 
    
    > hint 2 : account_sheet readings has been optimized by loading to script properties in JSON string format. Student_info_sheet, student_review_sheet & review_year_info_sheet to go. 


* At "review year" drop-down list in [add_student_review.html](add_student_review.html), the default value is a string of "null", not a literal null value.

  *Threatens:* 
  - confusion with syntax terminology
  - data management hardship

  *Possible solutions:*
  - Change deafult value of "review year" drop-down list to "n/a".
  - Disallow default (unselected) option in "review year" drop-down list.
  
* At 
  1. reading reviews in ```getReviewInformationForUinAndYear()``` at [advisor_review.gs](advisor_review.gs)
  2. editing/adding reviews in ```updateStudentReviewDetails()``` at  [advisor_review.gs](advisor_review.gs)
  3. filling table contents in ```onSuccess()``` at [student_search_js.html](student_search_js.html)
  
  elements are accessed through hard coded index (e.g. ```UIN = review[5]```).

  *Threatens:* 
  - vulnerable when spreadsheet format changes

  *Possible solutions:*
  - Make a dict of ```index{ item_name : index }``` to store spreadsheet items (1st row) and access element through it (e.g. ```UIN = review[ index.UIN ]```) in all later operations.
  
* In [add_student_review.html](add_student_review.html)  / [add_student_review_js.html](add_student_review_js.html), [student_search.html](student_search.html) / [student_search_js.html](student_search_js.html) and  [student_details.html](student_details.html), where admins and faculties share the same webpages. The "view-name" tab, as well as some layouts are set to faculty view as default, and reload to admin-view if it detects the current user as admin.

  *Threatens:* 
  - Confuse admin for the first couple of seconds. 
  - The admins can access to faculty's pages / functions through faculty's tabs right before layouts are reloaded, which they should not be able to. 

  *Possible solutions:*
  - Hide both admin/faculty views, then judge which to make visible based on user's identity.
 
* While selecting student's prelim/proposal/final-defense dates using ```datepicker``` class in [add_student.html](add_student.html), the timezone is recognized through the browser's current IP. This may not be a problem: Since most of the users are at Texas, so as these events that will be held. However, it could still cause some unwanted circumstances.

  *Threatens:* 
  - Timezone confusion. For example, If I select my final defense date while attending a conference in Taiwan, let's say ```7/31 00:00 Taiwan (UTC +8)```, it becomes ```7/30 10:00, Texas (UTC -6)``` for Texan people. However, in this case I definitely want to go back to College Station and have my final defense at ```7/31```, not ```7/30```.

  *Possible solutions:* 
   The key is to make sure the users are aware of timezone issue.
  - Store date as a string of "MM/DD/YYYY" and notice the user to enter dates in Texas timezone. (should be better)
  - Add a drop-down list to let users specify their timezone.

* Links to student documents (report / improvement plan / deptartment letter) are accessible at add_student_review.html. Shouldn't them be at see_reviews.html?

* Maybe add a wait bar at pages that spend couple of seconds loading, like add_student_review.html, student_info.html & student_search.html to indicate users that the pages are still loading and be patient.

* If you have plenty of time and want to do some unit tests. [QUnitGS2](http://qunitgs2.com/) may be the most promising one among a bunch of options. However, this test outputs will be in html template format so you may need to add a callback function for it into the current router ```Route.path = function(param, callBack)``` in [Code.gs](Code.gs). And if you still got some time after this, ask prof. Walker how important and meaningful unit test is! 

## Author of this branch

Hsing-Yu Chen 

### Contact

Forgive my lossy code. If you find it hard to realize my code, or if you have any questions & feedbacks, feel free to write me an email!
- [peterchen3301@tamu.edu](mailto:peterchen3301@tamu.edu)
- [peterchen33011@gmail.com](mailto:peterchen33011@gmail.com)

Gig'em aggies!
