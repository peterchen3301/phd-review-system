# phd-review-system

A dev branch of PhD review system for Department of Computer Science and Engineering, Texas A&amp;M University, College Station

## Author

[Hsing-Yu Chen](mailto:peterchen33011@tamu.edu?subject=[GitHub]%20Source%20Han%20Sans)

## dev note

### Completed

* **"Temporarily" solved the bug of student review overriding. However, current code is still vulnerable, please see "Todo" message below.**

* Made "comments For Student" textarea auto-resizable depending on content length, also manual resizable

![demo1](https://github.com/peterchen3301/phd-review-system/blob/hychen/demo_images/demo1.png?raw=true)

* Made "Attempts Completed" and "Degree Plan Submitted" label texts in student_details.html keep in one-line. They used to be wrapped and would break line if browser window is small.

before:

![demo2_1](https://github.com/peterchen3301/phd-review-system/blob/hychen/demo_images/demo_2_1.png?raw=true)

fixed:

![demo2_2](https://github.com/peterchen3301/phd-review-system/blob/hychen/demo_images/demo_2_2.png?raw=true)

* Add columns in student search table (student_search.html) to show Prelim/Propose/Final Defense dates.

![demo_3](https://github.com/peterchen3301/phd-review-system/blob/hychen/demo_images/demo_3.png?raw=true)

### Todo

* **The root cause of admin/faculty review overriding bug is that the routes to fetch and to submit the reviews are standalone.** While getting review at add_student_review.html, the function getReviewInformationForUinAndYear() (advisor_review.gs) is called to search and filter from all the reviews. However, while submitting review, a standalone function updateStudentReviewDetails() (advisor_review.gs) is called.

  *Threatens:* 
  - risk of admin / faculty review intervention, lead to error access and overriding
  - unnecessary increase of process time

  *Possible solutions:*
  - Specify "review index" and do all the later operation based on this. Never do 2nd search. 

* At "review year" drop-down list in add_student_review.html, the default value is a string of "null", not a literal null value which could lead to confusion and data management hardship. Consider changing deafult value to "n/a", and disallow default value input.

  *Threatens:* 
  - confusion in terminology
  - Data management hardship

  *Possible solutions:*
  - Change deafult value of "review year" drop-down list to "n/a"
  - disallow default (unselected) option in "review year" drop-down list
  
* While reading reviews at getReviewInformationForUinAndYear() (advisor_review.gs), editing/adding reviews at updateStudentReviewDetails() (advisor_review.gs), also at onSuccess() (student_search_js.html) each element is accessed in hard index (e.g. UIN = review[5]).

  *Threatens:* 
  - vulnerable when spreadsheet format changes

  *Possible solutions:*
  - Make a dict of index{ item_name : index } to store spreadsheet items (1st row) and access element through it (e.g. UIN = review[ index.UIN ]) in all later operations.
  
* At add_student_review.html/add_student_review_js.html, student_search.html/student_search_js.html and student_details.html where admins and faculties share the same webpage. The "view-name" tab, as well as some layouts are set to faculty view as default, and reload to admin-view if it detects the current user as admin.

  *Threatens:* 
  - Confuse admin for the first couple of seconds. 
  - The admins can access to faculty's pages or functions through faculty's tabs right before layouts are reloaded, which they should not be able to. 

  *Possible solutions:*
  - Hide all the admin/faculty view. If current user is an admin, set to admin-view and make visible, if current user is a faculty, set to faculty-view and make visible.
 
* While selecting student's prelim/proposal/final-defense dates using datepicker class in add_student.html, the timezone is recognized through the browser's current IP. This may not be a problem: Since most of the users are at Texas, so as these events will be held. However, suppose that a user selects his/her proposal date at a different location, let's say Taiwan (UTC +8), to be 7/31 00:00, then it becomes 7/30 10:00 to Texas (UTC -6). 

  *Threatens:* 
  - Timezone confusion

  *Possible solutions:* 
   The key is to make sure the users are aware of timezone issue.
  - Store date as a string of "MM/DD/YYYY" and notice the user to enter dates on Texas basis. << should be better
  - Add a drop-down list to let users specify their timezone.
