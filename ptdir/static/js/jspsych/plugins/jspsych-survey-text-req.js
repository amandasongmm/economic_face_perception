/**
 * jspsych-text-req
 * a jspsych plugin for survey questions with text responses
 *
 * Becky Gilbert
 * based on the survey-multi-choice plugin by Shane Martin
 *
 * documentation: docs.jspsych.org
 *
 */



function evaluateFunctionParameters(trial){

    // first, eval the trial type if it is a function
    if(typeof trial.type === 'function'){
      trial.type = trial.type.call();
    }

    // now eval the whole trial
    var keys = Object.keys(trial);

    for (var i = 0; i < keys.length; i++) {
      if(keys[i] !== 'type'){
        if(
          (typeof jsPsych.plugins.universalPluginParameters[keys[i]] !== 'undefined' && jsPsych.plugins.universalPluginParameters[keys[i]].type !== jsPsych.plugins.parameterType.FUNCTION ) ||
          (typeof jsPsych.plugins[trial.type].info.parameters[keys[i]] !== 'undefined' && jsPsych.plugins[trial.type].info.parameters[keys[i]].type !== jsPsych.plugins.parameterType.FUNCTION)
        ) {
          if (typeof trial[keys[i]] == "function") {
            trial[keys[i]] = trial[keys[i]].call();
          }
        }
      }
    }
  }


