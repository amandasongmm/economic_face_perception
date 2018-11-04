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
    var html = "";
    html += "Please type out the following in bold (case-sensitive, punctuation required): <b>" + trial.prompt + "</b>.</p>"
    display_element.innerHTML = html;
    // data saving
    var trial_data = {
      parameter_name: 'parameter value'
    };

    // end trial
    jsPsych.finishTrial(trial_data);
  };

  return plugin;
})();
