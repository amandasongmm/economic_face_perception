*******************************************************************************
*** Date 			: November 2018, pilot									***
*** Project			: Econ face perception pilot							***
*** Topic			: Initial data processesing								***
*** Dofile			: pilot_init									        ***
*** Input Dataset	: second_pilot_DataClean.csv								***
*** Output Dataset	: NONE													***
*** Author			: Remy													***
*******************************************************************************

clear 
cap log close
macro drop _all
scalar drop _all
set more off
set matsize 11000
*ssc install tabout

*========================    SET DIRECTORIES	===============================*

	*Remy*
	gl main "/Users/remylevin/Dropbox/Research Projects/economic_face_perception"
	gl inputdata "$main/data"
	gl inputdata2 "$main/ptdir"
	gl output "$main/data" 

/*	
	*Amanda*

*/	
	
*==============================================================================*


*=====================initial data processesing & cleaning=====================*


cd "$inputdata"

import delimited using second_pilot_DataClean.csv, clear

drop if v1 == 1 | v1 == 2 //drop test data that amanda inputed

drop v1

*tostring trialid, gen(trialid_strng)

cd "$output"
save pilot2.dta, replace





***** Extracting demographic information for raters *****

keep if trial_type == "survey-multi-choice" | trial_type == "survey-text-req"

keep userid rt trial_type time_elapsed trial_index responses 

keep if trial_index == 1 | trial_index == 2

gen age = .
gen female = .
gen hispanic = .
gen race = .
gen education = .
gen state = ""
gen city = ""
gen zipcode = ""

split responses, parse(,)
replace responses6 = responses6 + responses7 
drop responses7

**Parsing out the string info

foreach i of numlist 1/6 {

	replace responses`i' = subinstr(responses`i', `"""', "",.) 
	replace responses`i' = subinstr(responses`i', "{", "",.)
	replace responses`i' = subinstr(responses`i', "}", "",.)
	replace responses`i' = subinstr(responses`i', ":", "",.) 
	replace responses`i' = subinstr(responses`i', " ", "",.) 
	replace responses`i' = subinstr(responses`i', "&#8217", "",.)
	replace responses`i' = subinstr(responses`i', ";", "",.)
	
}

replace responses1 = subinstr(responses1, "Q0", "",.) 
replace responses2 = subinstr(responses2, "Q1", "",.) 
replace responses3 = subinstr(responses3, "Q2", "",.) 
replace responses4 = subinstr(responses4, "Q3", "",.) 
replace responses5 = subinstr(responses5, "Q4", "",.) 
replace responses6 = subinstr(responses6, "Q5", "",.) 



**Coding up the responses

***Age

replace age = 1 if responses1 == "Under18"
replace age = 2 if responses1 == "18-25"
replace age = 3 if responses1 == "26-35"
replace age = 4 if responses1 == "36-45"
replace age = 5 if responses1 == "46-54"
replace age = 5 if responses1 == "46-55"
replace age = 6 if responses1 == "55+"

***Gender

replace female = 0 if responses2 == "Male"
replace female = 1 if responses2 == "Female"
replace female = 9 if responses2 == "Other/Prefernottosay"

***Hispanic

replace hispanic = 0 if responses3 == "No"
replace hispanic = 1 if responses3 == "Yes"

***Race

replace race = 1 if responses5 == "AmericanIndianorAlaskanNative"
replace race = 2 if responses5 == "Asian"
replace race = 3 if responses5 == "BlackorAfrican-American"
replace race = 4 if responses5 == "NativeHawaiianorOtherPacificIslander"
replace race = 5 if responses5 == "White"

***Education

replace education = 1 if responses6 == "Lessthanahighschooldiploma"
replace education = 2 if responses6 == "Highschooldegreeorequivalent(e.g.GED)"
replace education = 3 if responses6 == "Somecollegenodegree"
replace education = 4 if responses6 == "Associatedegree(e.g.AAAS)"
replace education = 5 if responses6 == "Bachelorsdegree(e.g.BABS)"
replace education = 6 if responses6 == "Professionalorppost-baccalauriatedegree"
replace education = 6 if responses6 == "Professionalorpost-baccalauriatedegree"

***State

replace state = responses1 if trial_index == 2

***City

replace city = responses2 if trial_index == 2

***Zipcode

replace zipcode = responses3 if trial_index == 2


**Restructuring the data

keep userid trial_index age female hispanic race education state city zipcode

replace state = state[_n+1] if trial_index == 1
replace city = city[_n+1] if trial_index == 1
replace zipcode = zipcode[_n+1] if trial_index == 1

drop if trial_index == 2
drop trial_index

**Save demographics dataset

cd "$output"
save demogs_pilot2.dta, replace



***** ICC measures for trait *****

cd "$output"
use pilot2.dta


**Process data into useable form (rating, judge, target)


keep userid rt trial_type time_elapsed trial_index responses imgname isrepeat
keep if trial_type == "face-likert-amanda"


replace responses = subinstr(responses, `"""', "",.)
replace responses = subinstr(responses, " ", "",.) 
replace responses = subinstr(responses, "{", "",.)
replace responses = subinstr(responses, "}", "",.)
replace responses = subinstr(responses, "Q0", "",.) 
replace responses = subinstr(responses, ":", "",.)

destring responses, gen(rating)
drop responses

**Generating categorical variables 

egen target = group(imgname)
egen perceiver = group(userid)

replace isrepeat = "0" if isrepeat == "False"
replace isrepeat = "1" if isrepeat == "True"
destring isrepeat, replace






*clear 
*cd "$inputdata2"
*import delimited using trialdata.csv, clear
*














 


