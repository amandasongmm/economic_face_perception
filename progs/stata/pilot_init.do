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


*initial initial data processesing*

*cd "$inputdata2"
*import delimited using trialdata.csv, clear






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
drop trial_type


**Flag for pilot version

tempfile mycopy
save `mycopy', replace
contract perceiver, freq(a)
merge 1:m perceiver using `mycopy'

drop if a == 10

gen version = .
replace version = 1 if a == 161
replace version = 2 if a == 81
replace version = 3 if a == 82

drop a _merge

*==================================Stats=======================================*

***Identify and drop subjects that rate same thing >75% of the time
***ADD multi-mode (2) 


bysort perceiver: egen rating_mode = mode(rating)
gen mode_check = 0
replace mode_check = 1 if rating_mode == rating
bysort perceiver: egen rating_modenum = total(mode_check)
bysort perceiver: egen rat_count = count(rating)
gen qual_check = rating_modenum/rat_count

preserve 
keep if version == 1
tab qual_check
restore

preserve 
keep if version == 2
tab qual_check
restore

preserve 
keep if version == 3
tab qual_check
restore



***Test-retest reliability***

**All data

preserve
keep perceiver target rating isrepeat
reshape wide rating, i(perceiver target) j(isrepeat)
corr rating0 rating1
by perceiver: corr rating0 rating1
restore


**pilot 1
preserve
keep if version == 1
keep perceiver target rating isrepeat
reshape wide rating, i(perceiver target) j(isrepeat)
corr rating0 rating1
by perceiver: corr rating0 rating1
restore

**pilot 2a
preserve 
keep if version == 2 
keep perceiver target rating isrepeat
reshape wide rating, i(perceiver target) j(isrepeat)
corr rating0 rating1
by perceiver: corr rating0 rating1
restore

**pilot 2b

preserve 
keep if version == 3 
keep perceiver target rating isrepeat
reshape wide rating, i(perceiver target) j(isrepeat)
corr rating0 rating1
by perceiver: corr rating0 rating1
restore

**pilots 2a + 2b
preserve 
keep if version == 3 | version == 2 
keep perceiver target rating isrepeat
reshape wide rating, i(perceiver target) j(isrepeat)
corr rating0 rating1
by perceiver: corr rating0 rating1
restore

***Generate within person measure of test-retest reliability

preserve
keep perceiver target rating isrepeat
reshape wide rating, i(perceiver target) j(isrepeat)
gen trr = .
*by perceiver: corr rating0 rating1
*return list, all

*corr rating0 rating1 if perceiver == 1
*return list

levelsof perceiver, local(trr_list)
foreach i in `trr_list' {
	corr rating0 rating1 if perceiver == `i'
	replace trr = `r(rho)' if perceiver == `i'
}
keep if target == 1
keep perceiver trr

tempfile trr
save `trr', replace
restore
merge m:1 perceiver using `trr'

****Getting ICC****

**Generate average rating

sort userid imgname isrepeat
bysort userid imgname: gen avg_rat = (rating +rating[_n+1])/2 if isrepeat == 0
drop if isrepeat == 1

*Fully pooled sample
icc avg_rat target perceiver

*Version 1, unfiltered

preserve
keep if version == 1
icc avg_rat target perceiver
restore

*Version 2, unfiltered

preserve
keep if version == 2
icc avg_rat target perceiver
restore

*Version 3, unfiltered

preserve
keep if version == 3
icc avg_rat target perceiver
restore


*Version 3+2, unfiltered

preserve
keep if version == 2 | version == 3
icc avg_rat target perceiver
restore

*Pooled, filtered by TRR

preserve
keep if trr >= .85
icc avg_rat target perceiver, cons
restore

*Pooled, filtered by qual-check

preserve
drop if qual_check > .3
icc avg_rat target perceiver, cons
restore

*Pooled, filtered by qual-check & TRR

preserve
drop if qual_check > .4
keep if trr >= .7
icc avg_rat target perceiver, cons
restore

*Version 2 & 3, filtered by qual-check & TRR
preserve
keep if version == 2
*keep if version == 2 | version == 3
*drop if qual_check > .4
keep if trr >= .8
icc avg_rat target perceiver, cons
restore



preserve
*keep if version == 1
*keep if version == 2
*keep if version == 3
*keep if version == 2 | version == 3
*keep if version == 1 | version == 2
*keep if version == 1 | version == 3
keep if trr >= .85
drop if qual_check > .4
icc rating target perceiver
icc avg_rat target perceiver
restore

return list

***Getting ICCs***
/*
preserve

keep if version == 1
icc rating target perceiver

restore

*/








 


