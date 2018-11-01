//original source: https://github.com/alexanderrich/stroop-jspsych

/*==========================================================================
 *                               SETUP
 * ========================================================================= */
/* load psiturk */
var psiturk = new PsiTurk(uniqueId, adServerLoc, mode);
var timeline = [];

/* load images and pick f of them */
var images_list = ["0000.jpg", "0019.jpg", "0218.jpg", "0413.jpg", "0520.jpg", "0775.jpg", "0906.jpg", "0006.jpg", "0167.jpg", "0283.jpg", "0463.jpg", "0521.jpg", "0807.jpg", "1070.jpg", "0011.jpg", "0179.jpg", "0350.jpg", "0515.jpg", "0613.jpg", "0899.jpg", "1103.jpg"]
var f = 2; //number of faces displayed (all questions will be asked for each face)

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

var q_age = {prompt: "What is your age?", options: ["Under 18", "18-25", "26-35", "36-45", "Over 46"], required: true}
var q_gender = {prompt: "What is your gender?", options: ["Male","Female","Non-Binary"], required:true}
var q_ethnicity = {prompt: "What is your ethnicity?", options: ["Asian", "Black", " Hispanic", "White",  "Other"], required:true}
var q_education = {prompt: "What is the highest level of education you have achieved?", options: ["No schooling completed","Nursery school to 8th grade","Some high school or GED", "Associate degree", "Bachelor’s degree", "Master’s degree", "Professional degree", "Doctorate degree"], required:true}
var rNum = Math.floor(Math.random() * 5 + 1);
var q_attention = {prompt: "Attention question TBD", options: ["a","b","c"], required:true}  /*todo: replace it with the random number check.*/

 var demog_block = {
 	type: 'survey-multi-choice',
 	questions: [q_age, q_gender, q_ethnicity, q_education, q_attention]
 	/* todo: save the value of rNum */
 }

 //timeline.push(demog_block);


 /*==========================================================================
  *                           Function
  * ========================================================================= */
var prisdil_continuous_questions = ["You can see the other person’s picture, but they cannot see yours. SPECIFY QUESTION HERE:", "Would you:"];
// definiting two different response scales that can be used.
var prisdil_options = ["Play A", "Play B"];
// defining groups of questions that will go together.

function prisDil1(imgNm) {
    var prisDil_block_alter = {
 	    //type: 'face-multi-choice',
 		type: 'face-prisdil-continuous',
 		questions: [{
 		    prompt: prisdil_continuous_questions[0],
 		    options: prisdil_options,
 		    required:true,
 		    horizontal:false}],
 		imgname: imgNm,
 		prisdil_params: [16,10,18,8],
 		on_load: function() {
     	    var slider = document.getElementById("myRange");
 			var output = document.getElementById("slidervalue");
 			output.innerHTML = slider.value;

 			slider.oninput = function() {
 				output = document.getElementById("slidervalue");
 				output.innerHTML = this.value;
 			}
   		}
 	};
 	timeline.push(prisDil_block_alter);
 };


 /*==========================================================================
  *                          Push to Timeline
  * ========================================================================= */
for (imgIter=0; imgIter<f; imgIter++){
    myImg = myImgs[imgIter]
    prisDil1(myImg)
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
		psiturk.saveData({
			success: function() {
				psiturk.completeHIT();
			}
		});
	},
});