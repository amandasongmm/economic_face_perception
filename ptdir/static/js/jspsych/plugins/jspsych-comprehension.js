/*
 * Comprehension template
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

    html = '';
    // CSS
    html += "<style>"
    html += "#userInput {width: 350px;}"
    html += "</style>"

    html += "<form id='comprehensionForm'>"
    // Prompt
    html += "<p>Please enter the following <b>bolded</b> statement into the text box below. Be sure to include the correct punctuation and case: <b>"+trial.prompt+"</b><p>"
    // input
    html += "<input type='text' id='userInput'>"
    // Submit button
    html += "<input type='submit' value='Submit'>"
    html += "<br>"
    html += "<p id='ErrorMsg'></p>"
    html += "</form>"
    display_element.innerHTML = html

    display_element.querySelector('#comprehensionForm').addEventListener('submit', function(e){
      e.preventDefault();
      if (document.getElementById('userInput').value != trial.prompt) {
        //alert('The statement you wrote does not match the bolded statement.');
        document.getElementById('ErrorMsg').innerHTML = 'The statement you wrote does not match the bolded statement.'
      } else {
        //clear the display
        display_element.innerHTML = '';

        // end trial
        jsPsych.finishTrial(trial_data);
      }
      })

    // data saving
    var trial_data = {
      parameter_name: 'parameter value'
    };
  };
return plugin;
})();
