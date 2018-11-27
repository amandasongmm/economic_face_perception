    /*==========================================================================
     *                               Shuffle
     * ========================================================================= */

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// https://stackoverflow.com/questions/16873323/javascript-sleep-wait-before-continuing/16873849
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}



    /*==========================================================================
     *                               Experiment Parameters
     * ========================================================================= */


    var exp_mode = 'live'; // 'debug', 'sandbox', 'live'

    var view_time = 300; // miliseconds. 200
    var task_payment = 1.2; //
    var task_version = 2; // create a mapping and specify the detailed operations and changes in each version.
    var task_name = 'interview decision';


    var each_chuck_img_num = 10; // 10
    var require_or_not = true;
    var iter_total = 5;  // 5 for 50 unique trials.
    var unique_trial_num = each_chuck_img_num * iter_total;

    var test_lst = all_lst.slice(0, unique_trial_num);
    test_lst = shuffle(test_lst);


    jsPsych.data.addProperties({
        debug_mode: exp_mode,
        task_name: task_name,
        task_version: task_version,
        task_payment: task_payment,
        task_unique_trial: unique_trial_num
});


    /*==========================================================================
     *                               SETUP
     * ========================================================================= */

    /* load psiturk */
    var psiturk = new PsiTurk(uniqueId, adServerLoc, mode);
    var timeline = [];


    /*==========================================================================
     *                           INSTRUCTIONS
     * ========================================================================= */

    /* welcome message */
    var page_1 = '<h2>Welcome to the face interview experiment!</h2> ' +
		'<p>In this experiment, you will see a number of facial photos. </p> ' +
		'<p>Your task is to indicate <strong>your preference</strong> about the person in the picture. </p>';

    var page_2 = '<p>Please read the questions carefully before proceeding.</p>' +
		 // '<p> You may take as long as you need to answer each question.</p>' +
	    	 '<p> The <strong>closer</strong> your responses are to other people, the <strong>better</strong>.</p>' +
        '<p>If your reaction is similar to the majority group, you may get invited for future studies with bonus options.</p>';

    var page_3 = '<p>The experiment takes on average <strong>10-20</strong> minutes to finish.</p>' +
        '<p>You need to finish them <strong>within 30</strong> minutes.</p>' +
        '<p>It will automatically close after 30 minutes. If you don’t finish it within time, you won’t get paid.';

    var page_4 = '<p><b>Please examine the faces carefully before making decisions.</b></p>' +
        '<p>You will get a quick notice about your progress after every 10 faces.</p>' +
        '<p>Good Luck and have fun!</p>';

    var instruction_block = {
        type: 'instructions',
        pages: [page_1, page_2, page_3, page_4],
        show_clickable_nav: true,
        data: {task_type: 'instruction'}
    };

    /*==========================================================================
     *                           DEMOGRAPHICS
     * ========================================================================= */

    var random_num = Math.floor(Math.random()*4+1);

    var q_attention = {
        prompt: 'Please choose the option that match the number here: ' + random_num,
        options: ["1", "2", "3", "4"],
        required: true
    };

    var q_age = {
        prompt: 'What is your age?',
        options: ['Under 18', '18-25', '26-35', '36-45', '46-55', '56+'],
        required: require_or_not};

    var q_gender = {
        prompt: 'What is your gender?',
        options: ['Male', 'Female', 'Other/Prefer not to say'],
        required: require_or_not};

    var q_hispanic = {
        prompt: 'Are you of Hispanic, Latino, or Spanish origin?',
        options: ['Yes', 'No'],
        required: require_or_not};

    var q_race = {
        prompt: 'How would you describe yourself?',
        options: ['American Indian or Alaskan Native', 'Asian', 'Black or African-American', 'Native Hawaiian or Other Pacific Islander', 'White'],
        required: require_or_not};

    var q_education = {
        prompt: 'What is the highest degree or level of school you have completed? (If you’re currently enrolled in school, please indicate the highest degree you have received)',
        options: ['Less than a high school diploma', 'High school degree or equivalent (e.g. GED)', 'Some college, no degree',
            'Associate degree (e.g. AA, AS)', 'Bachelor’s degree (e.g. BA, BS)', 'Professional or post-baccalauriate degree'],
        required: require_or_not};

    var q_income = {
    	prompt: 'What is the total income of all members of your household?',
        options: ['Less than $20,000', '$20,000 - $34,999', '$35,000 - $49,999',
            '$50,000 - $74,999', '$75,000 - $99,999', 'Over $100,000'],
        required: require_or_not};

    var demographic_block = {
        type: 'survey-multi-choice',

        questions: [q_age, q_gender, q_hispanic, q_attention, q_race,  q_education, q_income],
        preamble: "Before we start, we'd like to know something about you :)",
        data: {random_num: random_num, task_type: 'demographic-multichoice'},

        on_finish: function(data) {
            var resp = JSON.parse(data.responses).Q3;

            if (resp==random_num) {
                data.sanity_check_1_continue = true;
            }
            else {
                alert('Pay attention to the questions here and answer again!');
                data.sanity_check_1_continue = false;
            }

        }
    };

    var demographic_node = {
        timeline: [demographic_block],
        loop_function: function(data) {
            if (data.values()[0]['sanity_check_1_continue']) {
                return false
            }
            else {
                return true
            }
        }
    };

    /*==========================================================================
     *                        Location Check
     * ========================================================================= */

    var state_question = 'What state do you live in?';
    var location_question = 'Which city do you live in?';
    var zipcode_question = 'What is your zipcode?';
    var location_questions = {
        type: 'survey-text-req',
        questions: [state_question, location_question, zipcode_question],
        rows: [1, 1, 1],
        columns: [30, 30, 30],
        required: [require_or_not, require_or_not, require_or_not],
        button_label: 'Continue',
        placeholders: ['e.g. CA', 'e.g. San Diego', 'e.g. 92037'],
        preamble: 'Please tell us where you are located...',
        data: {task_type: 'demographics_location'}

    };

    /*==========================================================================
     *                        Comprehension Check
     * ========================================================================= */
    var target_question = "<p>Imagine you are an interviewer and you are screening candidates profile photos.</p><p><font color='red'>" +
        "How much would you like to invite this person for a " +
        "<strong>job interview</strong>?</font></p>";

    var bold_phrase = 'How much would you like to invite this person for a job interview?';

    var comprehension_question = {
        type: 'survey-text-req',
        questions: [target_question],
        rows: [3],
        columns: [150],
        required: [require_or_not],
        button_label: 'Continue',
        placeholders: ['How much would you like to invite this person for a job interview?'],
        preamble: '<p>Below is the question you will see for the rest of the task.</p>' +
        '<p><strong>Enter the whole sentence in red word for word </strong>(including the question mark) to continue.</p> ',
        data: {task_type: 'question comprehension'},
        on_finish: function(data) {
            var resp = JSON.parse(data.responses).Q0;
            if (resp==bold_phrase) {
                data.comprehension_check_continue = true;
            }
            else {
                alert('Pay attention and type in the whole question word for word.');
                data.comprehension_check_continue = false;
            }
        }

    };

    var comprehension_loop_node = {
        timeline: [comprehension_question],
        loop_function: function(data) {

            if (data.values()[0]['comprehension_check_continue']) {
                return false
            }
            else {
                return true
            }
        }
    };

