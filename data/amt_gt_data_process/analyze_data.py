import json
import pandas as pd
import time
import numpy as np
import scipy.stats
import matplotlib.pyplot as plt
from scipy.stats import spearmanr
import os


trait_name = 'intelligent'
likert_csv = './' + trait_name + '/likert_data.csv'


if os.path.exists(likert_csv):
    likert_data = pd.read_csv(likert_csv)
else:
    trial_csv = './' + trait_name + '/trialdata.csv'
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

    likert_data.to_csv('./' + trait_name + '/likert_data.csv')

# make a list for subjects

sub_num_dict = {}
sub_counter = 1
for sub_id in likert_data['subId']:
    if sub_id not in sub_num_dict:
        sub_num_dict[sub_id] = sub_counter
        sub_counter += 1

likert_data['subNum'] = likert_data['subId'].map(sub_num_dict)

img_num_dict = {}
img_counter = 0
for img_name in likert_data['imgName']:
    if img_name not in img_num_dict:
        img_num_dict[img_name] = img_counter
        img_counter += 1

likert_data['imgNum'] = likert_data['imgName'].map(img_num_dict)

likert_data = likert_data.sort_values(by=['subNum', 'imgNum'], ascending=True)

likert_data = likert_data[['subNum', 'imgNum', 'rating', 'rt', 'imgName', 'subId']]
likert_data['rating'] = likert_data['rating'].astype(np.float64)

# filter out unqualified subjects
rho_lst, p_lst = [], []
for sub_num in range(1, 16):
    cur_sub_data = likert_data[likert_data['subNum']==sub_num]
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
    else:
        print(rho, p)

print len(qualified_sub_lst)
data_df = likert_data[likert_data['subNum'].isin(qualified_sub_lst)]
data_df = data_df.groupby('imgNum', as_index=False)['rating'].mean()

# all data
all_data_df = likert_data.groupby('imgNum', as_index=False)['rating'].mean()

# model prediction
gt_rating_name = '../../preparation_data/amt_gt_validation/'+trait_name+'_stim_lst.csv'
gt_rating_df = pd.read_csv(gt_rating_name)
gt_rating_df['imgNum'] = gt_rating_df['Filename'].map(img_num_dict)
gt_rating_df = gt_rating_df.sort_values(by=['imgNum'], ascending=True)
gt_rating_df[trait_name] = gt_rating_df[trait_name].astype(np.float64)
gt_df = gt_rating_df.groupby('imgNum', as_index=False)[trait_name].mean()

rho, p = spearmanr(data_df['rating'], gt_df[trait_name])
print rho, p, 'qualified subject data'
title_txt = '{}: rho = {:.2f}, p = {:.2f}. sub = {}'.format(trait_name, rho, p, len(qualified_sub_lst))
plt.title(title_txt)
plt.xlabel('Human rating')
plt.ylabel('Model prediction')

## setting the limits on the x-axis and y-axis
plt.xlim(1.5, 8.5)
plt.ylim(1.5, 8.5)
plt.grid(color='gray', linestyle='--')
plt.axes().set_aspect('equal')
plt.scatter(data_df['rating'], gt_df[trait_name])
plt.savefig('./' + trait_name + '/qualified_sub_with_model.png')
plt.show()


rho2, p2 = spearmanr(all_data_df['rating'], gt_df[trait_name])
print rho2, p2, 'Use all data'
title_txt = '{}: rho = {:.2f}, p = {:.2f}. sub = {}'.format(trait_name, rho2, p2, 15)
plt.title(title_txt)
plt.xlabel('Human rating')
plt.ylabel('Model prediction')

## setting the limits on the x-axis and y-axis
plt.xlim(1.5, 8.5)
plt.ylim(1.5, 8.5)
plt.grid(color='gray', linestyle='--')
plt.axes().set_aspect('equal')
plt.scatter(data_df['rating'], gt_df[trait_name])
plt.savefig('./' + trait_name + '/all_sub_with_model.png')
plt.show()
