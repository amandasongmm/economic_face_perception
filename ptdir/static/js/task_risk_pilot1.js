


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
    var page_1 = '<h2>Welcome to the face perception experiment!</h2> ' +
		'<p>In this experiment, you will see a number of facial images. </p> ' +
		'<p>Your task is to indicate <strong>your belief</strong> about the person in the picture. </p>';
	
    var page_2 = '<p>Please read the questions carefully and make sure you understand them before proceeding.</p>' +
		 '<p> You may take as long as you need to answer each question.</p>' +
		 '<p> <strong>Your responses</strong> will be compared with those of <strong>other</strong> participants.</p>' +
	    	 '<p> The <strong>closer</strong> you are to the average of everyone else, the <strong>better</strong>.</p>';

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
        prompt: 'Please choose the option that match the number here: ' + random_num,
        options: ["1", "2", "3", "4"],
        required: true
    };

    var q_age = {
        prompt: 'What is your age?',
        options: ['Under 18', '18-25', '26-35', '36-45', '46-54'],
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
        questions: [q_age, q_gender, q_hispanic, q_race, q_attention, q_education],
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
    var state_question = 'What state do you live in?';
    var location_question = 'Which city do you live in?';
    var zipcode_question = 'What is your zipcode?';

    var location_questions = {
        type: 'survey-text-req',
        questions: [state_question, location_question, zipcode_question],
        rows: [1, 1, 1],
        columns: [30, 30, 30],
        required: [true, true, true],
        button_label: 'Continue',
        placeholders: ['e.g. CA', 'e.g. San Diego', 'e.g. 92037'],
        preamble: 'Please tell us where you are located...',
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

    };

    var break_trial = {
        type: 'html-keyboard-response',
        stimulus: '<p>Good job! Let us take a quick break!</p>',
        trial_duration: function(){
            return jsPsych.randomization.sampleWithoutReplacement([750, 1000, 2000], 1)[0];
  }
    };

    var nested_timeline = {
        timeline: [face_likert_trials, break_trial],
        show_progress_bar: true
        };

    timeline.push(nested_timeline)
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
timeline.push(fixed_trials);
timeline.push(break_trial_0);
var iter_end = 1;  // iter_end = 4
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