/*==========================================================================
 *                           empty face
 * ========================================================================= */
var prompty_que = '<p>How much would you like to invite this person for a job interview? Rate from 1-9</p>';

var labels = ["1 <br/>(Completely unwilling to invite the person)",
             "2", "3", "4", "5", "6", "7", "8",
             "9  <br/>(Very willing to invite the person)"];


function empty_face(second_round_or_not) {

    var empty_face_trial = {
        type: 'face-likert-amanda',
        questions: [{
            prompt: prompty_que,
            labels: labels,
            required: true
        }],
        imgname: '/static/images/faces/empty-image-1.jpg',
        preamble: 'This face is left empty on purpose. Just imagine this is an average person.',
        isRepeat: second_round_or_not,
        data: {task_type: 'empty face'}

    };

    timeline.push(empty_face_trial);

}

/* More instruction */
    var page_5 = "<h2>Next, you will see similar questions, but with real people's faces.</h2>";

    var instruction_block2 = {
        type: 'instructions',
        pages: [page_5],
        show_clickable_nav: true
    };

/*==========================================================================
 *                           For loop
 * ========================================================================= */

function repeat_trial(iter, second_round_or_not) {

    var face_likert_trials = {
        on_start: sleep(view_time),
        type: 'face-likert-amanda',
        questions: [
            {prompt: prompty_que,
                labels: labels,
                required: true
            }],
        timeline: test_lst.slice(iter*each_chuck_img_num, (iter+1)*each_chuck_img_num),
        randomize_order: true,
        isRepeat: second_round_or_not,
        data: {task_type: 'face trials'}
    };

    var break_trial = {
        type: 'html-keyboard-response',
        prompt: 'You have finished '+ (iter+1+second_round_or_not*iter_total) + '/' + iter_total * 2 +' of the task',
        stimulus: '<p>Good job!</p>',
        trial_duration: function () {
            return jsPsych.randomization.sampleWithReplacement([1000, 1500, 2000], 1)[0];
        }
    };

    var nested_timeline = {
        timeline: [face_likert_trials, break_trial],
        };

    timeline.push(nested_timeline)
}


    var long_break = {
        type: 'html-keyboard-response',
        prompt: 'Half way there! Well done!',
        stimulus: '<p>Enjoy a 5 seconds break :)</p>',
        trial_duration: 5000
    };



