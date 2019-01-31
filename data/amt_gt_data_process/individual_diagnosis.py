import json
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import spearmanr
import os
import os.path
import shutil


trait_name = 'attractive'
sub_folder_prefix = ''

if sub_folder_prefix == '':
    gt_rating_name = '../../preparation_data/amt_gt_validation/' + trait_name + '_stim_lst.csv'
elif sub_folder_prefix == 'modifae_':
    gt_rating_name = '../../preparation_data/amt_modifAE_single_rating/' + trait_name + '_stim_lst.csv'
else:
    gt_rating_name = '../../preparation_data/amt_modifae_new_single/' + trait_name + '_stim_lst.csv'

sub_folder_name = sub_folder_prefix + trait_name
likert_csv = './' + sub_folder_name + '/likert_data.csv'
likert_data = pd.read_csv(likert_csv)

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

#todo: for each participant, check the frequency of the actual rating options

