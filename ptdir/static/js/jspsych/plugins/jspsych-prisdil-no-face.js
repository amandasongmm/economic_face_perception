/**
 * jspsych-survey-multi-choice
 * a jspsych plugin for multiple choice survey questions
 *
 * Shane Martin
 *
 * documentation: docs.jspsych.org
 *
 */


jsPsych.plugins['prisdil-no-face'] = (function() {
	var plugin = {};

	plugin.info = {
		name: 'prisdil-no-face',
		description: '',
		parameters: {
			questions: {
				type: jsPsych.plugins.parameterType.COMPLEX,
				array: true,
				pretty_name: 'Questions',
				nested: {
					prompt: {type: jsPsych.plugins.parameterType.STRING,
						pretty_name: 'Prompt',
						default: undefined,
						description: 'The strings that will be associated with a group of options.'},
					options: {type: jsPsych.plugins.parameterType.STRING,
						pretty_name: 'Options',
						array: true,
						default: undefined,
						description: 'Displays options for an individual question.'},
					labels: {type: jsPsych.plugins.parameterType.STRING,
                        array: true,
                        pretty_name: 'Labels',
                        default: undefined,
                        description: 'Labels to display for individual question.'},
					required: {type: jsPsych.plugins.parameterType.BOOL,
						pretty_name: 'Required',
						default: false,
						description: 'Subject will be required to pick an option for each question.'},
					horizontal: {type: jsPsych.plugins.parameterType.BOOL,
						pretty_name: 'Horizontal',
						default: false,
						description: 'If true, then questions are centered and options are displayed horizontally.'},
				}
			},
			preamble: {
				type: jsPsych.plugins.parameterType.STRING,
				pretty_name: 'Preamble',
				default: null,
				description: 'HTML formatted string to display at the top of the page above all the questions.'
			},
			button_label: {
				type: jsPsych.plugins.parameterType.STRING,
				pretty_name: 'Button label',
				default:  'Continue',
				description: 'Label of the button.'
			},
			prisdil_params: {
				type: jsPsych.plugins.parameterType.INT,
				pretty_name: 'Prisoner Dilemma Parameters',
				default: [16,10,18,8],
				description: 'Prisoner dilemma payouts in this order: return when both collaborate, return when both defect, return for defector when other collaborates, return for collaborator when other defects'
			}

		}
	}


	plugin.trial = function(display_element, trial) {
		var plugin_id_name = "jspsych-survey-multi-choice";
		var plugin_id_selector = '#' + plugin_id_name;
		var _join = function( /*args*/ ) {
			var arr = Array.prototype.slice.call(arguments, _join.length);
			return arr.join(separator = '-');
		}

		// inject CSS for trial
		display_element.innerHTML = '<style id="jspsych-survey-multi-choice-css"></style>';
		var cssstr = ".jspsych-survey-multi-choice-question { margin-top: 2em; margin-bottom: 2em; text-align: left; }"+
			".jspsych-survey-multi-choice-text span.required {color: darkred;}"+
			".jspsych-survey-multi-choice-horizontal .jspsych-survey-multi-choice-text {  text-align: center;}"+
			".jspsych-survey-multi-choice-option { line-height: 2; }"+
			".jspsych-survey-multi-choice-horizontal .jspsych-survey-multi-choice-option {  display: inline-block;  margin-left: 1em;  margin-right: 1em;  vertical-align: top;}"+
			"label.jspsych-survey-multi-choice-text input[type='radio'] {margin-right: 1em;}"+
			".prisDilCell {width:150px;height:80px;text-align: center;}"+
			".greyCell {background-color:#e6e6e6;}";


		display_element.querySelector('#jspsych-survey-multi-choice-css').innerHTML = cssstr;

		// form element
		var trial_form_id = _join(plugin_id_name, "form");
		display_element.innerHTML += '<form id="'+trial_form_id+'"></form>';
		var trial_form = display_element.querySelector("#" + trial_form_id);
		// show preamble text
		var preamble_id_name = _join(plugin_id_name, 'preamble');
		if(trial.preamble !== null){
			trial_form.innerHTML += '<div id="'+preamble_id_name+'" class="'+preamble_id_name+'">'+trial.preamble+'</div><br>';
		}


		trial_form.innerHTML += '<div><p>Imagine that you are playing the following game with another person: each of you chooses one of two actions, A or B, at the same time, without seeing what the other person does. Once you’ve both chosen your actions you both immediately receive a payment in dollars. The amount of the payment depends on both your actions, in the following way:</p></div>'


		//trial_form.innerHTML += '<img height="327" width="429" src="static/images/prisdil.png" id="prisdilImage" alt="prisoner dilemna description" />'

		var return_bothCollaborate = trial.prisdil_params[0];
	        var return_bothDefect = trial.prisdil_params[1];
        	var return_oneDefects_winner = trial.prisdil_params[2];
	        var return_oneDefects_loser = trial.prisdil_params[3];


		trial_form.innerHTML += '<div style="width:100%"><table style="margin-left:auto;margin-right:auto">' +
			'  <tr>' +
			'    <td class="prisDilCell"></td>' +
			'    <td class="greyCell prisDilCell">They choose:<br><b>A</b></td>' +
			'    <td class="greyCell prisDilCell">They choose:<br><b>B</b></td>' +
			'  </tr>' +
			'  <tr>' +
			'    <td class="greyCell prisDilCell">You choose:<br><b>A</b></td>' +
			'    <td class="prisDilCell">You get: $'+return_bothCollaborate+'<br>They get: $'+return_bothCollaborate+'</td>' +
			'    <td class="prisDilCell">You get: $'+return_oneDefects_loser+'<br>They get: $'+return_oneDefects_winner+'</td>' +
			'  </tr>' +
			'  <tr>' +
			'    <td class="greyCell prisDilCell">You choose:<br><b>B</b></td>' +
			'    <td class="prisDilCell">You get: $'+return_oneDefects_winner+'<br>They get: $'+return_oneDefects_loser+'</td>' +
			'    <td  class="prisDilCell">You get: $'+return_bothDefect+'<br>They get: $'+return_bothDefect+'</td>' +
			'  </tr>' +
			'</table></div>';

		
		// add multiple-choice questions
		for (var i = 0; i < trial.questions.length; i++) {
			// create question container
			var question_classes = [_join(plugin_id_name, 'question')];
			if (trial.questions[i].horizontal) {
				question_classes.push(_join(plugin_id_name, 'horizontal'));
			}

			trial_form.innerHTML += '<div id="'+_join(plugin_id_name, i)+'" class="'+question_classes.join(' ')+'"></div>';

			var question_selector = _join(plugin_id_selector, i);

			// add question text
			display_element.querySelector(question_selector).innerHTML += '<p class="' + plugin_id_name + '-text survey-multi-choice">' + trial.questions[i].prompt + '</p>';

			// create option radio buttons
			for (var j = 0; j < trial.questions[i].options.length; j++) {
				var option_id_name = _join(plugin_id_name, "option", i, j),
					option_id_selector = '#' + option_id_name;

				// add radio button container
				display_element.querySelector(question_selector).innerHTML += '<div id="'+option_id_name+'" class="'+_join(plugin_id_name, 'option')+'"></div>';

				// add label and question text
				var form = document.getElementById(option_id_name)
				var input_name = _join(plugin_id_name, 'response', i);
				var input_id = _join(plugin_id_name, 'response', i, j);
				var label = document.createElement('label');
				label.setAttribute('class', plugin_id_name+'-text');
				label.innerHTML = trial.questions[i].options[j];
				label.setAttribute('for', input_id)

				// create radio button
				var input = document.createElement('input');
				input.setAttribute('type', "radio");
				input.setAttribute('name', input_name);
				input.setAttribute('id', input_id);
				input.setAttribute('value', trial.questions[i].options[j]);
				form.appendChild(label);
				form.insertBefore(input, label);
			}

			if (trial.questions[i].required) {
				// add "question required" asterisk
				display_element.querySelector(question_selector + " p").innerHTML += "<span class='required'>*</span>";

				// add required property
				display_element.querySelector(question_selector + " input[type=radio]").required = true;
			}
		}
		// add submit button
		trial_form.innerHTML += '<input type="submit" id="'+plugin_id_name+'-next" class="'+plugin_id_name+' jspsych-btn"' + (trial.button_label ? ' value="'+trial.button_label + '"': '') + '></input>';
		trial_form.addEventListener('submit', function(event) {
			event.preventDefault();
			var matches = display_element.querySelectorAll("div." + plugin_id_name + "-question");
			// measure response time
			var endTime = (new Date()).getTime();
			var response_time = endTime - startTime;

			// create object to hold responses
			var question_data = {};
			var matches = display_element.querySelectorAll("div." + plugin_id_name + "-question");
			for(var i=0; i<matches.length; i++){
				match = matches[i];
				var id = "Q" + i;
				if(match.querySelector("input[type=radio]:checked") !== null){
					var val = match.querySelector("input[type=radio]:checked").value;
				} else {
					var val = "";
				}
				var obje = {};
				obje[id] = val;
				Object.assign(question_data, obje);
			}
			// save data
			var trial_data = {
				"rt": response_time,
				"questions": JSON.stringify(trial.questions),
				"responses": JSON.stringify(question_data)
			};
			display_element.innerHTML = '';

			// next trial
			jsPsych.finishTrial(trial_data);
		});

		var startTime = (new Date()).getTime();
	};

	return plugin;
})();
