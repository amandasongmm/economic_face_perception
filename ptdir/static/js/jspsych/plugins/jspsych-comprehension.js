jsPsych.plugins["comprehension"] = (function() {

  var plugin = {};

  plugin.info = {
    name: "comprehension",
    parameters: {
      prompt: {
        type: jsPsych.plugins.parameterType.STRING, // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
        default: undefined
        description: 'Question to comprehend.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    // data saving
    var trial_data = {
      parameter_name: 'parameter value'

      html += '<style id="jspsych-survey-likert-css">';
          html += ".jspsych-survey-likert-statement { display:block; font-size: 16px; padding-top: 40px; margin-bottom:10px; }"+
            ".jspsych-survey-likert-opts { list-style:none; width:100%; margin:0; padding:0 0 35px; display:block; font-size: 14px; line-height:1.1em; }"+
            ".jspsych-survey-likert-opt-label { line-height: 1.1em; color: #444; }"+
            ".jspsych-survey-likert-opts:before { content: ''; position:relative; top:11px; /*left:9.5%;*/ display:block; background-color:#efefef; height:4px; width:100%; }"+
            ".jspsych-survey-likert-opts:last-of-type { border-bottom: 0; }"+
            ".jspsych-survey-likert-opts li { display:inline-block; /*width:19%;*/ text-align:center; vertical-align: top; }"+
            ".jspsych-survey-likert-opts li input[type=radio] { display:block; position:relative; top:0; left:50%; margin-left:-6px; }"
          html += '</style>';

      html = ''
      html += '<style="jspsych-survey-likert-statement""> Please type the following into the box below (Capitalization and punctuations matter) <b>' + trial.prompt + '</b>.</style>'
      html += <form name="myForm" action="/action_page.php"

      function validateForm() {
          var x = document.forms["myForm"]["checker"].value;
          if (x != trial.prompt) {
              alert("The text you entered does not match the bold statement");
              return false;
          }
      
      html += '<form name="myForm"'
      html += 'onsubmit="return validateForm()" method="post">'
      html += 'Name: <input type="text" name="checker">'
      html += '<input type="submit" value="Submit">'
      html += '</form>'
      }
      display_element.innerHTML = html
    };

    // end trial
    jsPsych.finishTrial(trial_data);
  };

  return plugin;
})();