jsPsych.plugins['survey-text-req'] = (function() {
  var plugin = {};

  plugin.info = {
    name: 'survey-text-req',
    description: '',
    parameters: {
      questions: {
        type: [jsPsych.plugins.parameterType.STRING],
        array: true,
        default: undefined,
        no_function: false,
        description: '',
          pretty_name: 'survey question',
      },
      required: {
        type: [jsPsych.plugins.parameterType.BOOL],
        array: true,
        default: false,
        no_function: false,
        description: ''
      },
      rows: {
        type: [jsPsych.plugins.parameterType.INT],
        array: true,
        default: 1,
        no_function: false,
        description: 'The number of rows for the response text box.',
      },
      columns: {
        type: [jsPsych.plugins.parameterType.INT],
        array: true,
        default: 40,
        no_function: false,
        description: 'The number of columns for the response text box.',
      },
      placeholders: {
        type: [jsPsych.plugins.parameterType.STRING],
        array: true,
        default: '',
        no_function: false,
        description: ''
      },
      preamble: {
        type: [jsPsych.plugins.parameterType.STRING],
        default: null,
        no_function: false,
        description: 'HTML formatted string to display at the top of the page above all the questions.',
      },
      button_label: {
        type: [jsPsych.plugins.parameterType.STRING],
        default: 'Next',
        no_function: false,
        description: 'The text that appears on the button to finish the trial.',
      }
    }
  };

  plugin.trial = function(display_element, trial) {
    var plugin_id_name = "jspsych-survey-text-req";
    var plugin_id_selector = '#' + plugin_id_name;
    var _join = function( /*args*/ ) {
      var arr = Array.prototype.slice.call(arguments, _join.length);
      return arr.join(separator = '-');
    };

    // trial defaults
    trial.preamble = typeof trial.preamble == 'undefined' ? plugin.info.parameters.preamble.default : trial.preamble;
    trial.required = typeof trial.required == 'undefined' ? plugin.info.parameters.required.default : trial.required;
    trial.button_label = typeof trial.button_label === 'undefined' ? plugin.info.parameters.button_label.default : trial.button_label;

    if (typeof trial.rows == 'undefined') {
      trial.rows = [];
      for (var i = 0; i < trial.questions.length; i++) {
        trial.rows.push(trial.rows.default);
      }
    }
    if (typeof trial.columns == 'undefined') {
      trial.columns = [];
      for (var i = 0; i < trial.questions.length; i++) {
        trial.columns.push(trial.columns.default);
      }
    }
    if (typeof trial.placeholders == 'undefined') {
      trial.placeholders = [];
      for (var i = 0; i < trial.questions.length; i++) {
        trial.placeholders.push("");
      }
    }

    // if any trial variables are functions
    // this evaluates the function and replaces
    // it with the output of the function  evaluateFunctionParameters
    // trial = evaluateFunctionParameters(trial);
    //
    // console.log(trial.questions);

    // inject CSS for trial
    display_element.innerHTML = '<style id="jspsych-survey-text-req-css"></style>';
    var cssstr = ".jspsych-survey-text-req-question {margin-top: 2em; margin-bottom: 2em; text-align: left;}"+
      ".jspsych-survey-text-req-text span.required {color: darkred;}"+
      ".jspsych-survey-text-req-text {text-align: center; display: inline-block; margin-left: 1em; margin-right: 1em;  vertical-align: top;}"+
      "label.jspsych-survey-text-req-text input[type='text'] {margin-right: 1em;} textarea {font-family: 'Open Sans', 'Arial', sans-sefif;font-size: 14px;}";

    display_element.querySelector('#jspsych-survey-text-req-css').innerHTML = cssstr;

    // form element
    var trial_form_id = _join(plugin_id_name, "form");
    display_element.innerHTML += '<form id="'+trial_form_id+'"></form>';
    var trial_form = display_element.querySelector("#" + trial_form_id);
    
    // show preamble text
    var preamble_id_name = _join(plugin_id_name, 'preamble');
    trial_form.innerHTML += '<div id="'+preamble_id_name+'" class="'+preamble_id_name+'">'+trial.preamble+'</div>';

    // add text response questions
    for (var i = 0; i < trial.questions.length; i++) {

      // create question container
      var question_classes = [_join(plugin_id_name, 'question')];
      trial_form.innerHTML += '<div id="'+_join(plugin_id_name, i)+'" class="'+question_classes.join(' ')+'"></div>';
      var question_selector = _join(plugin_id_selector, i);

      // add question text
      display_element.querySelector(question_selector).innerHTML += '<p class="jspsych-survey-text ' + plugin_id_name + '-text survey-text-req">' + trial.questions[i] + '</p>';

      // text input area name
      var resp_box_name = _join(plugin_id_name, "resp-box", i);
      var resp_box_selector = '#' + resp_box_name;

      // add text input/area container
      display_element.querySelector(question_selector).innerHTML += '<div id="'+resp_box_name+'" class="'+_join(plugin_id_name, 'resp-box')+'"></div>';

      // set up the text input/area 
      var question_container = document.getElementById(resp_box_name);
      var input_name = _join(plugin_id_name, 'response', i); // name and ID are the same
      var input; 

      if(trial.rows[i] == 1){
        // input[type=text]
        input = document.createElement('input');
        input.setAttribute('type', "text");
        input.setAttribute('size', trial.columns[i]);
      } else {
        // textarea
        input = document.createElement('textarea');
        input.setAttribute('rows', trial.rows[i]);
        input.setAttribute('cols', trial.columns[i]);
      }
      // add placeholder text
      if (trial.placeholders && trial.placeholders[i]) {
        input.setAttribute('placeholder', trial.placeholders[i]);
      }
      input.setAttribute('name', input_name);
      input.setAttribute('id', input_name);
      // add autofocus
      if (i === 0) {
        input.setAttribute('autofocus', true);
      }

      question_container.appendChild(input);

      if (trial.required && trial.required[i]) {
        // add "question required" asterisk
        display_element.querySelector(question_selector + " p").innerHTML += "<span class='required'>*</span>";

        // add required property
        if (trial.rows[i] == 1) {
          display_element.querySelector(question_selector + " input[type=text]").required = true;
        } else {
          display_element.querySelector(question_selector + " textarea").required = true;
        }
      }
    }

    // add submit button
    trial_form.innerHTML += '<input type="submit" id="'+plugin_id_name+'-next" class="'+plugin_id_name+' jspsych-btn"' + (trial.button_label ? ' value="'+trial.button_label + '"': '') + '></input>';

    // submit button event listener
    trial_form.addEventListener('submit', function(event) {

      event.preventDefault();
      
      // measure response time
      var endTime = (new Date()).getTime();
      var response_time = endTime - startTime;

      // find all questions on the page
      var matches = display_element.querySelectorAll("div." + plugin_id_name + "-question");

      // create object to hold responses
      var question_data = {};
      for(var i=0; i<matches.length; i++){
        var id = "Q" + i;
        var val = matches[i].querySelector('textarea, input').value;
        var obje = {};
        obje[id] = val;
        Object.assign(question_data, obje);
      }
      // save data
      var trial_data = {
        "rt": response_time,
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
