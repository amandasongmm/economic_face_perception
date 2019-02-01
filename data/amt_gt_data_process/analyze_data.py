import json
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import spearmanr
import os
import os.path
import shutil


def get_likert_data(likert_csv, trial_csv):
    if os.path.exists(likert_csv):
        likert_data = pd.read_csv(likert_csv)
    else:
        column_names = ["subId", "trialNum", "trialId", "jsonStr"]
        trial = pd.read_csv(trial_csv, names=column_names, header=None)

        likert_data = pd.DataFrame(columns=['subId', 'rt', 'imgName', 'rating', 'trial_index', 'debug_mode'])
        likert_counter = 0

        for index, row in trial.iterrows():
            json_dict = json.loads(row['jsonStr'])
            if 'task_type' in json_dict:
                if json_dict['task_type'] == 'face trials':
                    likert_data.loc[likert_counter, 'subId'] = row['subId']
                    likert_data.loc[likert_counter, 'rt'] = json_dict['rt']
                    likert_data.loc[likert_counter, 'imgName'] = os.path.basename(json_dict['imgName'])

                    likert_data.loc[likert_counter, 'trial_index'] = json_dict['trial_index']
                    # rating encoding starts from 0, add 1 to go back to 1-9 space
                    likert_data.loc[likert_counter, 'rating'] = json.loads(json_dict['responses'])['Q0'] + 1
                    likert_data.loc[likert_counter, 'debug_mode'] = json_dict['debug_mode']
                    likert_counter += 1

        likert_data.to_csv(likert_csv)
    return likert_data


# make a list for subjects
def comp_group_correlation(gt_rating_name, trait_name, sub_folder_prefix, sub_folder_name, likert_csv, trial_csv):

    # either parse likert_data (rating data) from trialdata.csv, or directly read saved likert_data
    likert_data = get_likert_data(likert_csv, trial_csv)

    # rename subject from subjectId to subNum
    sub_num_dict = {}
    sub_counter = 1
    for sub_id in likert_data['subId']:
        if sub_id not in sub_num_dict:
            sub_num_dict[sub_id] = sub_counter
            sub_counter += 1

    likert_data['subNum'] = likert_data['subId'].map(sub_num_dict)

    # reindex imgName to imgNumber
    img_num_dict = {}
    img_counter = 0
    for img_name in likert_data['imgName']:
        if img_name not in img_num_dict:
            img_num_dict[img_name] = img_counter
            img_counter += 1

    likert_data['imgNum'] = likert_data['imgName'].map(img_num_dict)

    # sort rating data by subNum and imgNum
    likert_data = likert_data.sort_values(by=['subNum', 'imgNum'], ascending=True)

    likert_data = likert_data[['subNum', 'imgNum', 'rating', 'rt', 'imgName', 'subId']]
    likert_data['rating'] = likert_data['rating'].astype(np.float64)

    # compute subject self-consistency by checking repeated trials.
    rho_lst, p_lst = [], []
    total_sub_num = likert_data['subNum'].nunique()
    print('Sub num = {}'.format(total_sub_num))

    for sub_num in range(1, total_sub_num+1):
        cur_sub_data = likert_data[likert_data['subNum'] == sub_num]
        cur_sub_data['freq'] = cur_sub_data.groupby('imgNum')['imgNum'].transform('count')
        repeat_lst = cur_sub_data[cur_sub_data['freq'] == 2]
        p = repeat_lst.sort_values(by=['imgNum'])
        p1 = p[::2]
        p2 = p[1::2]

        first_half = p1['rating'].values
        second_half = p2['rating'].values
        rho, p = spearmanr(first_half, second_half)
        rho_lst.append(rho)
        p_lst.append(p)

    qualified_sub_lst = []

    for i, (rho, p) in enumerate(zip(rho_lst, p_lst)):
        if p < 0.05 and rho > 0.:
            qualified_sub_lst.append(i + 1)

    print('consistent subject number = {}'.format(len(qualified_sub_lst)))
    data_df = likert_data[likert_data['subNum'].isin(qualified_sub_lst)]
    data_df = data_df.groupby('imgNum', as_index=False)['rating'].mean()
    # print('Consistent trial num = {}'.format(len(data_df)))

    # all data
    all_data_df = likert_data.groupby('imgNum', as_index=False)['rating'].mean()
    # print('Total trial num = {}'.format(len(all_data_df)))

    # model prediction
    gt_rating_df = pd.read_csv(gt_rating_name)
    gt_rating_df['imgNum'] = gt_rating_df['Filename'].map(img_num_dict)
    gt_rating_df = gt_rating_df.sort_values(by=['imgNum'], ascending=True)
    gt_rating_df[trait_name] = gt_rating_df[trait_name].astype(np.float64)
    gt_df = gt_rating_df.groupby('imgNum', as_index=False)[trait_name].mean()

    if sub_folder_prefix == 'modifae_' or sub_folder_prefix == 'modifae_new_':
        gt_df[trait_name] = gt_df[trait_name] * 4 + 5  # to convert the range from [-1, 1] to [1, 9]

    def plot_scatter(human_rating, model_rating, flag):
        rho, p = spearmanr(human_rating, model_rating)
        print('{}, rho={:.2f}, p={:.2f}'.format(flag, rho, p))

        if flag == 'qualified':
            title_txt = '{}: rho={:.2f}, p={:.2f}, sub={},{}'.format(trait_name, rho, p, len(qualified_sub_lst), flag)
        else:
            title_txt = '{}: rho={:.2f}, p={:.2f}, sub={},{}'.format(trait_name, rho, p, total_sub_num, flag)

        plt.title(title_txt)
        plt.xlabel('Human rating')
        plt.ylabel('Model prediction')

        ## setting the limits on the x-axis and y-axis
        plt.xlim(1, 9)
        plt.ylim(1, 9)
        plt.grid(color='gray', linestyle='--')
        plt.axes().set_aspect('equal')
        plt.scatter(human_rating, model_rating)

        if flag == 'qualified':
            plt.savefig('./' + sub_folder_name + '/'+trait_name+'_qualfied_sub_with_model.png')
        else:
            plt.savefig('./' + sub_folder_name + '/'+trait_name +'_all_sub_with_model.png')
        # plt.show()
        plt.close()

    plot_scatter(human_rating=data_df['rating'], model_rating=gt_df[trait_name], flag='qualified')
    plot_scatter(human_rating=all_data_df['rating'], model_rating=gt_df[trait_name], flag='all')


