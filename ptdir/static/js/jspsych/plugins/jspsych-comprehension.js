/*
 * Example plugin template
 */

jsPsych.plugins["comprehension"] = (function() {

  var plugin = {};

  plugin.info = {
    name: "comprehension",
    parameters: {
      prompt: {
        type: jsPsych.plugins.parameterType.STRING, // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
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
