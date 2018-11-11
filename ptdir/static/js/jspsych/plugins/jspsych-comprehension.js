/*
 * Example plugin template
 */

jsPsych.plugins["comprehension"] = (function() {

  var plugin = {};

  plugin.info = {
    name: "comprehension",
    parameters: {
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        default: undefined,
        description: 'What to type out'
      }
    }
  }

  plugin.trial = function(display_element, trial) {
    var cont = false;
    // Source: https://www.w3schools.com/js/tryit.asp?filename=tryjs_validation_number
    function validateForm() {
      var x = document.forms["myForm"]["fname"].value;
      var text = '';
       if (x != trial.prompt) {
         alert("The text you typed does not match prompt");
         return false;
       }// else { //make a variable true. print out you can now continue
       //  text = 'You may now continue';
       //  cont = true;
    }

    var html = "";
    html += '<p>Please type out the following prompt in bold (case-sensitive, punctuation required): <b>' + trial.prompt + '</b>.</p>';

    // Form?
    html += '<form name="myForm" onsubmit="return validateForm()" method="post">'
    html += 'Name: <input type="text" name="fname">'
    html += '<input type="submit" value="Submit">'
    html += '</form>'

    html += '<input type="submit" id="jspsych-survey-likert-next" class="jspsych-survey-likert jspsych-btn" value="'+trial.button_label+'"></input>';

        html += '</form>'

        display_element.innerHTML = html;

        display_element.querySelector('#jspsych-survey-likert-form').addEventListener('submit', function(e){
          e.preventDefault();
          // measure response time
          var endTime = (new Date()).getTime();
          var response_time = endTime - startTime;

          // create object to hold responses
          var question_data = {};
          var matches = display_element.querySelectorAll('#jspsych-survey-likert-form .jspsych-survey-likert-opts');
          for(var index = 0; index < matches.length; index++){
            var id = matches[index].dataset['radioGroup'];
            var el = display_element.querySelector('input[name="' + id + '"]:checked');
            if (el === null) {
              var response = "";
            } else {
              var response = parseInt(el.value);
            }
            var obje = {};
            obje[id] = response;
            Object.assign(question_data, obje);
          }
    display_element.innerHTML = html;

    // data saving
    var trial_data = {
      parameter_name: 'parameter value'
    };

    display_element.innerHTML = '';
    // end trial
    jsPsych.finishTrial(trial_data);
  };

  return plugin;
})();
