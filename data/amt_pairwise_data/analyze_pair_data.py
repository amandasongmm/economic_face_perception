import pandas as pd
import os

task_type = 'modifae'
trait_name = 'attractive'
high_low_type = 'mid-high'

pair_data_csv = './' + task_type + '/' + trait_name + '-' + high_low_type + '/pair_data.csv'
pair_data = pd.read_csv(pair_data_csv, index_col=0)


# sanity check.
sub_num_dict = {}
sub_counter = 1
for sub_id in pair_data['subId']:
    if sub_id not in sub_num_dict:
        sub_num_dict[sub_id] = sub_counter
        sub_counter += 1
pair_data['subNum'] = pair_data['subId'].map(sub_num_dict)


pair_uid_lst = []
for i in pair_data['im1']:
    pair_uid_lst.append(os.path.basename(i).split('.png')[0].split('_')[0])
pair_data['pair_ind'] = pair_uid_lst



