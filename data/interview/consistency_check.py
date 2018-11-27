"""
This file cleans trialData.csv
"""
import json
import pandas as pd
import time
import numpy as np
import scipy.stats
import matplotlib.pyplot as plt
from scipy.stats import spearmanr


def parse_data(input_path='../../ptdir/trialdata.csv'):
    print('interview question')

    start_t = time.time()

    # create a data frame
    column_names = ["subId", "trialNum", "trialId", "jsonStr"]
    trial = pd.read_csv(input_path, names=column_names, header=None)

    # debug_id_lst = ['A6XBXQC3G59N8:3VP0C6EFSI3WXKQRF9ERIP60I906M0', 'debugV9SJY8:debugA4LEZF']
    # trial = trial[~trial['subId'].isin(debug_id_lst)]

    # iterate over trials.
    likert_data_df = pd.DataFrame(columns=['subId', 'rt', 'imgName', 'isRepeat', 'rating', 'trial_index', 'debug_mode'])
    demo_survey_df = pd.DataFrame(columns=['subId', 'rt', 'age', 'gender', 'hispanic', 'ethnicity',  # demographics
                                           'education', 'income',
                                           'state', 'city', 'zipcode', 'sanityFailNum'])  # trial-task info.
    feedback_df = pd.DataFrame(columns=['subId', 'feedback_for_hit'])
    decision_feedback_df = pd.DataFrame(columns=['subId', 'overall', 'positive', 'negative', 'consistency', 'others'])
    likert_counter = 0
    demo_survey_counter = 0
    feedback_counter = 0
    decision_counter = 0

    for index, row in trial.iterrows():

        if index % 200 == 0:
            print index, len(trial), time.time() - start_t

        json_dict = json.loads(row['jsonStr'])
        if 'task_type' in json_dict:
            if json_dict['task_type'] == 'face trials':
                likert_data_df.loc[likert_counter, 'subId'] = row['subId']
                likert_data_df.loc[likert_counter, 'rt'] = json_dict['rt']
                likert_data_df.loc[likert_counter, 'imgName'] = json_dict['imgName']
                likert_data_df.loc[likert_counter, 'isRepeat'] = json_dict['isRepeat']
                likert_data_df.loc[likert_counter, 'trial_index'] = json_dict['trial_index']
                # rating encoding starts from 0, add 1 to go back to 1-9 space
                likert_data_df.loc[likert_counter, 'rating'] = json.loads(json_dict['responses'])['Q0'] + 1
                likert_data_df.loc[likert_counter, 'debug_mode'] = json_dict['debug_mode']
                likert_counter += 1

            elif json_dict['task_type'] == 'demographic-multichoice':
                demo_survey_df.loc[demo_survey_counter, 'subId'] = row['subId']
                demo_survey_df.loc[demo_survey_counter, 'rt'] = json_dict['rt']

                demo_survey_df.loc[demo_survey_counter, 'age'] = json.loads(json_dict['responses'])['Q0']
                demo_survey_df.loc[demo_survey_counter, 'gender'] = json.loads(json_dict['responses'])['Q1']
                demo_survey_df.loc[demo_survey_counter, 'hispanic'] = json.loads(json_dict['responses'])['Q2']
                demo_survey_df.loc[demo_survey_counter, 'ethnicity'] = json.loads(json_dict['responses'])['Q4']
                demo_survey_df.loc[demo_survey_counter, 'education'] = json.loads(json_dict['responses'])['Q5']
                demo_survey_df.loc[demo_survey_counter, 'income'] = json.loads(json_dict['responses'])['Q6']
                if pd.isnull(demo_survey_df.loc[demo_survey_counter, 'sanityFailNum']):
                    demo_survey_df.loc[demo_survey_counter, 'sanityFailNum'] = 0
                else:
                    demo_survey_df.loc[demo_survey_counter, 'sanityFailNum'] = \
                        demo_survey_df.loc[demo_survey_counter, 'sanityFailNum'] + 1 - json_dict['sanity_check_1_continue']
                    # if sanity_check_1_continue = True, the trial will continue, otherwise, it adds 1 to the
                    # sanityFailNum
                    # If one trial fails, and the next trial passes the sanity check, the new trial's data will overwrite
                    # previous trial's answers in the demographic questions.

            elif json_dict['task_type'] == 'demographics_location':
                # this condition checks if it's the address question. Need to add a task identifier later.
                demo_survey_df.loc[demo_survey_counter, 'state'] = json.loads(json_dict['responses'])['Q0']
                demo_survey_df.loc[demo_survey_counter, 'city'] = json.loads(json_dict['responses'])['Q1']
                demo_survey_df.loc[demo_survey_counter, 'zipcode'] = json.loads(json_dict['responses'])['Q2']
                demo_survey_counter += 1

            elif json_dict['task_type'] == 'interview decision making feedback':
                decision_feedback_df.loc[decision_counter, 'subId'] = row['subId']
                decision_feedback_df.loc[decision_counter, 'overall'] = json.loads(json_dict['responses'])['Q0']
                decision_feedback_df.loc[decision_counter, 'positive'] = json.loads(json_dict['responses'])['Q1']
                decision_feedback_df.loc[decision_counter, 'negative'] = json.loads(json_dict['responses'])['Q2']
                decision_feedback_df.loc[decision_counter, 'consistency'] = json.loads(json_dict['responses'])['Q3']
                decision_feedback_df.loc[decision_counter, 'others'] = json.loads(json_dict['responses'])['Q4']
                decision_counter += 1

            elif json_dict['task_type'] == 'feedback for HIT':
                feedback_df.loc[feedback_counter, 'subId'] = row['subId']
                feedback_df.loc[feedback_counter, 'feedback_for_hit'] = json.loads(json_dict['responses'])['Q0']
                feedback_counter += 1

        likert_data_df.to_csv('likert_data.csv')
        demo_survey_df.to_csv('demo_survey.csv')
        feedback_df.to_csv('feedback_for_hit.csv')
        decision_feedback_df.to_csv('decision_feedback.csv')