def comp_for_one_exp(trait_name, sub_folder_prefix):
    # trait_name = 'intelligent'
    # sub_folder_prefix = 'modifae_'  # for gt data, sub_folder_name = ''
    # sub_folder_prefix = 'modifae_new_'  # for gt data, sub_folder_name = ''

    sub_folder_name = sub_folder_prefix + trait_name
    print('Analyzing {}'.format(sub_folder_name))

    if sub_folder_prefix == '':
        gt_rating_name = '../../preparation_data/amt_gt_validation/' + trait_name + '_stim_lst.csv'
    elif sub_folder_prefix == 'modifae_':
        gt_rating_name = '../../preparation_data/amt_modifAE_single_rating/' + trait_name + '_stim_lst.csv'

    else:
        gt_rating_name = '../../preparation_data/amt_modifae_new_single/' + trait_name + '_stim_lst.csv'

    if not os.path.isdir('./' + sub_folder_name):
        os.makedirs('./' + sub_folder_name)

    likert_csv = './' + sub_folder_name + '/likert_data.csv'
    trial_csv = './' + sub_folder_name + '/trialdata.csv'

    if not os.path.isfile(trial_csv):
        shutil.move("../../ptdir/trialdata.csv", "./" + sub_folder_name + '/trialdata.csv')
        shutil.move("../../ptdir/eventdata.csv", "./" + sub_folder_name + '/eventdata.csv')
        shutil.move("../../ptdir/questiondata.csv", "./" + sub_folder_name + '/questiondata.csv')
        db_file_name = []
        for cur_file in os.listdir("../../ptdir/"):
            if cur_file.endswith(".db"):
                db_file_name = cur_file
        shutil.move("../../ptdir/" + db_file_name, "./" + sub_folder_name + '/' + db_file_name)

    comp_group_correlation(gt_rating_name, trait_name, sub_folder_prefix, sub_folder_name, likert_csv, trial_csv)
    return


def ground_truth_correlation_summary():
    return


if __name__ == '__main__':
    # comp_for_one_exp(trait_name='aggressive', sub_folder_prefix='')
    # comp_for_one_exp(trait_name='attractive', sub_folder_prefix='')
    # comp_for_one_exp(trait_name='trustworthy', sub_folder_prefix='')
    # comp_for_one_exp(trait_name='intelligent', sub_folder_prefix='')

    trait_lst = ['attractive', 'aggressive', 'trustworthy', 'intelligent']
    for trait_name in trait_lst:
        print('=============')
        comp_for_one_exp(trait_name=trait_name, sub_folder_prefix='modifae_new_')
