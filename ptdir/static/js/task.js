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
// Functions
/*==========================================================================
 *                          PRISDIL (BASE MEASURE)
 * ========================================================================= */
var pd_params = [16,10,18,8]
var prisdil_questions = ["You can see the other person’s picture, but they cannot see yours. Do you think they will:", "Would you:"];
var prisdil_continuous_questions = ["You can see the other person’s picture, but they cannot see yours. SPECIFY QUESTION HERE:", "Would you:"];
// definiting two different response scales that can be used.
var prisdil_options = ["Play A", "Play B"];
// defining groups of questions that will go together.

var scale_0to10 = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
var scale_1to9 = ["1 (not at all)", "2", "3", "4", "5", "6", "7", "8", "9 (very)"]
var scale_risk1 = scale_0to10.slice() //create a new "deep copy" (see https://stackoverflow.com/questions/7486085/copy-array-by-value)
scale_risk1[0] = "0 (Completely unwilling to take risks)"
scale_risk1[10] = "10 (Very willing to take risks)"
var scale_time1 = scale_0to10.slice()
scale_time1[0] = "0 (Completely unwilling to do so)"
scale_time1[10] = "10 (Very willing to do so)"
var scale_trust = scale_0to10.slice()
scale_trust[0] = "0 (Does not describe them at all)"
scale_trust[10] = "10 (Describes them perfectly)"

function prisDil1(imgNm) {
	var prisDil_block_alter = {
		//type: 'face-multi-choice',
		type: 'face-prisdil-continuous',
		questions: [{prompt: prisdil_continuous_questions[0], options: prisdil_options, required:true,horizontal:false}],
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
function prisDil2(imgNm) {
    var prisDil_block_ego = {
    		type: 'face-multi-choice',
    		questions: [{prompt: prisdil_questions[1], options: prisdil_options, required:true,horizontal:false}],
    		imgname: imgNm,
    		prisdil_params: [16,10,18,8]
    	};
    timeline.push(prisDil_block_ego);
}

/*==========================================================================
 *                           FACE LIKERTS
 * ========================================================================= */
//------------------------- Risk 1 -----------------------------------------
function risk(imgNm) {
	var likert_risk = {
		type: 'face-likert',
		questions: [{prompt: "How willing or unwilling do you think this person is to take risks?" , labels: scale_risk1, required: true}],
		imgname: imgNm
	};
	timeline.push(likert_risk);
}
//------------------------- Time 1 -----------------------------------------
function time(imgNm) {
	var likert_time = {
		type: 'face-likert',
		questions: [{prompt: "How willing do you think this person is to give up something that is beneficial for them today in order to benefit more in the future?" , labels: scale_time1, required: true}],
		imgname: imgNm
	};
	timeline.push(likert_time);
}
//------------------------- Altruism 2 -----------------------------------------
function altruism(imgNm) {
	var likert_altruism = {
		type: 'face-likert',
		questions: [{prompt: "How willing do you think this person is to give to good causes without expecting anything in return?" , labels: scale_time1, required: true}],
		imgname: imgNm
	};
	timeline.push(likert_altruism);
}
//------------------------- Trust -----------------------------------------
function trust(imgNm) {
    	var likert_trust = {
    		type: 'face-likert',
    		questions: [{prompt: "<i>Please tell us how well you think the following statement describes this person:</i> they assume that people have only the best intentions." , labels: scale_trust, required: true}],
    		imgname: imgNm
    	};
    	timeline.push(likert_trust);
}
//------------------- Negative Reciprocity 1 -----------------------------------
function negRec(imgNm) {
	var likert_negrec = {
		type: 'face-likert',
		questions: [{prompt: "How willing do you think this person is to punish someone who treats <b>them</b> unfairly, even if there may be costs to themselves?" , labels: scale_time1, required: true}],
		imgname: imgNm
	};
	timeline.push(likert_negrec);
}
//------------------- Positive reciprocity 1 -----------------------------------
function posRec(imgNm) {
	var likert_posrec = {
		type: 'face-likert',
		questions: [{prompt: "<i>Please tell us how well you think the following statement describes this person:</i> when someone does them a favor they are willing to return it." , labels: scale_trust, required: true}],
		imgname: imgNm
	};
	timeline.push(likert_posrec);
}
//------------------ De Bruin: attractiveness --------------------------------
function attractiveness(imgNm) {
	var likert_attractiveness = {
		type: 'face-likert',
		questions: [{prompt: "How attractive (i.e., appealing to the senses through beauty, form, character, etc) is this person?", labels: scale_1to9, required: true}],
		imgname: imgNm
	}
	timeline.push(likert_attractiveness);
}
/*==========================================================================
 *                           INSTRUCTIONS
 * ========================================================================= */
var instructions_block = {
	type: 'instructions',
	pages: [
		'Welcome to the experiment. Click next to begin.'
		//'This is the second page of instructions.',
		//'This is the final page.'
	],
	show_clickable_nav: true
}

timeline.push(instructions_block);


/*==========================================================================
 *                           DEMOGRAPHICS
 * ========================================================================= */
var q_age = {prompt: "What is your age?", options: ["Under 18", "18-25", "26-35", "36-45", "Over 46"], required: true}
var q_gender = {prompt: "What is your gender?", options: ["Male","Female","Non-Binary"], required:true}
var q_ethnicity = {prompt: "What is your ethnicity?", options: ["Asian", "Black", " Hispanic", "White",  "Other"], required:true}
var q_education = {prompt: "What is the highest level of education you have achieved?", options: ["No schooling completed","Nursery school to 8th grade","Some high school or GED", "Associate degree", "Bachelor’s degree", "Master’s degree", "Professional degree", "Doctorate degree"], required:true}
var rNum = Math.floor(Math.random() * 5 + 1);
var q_attention = {prompt: "What is the following number: " + rNum, options: ["1","2","3","4","5"], required:true}

var demog_block = {
	type: 'survey-multi-choice',
	questions: [q_age, q_gender, q_ethnicity, q_education, q_attention],
	qAttNum: rNum
}

//timeline.push(demog_block);

/*==========================================================================
 *                          PRISDIL (NO FACE, VERIFYING UNDERSTANDING)
 * ========================================================================= */
var prisdil_understanding_question = "If the other person chooses A and you choose B, what does the other person get?";
var prisDil_understanding_block = {
    type: 'face-multi-choice',
    questions: [{
        prompt: prisdil_understanding_question,
        options: prisdil_options,
        required:true, horizontal:false
     }],
     imgname: 'EmptyFace.jpg'
    }
timeline.push(prisDil_understanding_block)
/*
var prisDil_understanding_block = {
	type: 'prisdil-no-face',
	questions: [{
		prompt: prisdil_understanding_question,
		options: ["$"+pd_params[0],"$"+pd_params[1],"$"+pd_params[2],"$"+pd_params[3]],
		required: true,horizontal:false}],
	imgname: 'EmptyFace.jpg',
	prisdil_params: [16,10,18,8]
}*/

timeline.push(prisDil_understanding_block)

for (imgIter=0; imgIter<f; imgIter++){
	myImg = myImgs[imgIter]
	prisDil1(myImg);
	prisDil2(myImg);
	risk(myImg);
    time(myImg);
    altruism(myImg);
    trust(myImg);
    negRec(myImg);
    posRec(myImg);
    attractiveness(myImg);
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
