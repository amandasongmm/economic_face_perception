//original source: https://github.com/alexanderrich/stroop-jspsych

/*==========================================================================
 *                               SETUP
 * ========================================================================= */
/* load psiturk */
var psiturk = new PsiTurk(uniqueId, adServerLoc, mode);
var timeline = [];

/* load all images and pick f of them */
// Problem: Get all the filenames in a directory the normal way. PHP -> JS-AJAX.
// Quick fix - get the all file names from python script. Copy and paste it here
// Use command-f to look for a specific file
// jspsych-face-likert.js images now linked towards the 2kfaces directory instead
var images_list = ['Google_1_Paul Reno_1_oval.jpg',
    'Google_1_Sara Guajardo_1_oval.jpg', 'Google_1_Gertrude Bayne_11_oval.jpg']

var f = 3; //number of faces displayed

/* insert fixed face */
var fixed = [];

/* insert number of random repetitions*/
var n = 1;

//shuffle the images array before taking the first f images
//(source: https://www.frankmitchell.org/2015/01/fisher-yates/)
var i = 0, j = 0, temp = null;
for (i = images_list.length - 1; i > 0; i -= 1) {
	j = Math.floor(Math.random() * (i + 1))
	temp = images_list[i]
	images_list[i] = images_list[j]
	images_list[j] = temp
}

myImgs = images_list.slice(0,f);

/*==========================================================================
 *                           INSTRUCTIONS
 * ========================================================================= */

var instructions_block = {
	type: 'instructions',
	pages: [
		'Welcome to the face reading experiment. You will play some economic games and see a number of faces. You task is to indicate your belief about the person based on the face photo.\n' +
		'Read each question carefully and indicate your well-thought decisions.' +
		'\nYour responses will be compared with other participants. \n' +
		'There will be bonus and punishment depending on how close your responses are to the group average. The closer your responses are to the group average, the better. '
		//'This is the second page of instructions.',
		//'This is the final page.'
	],
	show_clickable_nav: true
}

//timeline.push(instructions_block);


/*==========================================================================
 *                           DEMOGRAPHICS
 * ========================================================================= */

var q_age = {
    prompt: "What is your age?",
    options: ["Under 18", "18-25", "26-35", "36-45", "Over 46"],
    required: true}
var q_gender = {
    prompt: "What is your gender?",
    options: ["Male","Female","Non-Binary"],
    required:true}
var q_ethnicity = {
    prompt: "What is your ethnicity?",
    options: ["Asian", "Black", " Hispanic", "White",  "Other"],
    required:true}
var q_education = {
    prompt: "What is the highest level of education you have achieved?",
    options: ["No schooling completed","Nursery school to 8th grade","Some high school or GED", "Associate degree", "Bachelor’s degree", "Master’s degree", "Professional degree", "Doctorate degree"],
    required:true}
var q_attention = {
    // prompt is saved which contains the randomized values
    prompt: "Please select the following number: " + Math.floor(Math.random() * 5 + 1),
    options: ["1","2","3", "4", "5"],
    required:true}

 var demog_block = {
 	type: 'survey-multi-choice',
 	questions: [q_age, q_gender, q_ethnicity, q_education, q_attention]
 }

//timeline.push(demog_block);

/*==========================================================================
 *                        COMPREHENSION CHECK
 * ========================================================================= */
var question = "How willing or unwilling do you think this person is to take risks?";

var comprehension_block = {
    type: 'comprehension',
    prompt: question
}
timeline.push(comprehension_block)


/*==========================================================================
 *                           Function
 * ========================================================================= */

var scale = ["0 (Completely unwilling to take risks)",
             "1", "2", "3", "4", "5", "6", "7", "8", "9",
             "10 (Very willing to take risks)"];
function risk(imgNm) {
 	var likert_risk = {
 		type: 'face-likert',
 		questions: [{
 		    prompt: question,
 		    labels: scale,
 		    required: true}],
 		imgname: imgNm,
 		isRandom: true,
 	};
 	timeline.push(likert_risk);
 }

function nonRanRisk(imgNm) {
    var likert_risk = {
        type: 'face-likert',
        questions: [{
            prompt: question,
            labels: scale,
            required: true}],
        imgname: imgNm,
    };
    timeline.push(likert_risk);
}
function repeatRisk(imgNm) {
    var likert_risk = {
        type: 'face-likert',
        questions: [{
            prompt: question,
            labels: scale,
            required: true}],
        imgname: imgNm,
        isRepeat: false
    };
    timeline.push(likert_risk);
}

 /*==========================================================================
  *                          Push to Timeline
  * ========================================================================= */
// empty
nonRanRisk('EmptyFace.jpg')

// f number
for (imgIter=0; imgIter<f; imgIter++){
    myImg = myImgs[imgIter]
    risk(myImg)
}

// random repeat
for (imgIter=0; imgIter<n; imgIter++){
    myImg = myImgs[Math.floor(Math.random() * f)]
    repeatRisk(myImg)
}

// fixed
for (imgIter=0; imgIter<fixed.length; imgIter++){
    myImg = fixed[imgIter]
    nonRanRisk(myImg)
}

/*==========================================================================
 *                           RUN JSPSYCH
 * ========================================================================= */

jsPsych.init({
	display_element: 'jspsych-target',
	timeline: timeline,
	// record data to psiTurk after each trial
	on_data_update: function(data) {
		psiturk.recordTrialData(data);
	},
	on_finish: function() {
		// save data
        jsPsych.data.displayData();
		psiturk.saveData({
			success: function() {
				psiturk.completeHIT();
			}
		});
	},
});