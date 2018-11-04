import pandas as pd

columnNames = ["Id", "#", "trial", "X"]
trial = pd.read_csv("trialdata.csv", names=columnNames, header=None)

rt = []
trial_type = []
responses = []
view_history = []
internal_node_id = []
time_elapsed = []
questions = []
trial_index = []

for e in trial.X:
    d = eval(e)

    rt.append(d['rt'])
    trial_type.append(d['trial_type'])
    internal_node_id.append(d['internal_node_id'])
    time_elapsed.append(d['time_elapsed'])
    trial_index.append(d['trial_index'])

    try:
        responses.append(d['responses'])
    except KeyError:
        responses.append(None)
    try:
        view_history.append(d['view_history'])
    except KeyError:
        view_history.append(None)
    try:
        questions.append(d['questions'])
    except KeyError:
        questions.append(None)

# 'X' is replaced, '#' == trial_index
trial = trial.drop(['X', '#'], axis = 1)

trial['rt'] = rt
trial['trial_type'] = trial_type
trial['internal_node_id'] = internal_node_id
trial['time_elapsed'] = time_elapsed
trial['trial_index'] = trial_index
trial['responses'] = responses
trial['view_history'] = view_history
trial['questions'] = questions

prompt = []
labels = []
required = []
options = []
horizontal = []

# Does this work for demographics?
for q in trial.questions:
    if q == None:
        prompt.append(None)
        labels.append(None)
        required.append(None)
        options.append(None)
        horizontal.append(None)
    else:
        d = eval(q.replace('true', 'True').replace('false', 'False'))[0]
        prompt.append(d['prompt'])
        required.append(d['required'])

        try:
            labels.append(d['labels'])
        except KeyError:
            labels.append(None)
        try:
            options.append(d['options'])
        except KeyError:
            options.append(None)
        try:
            horizontal.append(d['horizontal'])
        except:
            horizontal.append(None)

trial = trial.drop(['questions'], axis = 1)

trial['prompt'] = prompt
trial['required'] = required
trial['labels'] = labels
trial['options'] = options
trial['horizontal'] = horizontal

trial.to_csv('trialdataClean.csv')
