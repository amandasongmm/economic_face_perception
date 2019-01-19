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

    var view_time = 300; // miliseconds.
    var task_payment = 0.5; //
    var task_version = 1; // create a mapping and specify the detailed operations and changes in each version.
    var task_name = 'aggressive-gt';


    var each_chuck_img_num = 10; // 10
    var require_or_not = true;
    var iter_total = 10;  // 5 for 50 unique trials. 10
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
    var page_1 = '<h2>Welcome to the face aggressiveness rating HIT!</h2> ' +
		'<p>Your task is to guess <strong>how aggressive</strong> a person looks in most people\'s eyes.</p>' +
        '<p> Rate each face on a <strong>1-9</strong> scale.</p>' +
    '<p>Try to make sense of what most people think and we will compare your response with others.</p>';

    // var page_2 = '<p>Please examine the faces carefully before proceeding.</p>' +
		//  // '<p> You may take as long as you need to answer each question.</p>' +
	 //    	 '<p> The <strong>closer</strong> your responses are to other people, the <strong>better</strong>.</p>' +
    //     '<p>If your reaction is similar to the majority group, you may get invited for future studies with bonus options.</p>';

    var page_3 = '<p>You will see 100 faces. You may see the same face more than once.</p>' +
        '<p> Watch carefully and make consistent choices.</p>' +
        '<p>Your HIT will be accepted if more than <b>80%</b> of your responses align with the majority <b>and</b> more than <b>70%</b> of your ' +
        'own choices are consistent with yourself.</p>';

    var page_4 = '<p>You will get a quick notice about your progress after every 10 faces.</p>' +
        '<p>Try to use the <b>full 1-9 scale</b> and rate people <b>all the way</b> from 1 to 9. </p>' +
        '<p>Do not press until the face is loaded.</p>' +
        '<p>Use your intuition and have fun!</p>';

    var instruction_block = {
        type: 'instructions',
        pages: [page_1, page_3, page_4],
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
            'Associate degree (e.g. AA, AS)', 'Bachelor’s degree (e.g. BA, BS) or above'],
        required: require_or_not};

    var q_income = {
    	prompt: 'What is the total income of all members of your household?',
        options: ['Less than $20,000', '$20,000  - $49,999',
            '$50,000 - $74,999', '$75,000 and above'],
        required: require_or_not};

    var demographic_block = {
        type: 'survey-multi-choice',

        questions: [q_age, q_gender, q_hispanic, q_attention, q_race,  q_education, q_income],
        preamble: "We'd like to know something about you :)",
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
        preamble: 'Last question and you are good to go!',
        data: {task_type: 'demographics_location'}

    };

    /*==========================================================================
     *                        Comprehension Check
     * ========================================================================= */
    // var target_question = "<p><strong>" +
    //     "How aggressive does this person look to you?</strong></p>";
    //
    // var bold_phrase = 'How aggressive does this person look to you?';

    // var comprehension_question = {
    //     type: 'survey-text-req',
    //     questions: [target_question],
    //     rows: [3],
    //     columns: [150],
    //     required: [require_or_not],
    //     button_label: 'Continue',
    //     placeholders: ['How aggressive does this person look to you?'],
    //     preamble: '<p>Below is the question you will see for the rest of the task.</p>' +
    //     '<p><strong>Enter the whole sentence word for word </strong>(including the question mark) to continue.</p> ',
    //     data: {task_type: 'question comprehension'},
    //     on_finish: function(data) {
    //         var resp = JSON.parse(data.responses).Q0;
    //         if (resp==bold_phrase) {
    //             data.comprehension_check_continue = true;
    //         }
    //         else {
    //             alert('Pay attention and type in the whole question word for word.');
    //             data.comprehension_check_continue = false;
    //         }
    //     }
    //
    // };

    // var comprehension_loop_node = {
    //     timeline: [comprehension_question],
    //     loop_function: function(data) {
    //
    //         if (data.values()[0]['comprehension_check_continue']) {
    //             return false
    //         }
    //         else {
    //             return true
    //         }
    //     }
    // };

/*==========================================================================
 *                           empty face
 * ========================================================================= */
var prompty_que = '<p>How <b>aggressive</b> does this person look? Rate from 1-9</p>';

var labels = ["1 <br/>Not aggressive at all",
             "2", "3", "4", "5", "6", "7", "8",
             "9  <br/>Extremely aggressive"];


// function empty_face(second_round_or_not) {
//
//     var empty_face_trial = {
//         type: 'face-likert-amanda',
//         questions: [{
//             prompt: prompty_que,
//             labels: labels,
//             required: true
//         }],
//         imgname: '/static/images/faces/empty-image-1.jpg',
//         preamble: 'This face is left empty on purpose. Just imagine this is an average face.',
//         isRepeat: second_round_or_not,
//         data: {task_type: 'empty face'}
//
//     };
//
//     timeline.push(empty_face_trial);
//
// }

// /* More instruction */
//     var page_5 = "<p>Next, you will see similar questions, but with real people's faces.</p>" +
//         "<p>Try to use the entire 1-9 scale for the 100 faces you will see.</p>";
//
//     var instruction_block2 = {
//         type: 'instructions',
//         pages: [page_5],
//         show_clickable_nav: true
//     };

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
        prompt: 'You have finished '+ (iter+1) + '/' + iter_total +' of the task',
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
        stimulus: '<p>Rest for 5 seconds! :)</p>',
        trial_duration: 5000
    };



/*==========================================================================
 *                           FEEDBACK for the interview invitation decision
 * ========================================================================= */
 var feedback_for_interview = {
     type: 'survey-text-req',
     questions: ['What features do you use to judge aggressiveness?',
         'What type of faces do you give high scores?',
         'What type of faces do you give low scores?',
         'Are there any pages in which the face photo are not loaded properly (or take a long time to load)?',
         "Is there anything else you want to share with us?"],
     rows: [4, 4, 4, 4, 4],
     columns: [100, 100, 100, 100, 100],
     required: [require_or_not, require_or_not, require_or_not, require_or_not, require_or_not],
     button_label: 'Continue',
     placeholders: ["e.g. I check on the face ratio and skin smoothness and expression.",
         "e.g. I like it when they wear genuine smiles on the face. etc.",
         "e.g. I gave low ratings to people who look gloomy. etc.",
         "e.g. Yes, I am very consistent " +
         "e.g. Yes, sometimes it took a long time to load.",
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
     preamble: 'This is the last question!',
     data: {task_type: 'feedback for HIT'}
    };


/*==========================================================================
 *                           RUN JSPSYCH
 * ========================================================================= */

timeline.push(instruction_block);

timeline.push(demographic_node);
// timeline.push(empty_face_trial);
//     empty_face(0);

// timeline.push(instruction_block2);

// actual face-trails
for (iter=0; iter<iter_total; iter++) {repeat_trial(iter, 0)}
// timeline.push(long_break);

// // Shuffle and then repeat
//     empty_face(1);
// test_lst = shuffle(test_lst);
// for (iter=0; iter<iter_total; iter++) {repeat_trial(iter, 1)}


timeline.push(location_questions);
// timeline.push(comprehension_loop_node);

// // feedback for the interview decision making process
// timeline.push(feedback_for_interview);
// // timeline.push(future_invitation);
//
// // feedback for the overall HIT
// timeline.push(feedback_for_hit);

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