def check_group_ind_consistency():
    input_path = 'likert_data.csv'
    likert_data = pd.read_csv(input_path, index_col=0)

    # make a list for subjects.
    sub_num_dict = {}
    sub_counter = 1
    for sub_id in likert_data['subId']:
        if sub_id not in sub_num_dict:
            sub_num_dict[sub_id] = sub_counter
            sub_counter += 1
    likert_data['subNum'] = likert_data['subId'].map(sub_num_dict)

    # make a easy-to-read numbered list for images
    img_num_dict = {}
    img_counter = 0
    for img_name in likert_data['imgName']:
        if img_name not in img_num_dict:
            img_num_dict[img_name] = img_counter
            img_counter += 1

    likert_data['imgNum'] = likert_data['imgName'].map(img_num_dict)

    #
    new_df = likert_data.sort_values(by=['subNum', 'isRepeat', 'imgNum'], ascending=True)
    new_df.drop(columns=['subId', 'imgName'], inplace=True)
    new_df = new_df[['subNum', 'imgNum', 'isRepeat', 'rating', 'rt']]

    rho_lst = []
    for cur_sub_id in range(1, len(new_df['subNum'].unique()) + 1):
        cur_sub_data = new_df[new_df['subNum'] == cur_sub_id]

        empty = cur_sub_data[cur_sub_data['imgNum'] == 0]['rating'].values

        cur_sub_data = cur_sub_data[cur_sub_data['imgNum'] != 0]

        cur_data_length = len(cur_sub_data)
        unique_trial_num = cur_data_length / 2
        if cur_data_length % 2 != 0:
            raise Exception('the data length should be divisble by 2.')

        full_data = cur_sub_data['rating'].values
        first_half = cur_sub_data.head(unique_trial_num)['rating'].values
        second_half = cur_sub_data.tail(unique_trial_num)['rating'].values
        rho, p = spearmanr(first_half, second_half)
        #     if p > 0.05:
        rho_lst.append(rho)



    return


if __name__ == '__main__':
    parse_data()















