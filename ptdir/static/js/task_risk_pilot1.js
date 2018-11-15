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


    var each_chuck_img_num = 2;
    var iter_total = 2;  // iter_end = 4
    var unique_trial_num = each_chuck_img_num * iter_total;

    var test_lst = all_lst.slice(0, unique_trial_num);
    test_lst = shuffle(test_lst);



    /*==========================================================================
     *                               SETUP
     * ========================================================================= */

    /* load psiturk */
    var psiturk = new PsiTurk(uniqueId, adServerLoc, mode);
    var timeline = [];
    var require_or_not = false;

    /*==========================================================================
     *                           INSTRUCTIONS
     * ========================================================================= */

    /* welcome message */
    var page_1 = '<h2>Welcome to the face game!</h2> ' +
		'<p> <strong>High quality data</strong> is crucial to us.</p>' +
		'<p> <strong>Your responses</strong> will be compared with <strong>other</strong> participants.</p>' +
        '<p> The <strong>closer</strong> you are to the group average, the <strong>better</strong>.</p>';

    var page_2 = '<p>In this game, you will see a number of face photos. </p> ' +
        '<p>Your task is to indicate <strong>your belief</strong> about a person based on the face photo. </p>' +
        '<p>Read the question carefully and make sure you understand it before proceeding.</p>';

    var page_3 = '<p>The task will take about 10-15 minutes.</p><p>Good luck and have fun!</p>';

    var instruction_block = {
        type: 'instructions',
        pages: [page_1, page_2, page_3],
        show_clickable_nav: true
    };

    /*==========================================================================
     *                           DEMOGRAPHICS
     * ========================================================================= */

    var random_num = Math.floor(Math.random()*4+1);

    var q_attention = {
        prompt: 'Choose the option that matches the number here: ' + random_num,
        options: ["1", "2", "3", "4"],
        required: true
    };

    var q_age = {
        prompt: 'What is your age?',
        options: ['Under 18', '18-25', '26-35', '36-45', 'Over 46'],
        required: require_or_not};

    var q_gender = {
        prompt: 'What is your gender?',
        options: ['Male', 'Female', 'Non-binary'],
        required: require_or_not};

    var q_ethnicity = {
        prompt: 'What is your ethnicity?',
        options: ['Caucasian', 'Hispanic or Latino', 'African', 'Asian', 'Native American', 'Other'],
        required: require_or_not};

    var q_education = {
        prompt: 'What is the highest level of education you have achieved?',
        options: ['No school completed', 'Some high school or nursery school', 'College or bachelor degree',
            'Master degree', 'Doctorate degree or professional degree'],
        required: require_or_not};

    var demographic_block = {
        type: 'survey-multi-choice',
        questions: [q_age, q_gender,  q_ethnicity, q_attention, q_education],
        preamble: "Before we start, we'd like to know something about you :)",
        data: {random_num: random_num},
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
    var state_question = 'Which state do you live?';
    var location_question = 'Which city do you live?';
    var zip_question = "What is your area's zipcode?";

    var location_questions = {
        type: 'survey-text-req',
        questions: [state_question, location_question, zip_question],
        rows: [1, 1, 1],
        columns: [30, 30, 30],
        required: [true, true, true],
        button_label: 'Continue',
        placeholders: ['e.g. CA', 'e.g. San Diego', 'e.g.92122'],
        preamble: 'A little bit more about you...',
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
        required: [true],
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
    imgname: '/static/images/faces/empty-image-1.jpg'

};


/* More instruction */
    var page_4 = "<h2>Next, you will see similar questions, but each question comes with a real person's face.</h2>";

    var instruction_block2 = {
        type: 'instructions',
        pages: [page_4],
        show_clickable_nav: true
    };

/*==========================================================================
 *                           For loop
 * ========================================================================= */

function repeat_trial(iter, second_round_or_not) {

    var face_likert_trials = {
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