/**
 * jspsych-survey-multi-choice
 * a jspsych plugin for multiple choice survey questions
 *
 * Shane Martin
 *
 * documentation: docs.jspsych.org
 *
 */
// Issues:
// 1. need to make horizontal
// 2. the continue button doesn't work
// 3. need to save the correct data

jsPsych.plugins['face-prisdil-scale'] = (function() {
	var plugin = {};

	plugin.info = {
		name: 'face-prisdil-scale',
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
					required: {type: jsPsych.plugins.parameterType.BOOL,
						pretty_name: 'Required',
						default: false,
						description: 'Subject will be required to pick an option for each question.'},
					labels: {type: jsPsych.plugins.parameterType.STRING,
                        array: true,
                        pretty_name: 'Labels',
                        default: undefined,
                        description: 'Labels to display for individual question.'},
				}
			},
			imgname: {
				type: jsPsych.plugins.parameterType.STRING,
				pretty_name: 'Imgname',
				default: undefined,
				description: 'Face image to display with the plugin'
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
			".greyCell {background-color:#e6e6e6;}" +
			".slidecontainer {width: 100%;}"+
			".slider {-webkit-appearance: none;width: 100%;height: 15px;border-radius: 5px;background: #d3d3d3;outline: none;opacity: 0.7;-webkit-transition: .2s;transition: opacity .2s;}" +
			".slider:hover {opacity: 1;}" +
			".slider::-webkit-slider-thumb {-webkit-appearance: none;appearance: none;width: 25px;height: 25px;border-radius: 50%;background: #4CAF50;cursor: pointer;}"+
			".slider::-moz-range-thumb {width: 25px;height: 25px;border-radius: 50%;background: #4CAF50;cursor: pointer;}";


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


		 trial_form.innerHTML += '<div><p>Imagine that you are playing the following game with the person in the picture below: each of you chooses one of two actions, A or B, at the same time, without seeing what the other person does. Once you’ve both chosen your actions you both immediately receive a payment in dollars. The amount of the payment depends on both your actions, in the following way:</p></div>'


		 //trial_form.innerHTML += '<img height="327" width="429" src="static/images/prisdil.png" id="prisdilImage" alt="prisoner dilemna description" />'

		 var return_bothCollaborate = trial.prisdil_params[0];
	     var return_bothDefect = trial.prisdil_params[1];
         var return_oneDefects_winner = trial.prisdil_params[2];
	     var return_oneDefects_loser = trial.prisdil_params[3];


		 trial_form.innerHTML += '<div id="header" style="height:15%;width:100%;">'
		 trial_form.innerHTML += '<div style="float:left"><table>' +
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

		 trial_form.innerHTML += '<div style="float:right;margin-right:10%"><img height="256" width="195" src="static/images/faces/'+trial.imgname+'" id="faceImage" alt="face" /></div></div>'
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

			if (trial.questions[i].required) {
				// add "question required" asterisk
				display_element.querySelector(question_selector + " p").innerHTML += "<span class='required'>*</span>";
			}

		 }

         // add likert scale
         // How to convert horizontally?
         for (var i = 0; i < trial.questions.length; i++) {
             // add options
             var width = 100 / trial.questions[i].labels.length;
             var options_string = '<ul class="jspsych-survey-likert-opts" data-radio-group="Q' + i + '">';

             for (var j = 0; j < trial.questions[i].labels.length; j++) {
                  options_string += '<li style="width:' + width + '%"><input type="radio" name="Q' + i + '" value="' + j + '"';
                  if(trial.questions[i].required){
                       options_string += ' required';
                  }
                  options_string += '><label class="jspsych-survey-likert-opt-label">' + trial.questions[i].labels[j] + '</label></li>';
              }
              options_string += '</ul>';
              trial_form.innerHTML += options_string;
         }
		// add submit button
		trial_form.innerHTML += '<input type="submit" id="'+plugin_id_name+'-next" class="'+plugin_id_name+' jspsych-btn"' + (trial.button_label ? ' value="'+trial.button_label + '"': '') + '></input>';
		trial_form.addEventListener('submit', function(event) {
			event.preventDefault();

			// measure response time
			var endTime = (new Date()).getTime();
			var response_time = endTime - startTime;

            // answer - Need to change this value ***
			var slider = document.getElementById("myRange");
			continuousResponse = {slider_value: slider.value};

			// save data
			var trial_data = {
				"rt": response_time,
				"questions": JSON.stringify(trial.questions),
				// Need to change the value in the response ***
				"responses": JSON.stringify(continuousResponse)
			};
			display_element.innerHTML = '';

			// next trial
			jsPsych.finishTrial(trial_data);
		});

		var startTime = (new Date()).getTime();
	};

	return plugin;
})();