/*==========================================================================
 *                           FEEDBACK for the interview invitation decision
 * ========================================================================= */
 var feedback_for_interview = {
     type: 'survey-text-req',
     questions: ['What criteria do you use to make the interview invitation decisions?',
         'What type of people will make you want to invite?',
         'What type of people make you unwilling to invite?',
         'Do you think you are consistent (make the same decision given the same face) among the task?',
         "Is there anything else you want to share with us?"],
     rows: [4, 4, 4, 4, 4],
     columns: [100, 100, 100, 100, 100],
     required: [require_or_not, require_or_not, require_or_not, require_or_not, require_or_not],
     button_label: 'Continue',
     placeholders: ["e.g. I will use my first impression on them to make the decision",
         "e.g. I like it when they wear genuine smiles on the face. etc.",
         "e.g. I don't feel like inviting people who look gloomy. etc.",
         "e.g. Yes, I am very consistent, I use the same criteria./ No, it largely depend on my mood/ " +
         "I am not sure whether I am self-consistent",
         "e.g. Anything else, my dear friend?"],
     preamble: 'Could you tell us how you make these decisions?',
     data: {task_type: 'interview decision making feedback'}
    };



 /*==========================================================================
 *                           FEEDBACK for future following studies
 * ========================================================================= */
 var future_invitation = {
    type: 'survey-multi-choice',
    questions: [
        {prompt: 'Would you like to be invited for similar future studies?', options: ['Yes', 'No'],
            required: require_or_not
        }
        ],
     preamble: '',
     data: {task_type: 'feedback for future study'}
    };

/*==========================================================================
 *                           FEEDBACK for the HIT
 * ========================================================================= */


var feedback_for_hit = {
     type: 'survey-text-req',
     questions: ['How do you like this HIT? Interesting? Boring? Confusing? Fun? Do you think you are fairly paid? Tell us anything you like.'],
     rows: [4],
     columns: [100],
     required: [false],
     button_label: 'Continue',
     placeholders: ["e.g. it's fun. I would love to do a similar task again."],
     preamble: 'Last question!',
     data: {task_type: 'feedback for HIT'}
    };


/*==========================================================================
 *                           RUN JSPSYCH
 * ========================================================================= */

timeline.push(instruction_block);
timeline.push(demographic_node);
timeline.push(location_questions);
timeline.push(comprehension_loop_node);

// timeline.push(empty_face_trial);
    empty_face(0);

timeline.push(instruction_block2);

// actual face-trails
for (iter=0; iter<iter_total; iter++) {repeat_trial(iter, 0)}
timeline.push(long_break);

// Shuffle and then repeat
    empty_face(1);
test_lst = shuffle(test_lst);
for (iter=0; iter<iter_total; iter++) {repeat_trial(iter, 1)}

// feedback for the interview decision making process
timeline.push(feedback_for_interview);
// timeline.push(future_invitation);

// feedback for the overall HIT
timeline.push(feedback_for_hit);

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
	}
});
