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
    var task_payment = 2; //

    var each_chuck_img_num = 10;
    var iter_total = 4;  // 2 or 4. 2 for the 40 unique trials, 4 for the 80 unique trials
    var unique_trial_num = each_chuck_img_num * iter_total;

    var test_lst = all_lst.slice(0, unique_trial_num);
    test_lst = shuffle(test_lst);
    var require_or_not = true;





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
    var page_1 = '<h2>Welcome to the face perception experiment!</h2> ' +
		'<p>In this experiment, you will see a number of facial images. </p> ' +
		'<p>Your task is to indicate <strong>your belief</strong> about the person in the picture. </p>';
	
    var page_2 = '<p>Please read the questions carefully and make sure you understand them before proceeding.</p>' +
		 '<p> You may take as long as you need to answer each question.</p>' +
		 '<p> <strong>Your responses</strong> will be compared with those of <strong>other</strong> participants.</p>' +
	    	 '<p> The <strong>closer</strong> you are to the average of everyone else, the <strong>better</strong>.</p>';

    var page_3 = '<p>The experiment takes on average 10-15 minutes to finish, you will view 80 faces in total.</p>' +
        '<p>You will have a short break after every 10 faces. You need to finish them within 30 minutes to finish.</p>' +
        '<p>It will automatically close after 30 minutes so if you don’t finish it in 30 minutes, you won’t get paid.';

    var page_4 = '<p><b>Please study the face for at least 1 second before selecting. You will not be able to respond ' +
        'to the question until 1 second has passed. Good Luck and have fun</b></p>';

    var instruction_block = {
        type: 'instructions',
        pages: [page_1, page_2, page_3, page_4],
        show_clickable_nav: true
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
        prompt: 'What is the highest degree or level of school you have completed? (If you’re currently enrolled in school, please indicate the highest degree you have received?',
        options: ['Less than a high school diploma', 'High school degree or equivalent (e.g. GED)', 'Some college, no degree',
            'Associate degree (e.g. AA, AS)', 'Bachelor’s degree (e.g. BA, BS)', 'Professional or ppost-baccalauriate degree'],
        required: require_or_not};

    var demographic_block = {
        type: 'survey-multi-choice',

        questions: [q_age, q_gender, q_hispanic, q_attention, q_race,  q_education],
        preamble: "Before we start, we'd like to know something about you :)",
        data: {random_num: random_num, payment: task_payment, total_unique_trials: unique_trial_num},
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
    };

    /*==========================================================================
     *                        Comprehension Check
     * ========================================================================= */
    var target_question = "<p>How willing or unwilling do you think this person is to <strong>take risks</strong>?</p>";
    var bold_phrase = 'How willing or unwilling do you think this person is to take risks?';

    var comprehension_question = {
        type: 'survey-text-req',
        questions: [target_question],
        rows: [3],
        columns: [150],
        required: [require_or_not],
        button_label: 'Continue',
        placeholders: [bold_phrase],
        preamble: '<p>Below is the question you will see for the rest of the task.</p>' +
        '<p>Enter the whole sentence <strong>word for word</strong>(including the question mark) to continue.</p> ',
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
var prompty_que = '<p>How willing or unwilling do you think this person is to take risks? Rate from 1-9</p>';

var labels = ["1 <br/>(Completely unwilling to take risks)",
             "2", "3", "4", "5", "6", "7", "8",
             "9  <br/>(Very willing to take risks)"];

var empty_face_trial = {
    type: 'face-likert-amanda',
    questions: [{
        prompt: prompty_que,
        labels: labels,
        required: true
    }],
    imgname: '/static/images/faces/empty-image-1.jpg',
    preamble: 'This face is left empty on purpose. Just imagine this is a random person.',

};


/* More instruction */
    var page_5 = "<h2>Next, you will see similar questions, but each question comes with a real person's face.</h2>";

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
        //on_start: sleep(5000),
        type: 'face-likert-amanda',
        questions: [
            {prompt: prompty_que,
                labels: labels,
                required: true,
            }],
        timeline: test_lst.slice(iter*each_chuck_img_num, (iter+1)*each_chuck_img_num),
        randomize_order: true,
        isRepeat: second_round_or_not
    };

    var break_trial = {
        type: 'html-keyboard-response',
        prompt: 'You have finished '+ (iter+1+second_round_or_not*iter_total) + '/' + iter_total * 2 +' of the task',
        stimulus: '<p>Good job! Let us take a quick break!</p>',
        trial_duration: function () {
            return jsPsych.randomization.sampleWithReplacement([750, 1000, 2000], 1)[0];
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
        stimulus: '<p>Enjoy a longer break :)</p>',
        trial_duration: 2500,
    };
/*==========================================================================
 *                           FEEDBACK
 * ========================================================================= */
 var feedback = {
    type: 'survey-text',
    questions: [
        {prompt: 'If you have any feedback you would like to give to us, please write them here. Otherwise click continue to finish the experiment.'}
        ]
    }
/*==========================================================================
 *                           RUN JSPSYCH
 * ========================================================================= */

timeline.push(instruction_block);
timeline.push(demographic_node);
timeline.push(location_questions);
timeline.push(comprehension_loop_node);
timeline.push(empty_face_trial);
timeline.push(instruction_block2);

// actual face-trails
for (iter=0; iter<iter_total; iter++) {repeat_trial(iter, 0)}
timeline.push(long_break);

// Shuffle and then repeat
test_lst = shuffle(test_lst);
for (iter=0; iter<iter_total; iter++) {repeat_trial(iter, 1)}

timeline.push(feedback)

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
