//original source: https://github.com/alexanderrich/stroop-jspsych


    /*==========================================================================
     *                               SETUP
     * ========================================================================= */
    /* load psiturk */
    var psiturk = new PsiTurk(uniqueId, adServerLoc, mode);
    var timeline = [];
    var require_or_not = true;

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

    var page_3 = '<p><strong>Your</strong> responses will be compared with <strong>others</strong> and ' +
        '<strong>yourself</strong>.</p>' + '<p>The task will take about 10-15 minutes.</p>' +
        '<p>Good luck and have fun!</p>';

    var instruction_block = {
        type: 'instructions',
        pages: [page_1, page_2, page_3],
        show_clickable_nav: true,
        show_progress_bar: true,
    };

    /*==========================================================================
     *                           DEMOGRAPHICS
     * ========================================================================= */

    var random_num = Math.floor(Math.random()*4+1);

    var q_attention = {
        prompt: 'Choose the choice that match the number here: ' + random_num,
        options: ["1", "2", "3", "4"],
        required: true,
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

    /* todo var q_state = {} scroll down manul to choose which state you live in */

    var demographic_block = {
        type: 'survey-multi-choice',
        questions: [q_age, q_gender,  q_ethnicity, q_attention, q_education],
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

        },
        show_progress_bar: true
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

    var location_questions = {
        type: 'survey-text-req',
        questions: [state_question, location_question],
        rows: [1, 1],
        columns: [30, 30],
        required: [true, true],
        button_label: 'Continue',
        placeholders: ['e.g. CA', 'e.g. San Diego'],
        preamble: 'A little bit more about you...',
        show_progress_bar: true
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
        preamble: '<p>Below is the question you will see for the rest of the experiment.</p>' +
        '<p>Enter the whole sentence <strong>word for word</strong> to continue.</p> ',
        on_finish: function(data) {
            var resp = JSON.parse(data.responses).Q0;
            if (resp==bold_phrase) {
                data.comprehension_check_continue = true;
            }
            else {
                alert('Pay attention and type in the words that are in bold.');
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
        required: true,
    }],
    imgname: 'empty-image-1.jpg',
            show_progress_bar: true
};


/* More instruction */
    var page_4 = "<h2>Next, you will see similar questions, but each question comes with a real person's face.</h2> " +
        "<p>You might see the same face, try to be consistent with yourself. " +
        "Also, more importantly, try to be close with other people's responses. </p>" +
        "<p>These faces photos are not collected for the purpose of measuring risk-taking tendency. " +
        "In other words, the people on the photos don't know that their faces will be evaluated by you. </p>";

    var instruction_block2 = {
        type: 'instructions',
        pages: [page_4],
        show_clickable_nav: true,
        show_progress_bar: true
    };

    /*==========================================================================
     *                           Fixed trials loop
     * ========================================================================= */
    var fixed_trials = {
        type: 'face-likert-amanda',
        questions: [
            {prompt: prompty_que,
                labels: labels,
                required: true
            }],
        timeline: fixed_lst,
        randomize_order: true,
        isRepeat: true,
        show_progress_bar: true
    };

    var break_trial_0 = {
        type: 'html-keyboard-response',
        stimulus: '<p>Good job! Let us take a quick break!</p>',
        trial_duration: 1000,
    };


/*==========================================================================
 *                           For loop
 * ========================================================================= */
function repeat_trial(iter) {
    var each_chuck_img_num = 20;
    var face_likert_trials = {
        type: 'face-likert-amanda',
        questions: [
            {prompt: prompty_que,
                labels: labels,
                required: true,
            }],
        timeline: all_lst.slice(iter*each_chuck_img_num, (iter+1)*each_chuck_img_num),
        randomize_order: true,
        show_progress_bar: true,
    };

    var break_trial = {
        type: 'html-keyboard-response',
        stimulus: '<p>Good job! Let us take a quick break!</p>',
        // choices: ['y', 'n'],
        trial_duration: function(){
            return jsPsych.randomization.sampleWithoutReplacement([500, 750, 1000, 2000], 1)[0];
  }
    };

    var nested_timeline = {
        timeline: [face_likert_trials, break_trial],
        };

    timeline.push(nested_timeline)
}

    // /*==========================================================================
    //  *                           randomly repeat n trials in the end
    //  * ========================================================================= */
    //
    // var repeat_n_trials = 1;
    // let random_lst = img_lst.sort(() => .5-Math.random()).slice(0, repeat_n_trials);
    //
    // var repeat_trial_block = {
    //     type: 'face-likert-amanda',
    //     questions: [{
    //         prompt: prompty_que,
    //         labels: labels,
    //         required: true,
    //     }],
    //     timeline: random_lst,
    //     randomize_order: true,
    //     data: {trial_type: 'repeat'},
    // };


/*==========================================================================
 *                           RUN JSPSYCH
 * ========================================================================= */

timeline.push(instruction_block);
timeline.push(demographic_node);
timeline.push(location_questions);
timeline.push(comprehension_loop_node);
timeline.push(empty_face_trial);
timeline.push(instruction_block2);
timeline.push(fixed_trials);
timeline.push(break_trial_0);
var iter_end = 2;  // iter_end = 4
for (iter=0; iter<iter_end; iter++) {repeat_trial(iter)}
timeline.push(fixed_trials);


jsPsych.init({
	display_element: 'jspsych-target',
	timeline: timeline,
    show_progress_bar: true,
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