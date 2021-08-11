# phd-review-system

A dev branch of PhD review system for Department of Computer Science and Engineering, Texas A&amp;M University, College Station

## How to migrate datasheets?

4 Google datasheets are used in this projects, which are:
* Account Sheet
* Student Info Sheet
* Student Review Sheet
* Review Year Information Sheet

Urls of these sheets are directed to [sheet_urls.gs](sheet_urls.gs), simply modify them to migrate.

## dev note

### Completed

* **"Temporarily" solved the bug of student review overriding. However, current code is still considered vulnerable.**

* Fixed the url mangling bug, where domain name "a/tamu.edu/" repeated erroneously. 

* Added "Comments For Faculty" function & textarea.

* Made "Comments For Student" textarea auto-resizable depending on content length, also manual resizable.

* Made "Attempts Completed" and "Degree Plan Submitted" label texts in student_details.htm.

* Added columns in student search table (student_search.html) to show Prelim/Propose/Final Defense dates.

* Student_details.html is obsolete (but not depricated yet), since student details are no longer needed from student search table.

### What to do

* **Gloabal variables are widely used in server-side script (.gs) and client-side script (XXX_js.html / XXX_javascript.html), which is a bad idea.**
 
  *Threatens:* 
  - risk of race conditions, declaration and definotion chaos, and many more... 

  *Possible solutions:*
  - wrap variables using immediated invoked function expression
  - for client-side scripts, wrap them with page onload listener functions

* **The root cause of admin/faculty review overriding bug is that the routes to fetch from / submit the reviews are different.** While getting review at [add_student_review.html](add_student_review.html), the function ```getReviewInformationForUinAndYear()``` at [advisor_review.gs](advisor_review.gs) is called to search and filter from all the reviews. However, while submitting review, a different function ```updateStudentReviewDetails()``` at [advisor_review.gs](advisor_review.gs) is called.

  *Threatens:* 
  - risk of admin / faculty review intervention, lead to error access and overriding
  - unnecessary increase of process time

  *Possible solutions:*
  - Specify "review index" and do all the later operation based on this. Never do 2nd search. 

* At "review year" drop-down list in [add_student_review.html](add_student_review.html), the default value is a string of "null", not a literal null value.

  *Threatens:* 
  - confusion with syntax terminology
  - Data management hardship

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
  - Store date as a string of "MM/DD/YYYY" and notice the user to enter dates in Texas timezone. << should be better
  - Add a drop-down list to let users specify their timezone.

* Links to student documents (report / improvement plan / deptartment letter) are accessible at add_student_review.html. Shouldn't them be at see_reviews.html?

## Author for this branch

[Hsing-Yu Chen](mailto:peterchen33011@tamu.edu?subject=[GitHub]%20Source%20Han%20Sans)
