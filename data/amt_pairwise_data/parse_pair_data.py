import json
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import spearmanr
import os
import os.path
import shutil


def old_data():
    task_type = 'modifae'
    trait_name = 'attractive'
    high_low_type = 'low-high'

    # move experiment data from pt_dir to a specific folder specified by task config params.

    sub_folder_name = './' + task_type + '/' + trait_name + '-' + high_low_type + '/'
    print(sub_folder_name)

    if not os.path.isdir(sub_folder_name):
        os.makedirs(sub_folder_name)

    trial_csv = sub_folder_name + 'trialdata.csv'
    if not os.path.isfile(trial_csv):
        shutil.move("../../ptdir/trialdata.csv", sub_folder_name + 'trialdata.csv')
        shutil.move("../../ptdir/eventdata.csv", sub_folder_name + 'eventdata.csv')
        shutil.move("../../ptdir/questiondata.csv", sub_folder_name + 'questiondata.csv')
        db_file_name = []
        for cur_file in os.listdir('../../ptdir/'):
            if cur_file.endswith('.db'):
                db_file_name = cur_file
        shutil.move('../../ptdir/' + db_file_name, sub_folder_name + db_file_name)

    # parse trialdata.csv into pair_data.csv, more organized, for further analysis.
    pair_data_csv = sub_folder_name + 'pair_data.csv'
    if os.path.exists(pair_data_csv):
        print('Retrieve pairwise data...')
        pair_data = pd.read_csv(pair_data_csv)
    else:
        print('Parsing pairwise data...')
        pair_data = pd.DataFrame(
            columns=['subId', 'rt', 'im1', 'im2', 'response', 'low_first', 'repeat', 'task_type', 'correct'])
        trial_data = pd.read_csv(trial_csv, names=['subId', 'trialNum', 'trialId', 'jsonStr'], header=None)

        pair_counter = 0
        for index, row in trial_data.iterrows():
            json_dict = json.loads(row['jsonStr'])

            if 'rt' in json_dict:

                pair_data.loc[pair_counter, 'subId'] = row['subId']
                pair_data.loc[pair_counter, 'rt'] = json_dict['rt']
                pair_data.loc[pair_counter, 'im1'] = json_dict['im1']
                pair_data.loc[pair_counter, 'im2'] = json_dict['im2']
                pair_data.loc[pair_counter, 'response'] = json_dict['response']
                pair_data.loc[pair_counter, 'low_first'] = json_dict['low_first']
                pair_data.loc[pair_counter, 'repeat'] = json_dict['repeat']
                # pair_data.loc[pair_counter, 'task_type'] = json_dict['task_type']
                if json_dict['low_first'] == 1:
                    correct_answer = 'right'
                else:
                    correct_answer = 'left'
                correct = correct_answer == json_dict['response']
                pair_data.loc[pair_counter, 'correct'] = correct

                pair_counter += 1

        pair_data.to_csv(pair_data_csv)

    return


def new_data():
    task_type = 'modifae'
    trait_name = 'attractive_new'
    high_low_type = 'low-high'

    # move experiment data from pt_dir to a specific folder specified by task config params.

    sub_folder_name = './' + task_type + '/' + trait_name + '-' + high_low_type + '/'
    print(sub_folder_name)

    if not os.path.isdir(sub_folder_name):
        os.makedirs(sub_folder_name)

    trial_csv = sub_folder_name + 'trialdata.csv'
    if not os.path.isfile(trial_csv):
        shutil.move("../../ptdir/trialdata.csv", sub_folder_name + 'trialdata.csv')
        shutil.move("../../ptdir/eventdata.csv", sub_folder_name + 'eventdata.csv')
        shutil.move("../../ptdir/questiondata.csv", sub_folder_name + 'questiondata.csv')
        db_file_name = []
        for cur_file in os.listdir('../../ptdir/'):
            if cur_file.endswith('.db'):
                db_file_name = cur_file
        shutil.move('../../ptdir/' + db_file_name, sub_folder_name + db_file_name)

    # parse trialdata.csv into pair_data.csv, more organized, for further analysis.
    pair_data_csv = sub_folder_name + 'pair_data.csv'
    if os.path.exists(pair_data_csv):
        print('Retrieve pairwise data...')
        pair_data = pd.read_csv(pair_data_csv)
    else:
        print('Parsing pairwise data...')
        pair_data = pd.DataFrame(
            columns=['subId', 'rt', 'im1', 'im2', 'response', 'low_first', 'repeat', 'task_type', 'correct'])
        trial_data = pd.read_csv(trial_csv, names=['subId', 'trialNum', 'trialId', 'jsonStr'], header=None)

        pair_counter = 0
        for index, row in trial_data.iterrows():
            json_dict = json.loads(row['jsonStr'])

            if 'rt' in json_dict:

                pair_data.loc[pair_counter, 'subId'] = row['subId']
                pair_data.loc[pair_counter, 'rt'] = json_dict['rt']
                pair_data.loc[pair_counter, 'im1'] = json_dict['im1']
                pair_data.loc[pair_counter, 'im2'] = json_dict['im2']
                pair_data.loc[pair_counter, 'response'] = json_dict['response']
                pair_data.loc[pair_counter, 'low_first'] = json_dict['low_first']
                pair_data.loc[pair_counter, 'repeat'] = json_dict['repeat']
                pair_data.loc[pair_counter, 'task_type'] = json_dict['task_type']
                pair_data.loc[pair_counter, 'pair_ind'] = json_dict['pair_ind']
                if json_dict['low_first'] == 1:
                    correct_answer = 'right'
                else:
                    correct_answer = 'left'
                correct = correct_answer == json_dict['response']
                pair_data.loc[pair_counter, 'correct'] = correct

                pair_counter += 1

        pair_data.to_csv(pair_data_csv)


if __name__ == '__main__':
    new_data()



    # # compute overall modifae and gt accuracy, individual consistency, and image-pairwise accuracy.
    # sub_num_dict = {}
    # sub_counter = 1
    # for sub_id in pair_data['subId']:
    #     if sub_id not in sub_num_dict:
    #         sub_num_dict[sub_id] = sub_counter
    #         sub_counter += 1
    #
    # pair_data['subNum'] = pair_data['subId'].map(sub_num_dict)
    #
    # img_num_dict = {}
    # img_counter = 0
    #
    # for im1_name in pair_data['im1']:
    #     # im1_name = os.path.splitext(os.path.basename(im1))[0]
    #     # im1_splits = im1_name.split('-')
    #     #
    #     # if len(im1_splits) == 3:
    #     #     # gt-image
    #     #     im1_name = im1_splits[-1]
    #     # else:
    #     #     im1_name = im1_name.split('_')[0]
    #
    #     if im1_name not in img_num_dict:
    #         img_num_dict[im1_name] = img_counter
    #         img_counter += 1
    #
    # pair_data['im1_num'] = pair_data['im1'].map(img_num_dict)