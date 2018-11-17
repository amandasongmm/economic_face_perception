"""
This file cleans trialData.csv
"""
import json
import pandas as pd

# Creates the dataframe
columnNames = ["UserId", "#", "trialId", "jsonStr"]
trial = pd.read_csv("../ptdir/trialdata.csv", names=columnNames, header=None)

# set up the values we want to extract
keys = ['rt', 'trial_type', 'view_history', 'internal_node_id', 'time_elapsed',
        'trial_index', 'responses', 'questions', 'imgName', 'isRepeat',
        'isRandom', 'stimulus', 'key_press']
data = {key: [] for key in keys}

# Extracts the values
for jsonStr in trial.jsonStr:
    jsonDict = json.loads(jsonStr)
    for key in keys:
        try:
            data[key].append(jsonDict[key])
        except KeyError:
            data[key].append(None)

# Inserts the dictionary into the trial dataframe
for key in keys:
    trial[key] = data[key]

# set up the values we want to extract for the question
qKeys = ['prompt', 'options', 'required', 'horizontal', 'labels']
qData = {key: [] for key in qKeys}

# Extraction - its a list because of the possibility of multiple prompts
# Column
for questions in trial.questions:
    if questions is not None:
        prompt = []
        options = []
        required = []
        horizontal = []
        labels = []
        # row in the Column
        for question in json.loads(questions):
            try:
                prompt.append(question[key])
            except KeyError:
                prompt.append(None)

            try:
                options.append(question[key])
            except KeyError:
                options.append(None)

            try:
                required.append(question[key])
            except KeyError:
                required.append(None)

            try:
                horizontal.append(question[key])
            except KeyError:
                horizontal.append(None)

            try:
                labels.append(question[key])
            except KeyError:
                labels.append(None)

        qData['prompt'].append(prompt)
        qData['options'].append(options)
        qData['required'].append(required)
        qData['horizontal'].append(horizontal)
        qData['labels'].append(labels)
    else:
        for key in qKeys:
            qData[key].append([None])

# Inserts question dictionary values into trial dataframe
for key in qKeys:
    trial[key] = qData[key]

# Drop unwanted columns
trial = trial.drop(['jsonStr', '#', 'questions'], axis=1)

# Output the new file into current directory
trial.to_csv('second_pilot_DataClean.csv')
