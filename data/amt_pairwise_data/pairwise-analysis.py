from __future__ import division
import pandas as pd
import os
import re
from scipy.stats import binom_test


def comp_modifae_new_with_correct_data_format(high_low_type='low-high'):

    task_type = 'modifae'
    trait_name = 'intelligent_new'
    standard_trial_num = 100
    gt_acc_threshold = 0.60

    print('trait = {}, type = {}, gt threshold = {}'.format(trait_name, high_low_type, gt_acc_threshold))

    pair_data_csv = './' + task_type + '/' + trait_name + '-' + high_low_type + '/pair_data.csv'
#     pair_data_csv = 'pair_data.csv'
    pair_data = pd.read_csv(pair_data_csv, index_col=None)

    # convert subId to subNum
    sub_num_dict = {}
    sub_counter = 1
    for sub_id in pair_data['subId']:
        if sub_id not in sub_num_dict:
            sub_num_dict[sub_id] = sub_counter
            sub_counter += 1
    pair_data['subNum'] = pair_data['subId'].map(sub_num_dict)
    #

    valid_task_correct = 0
    valid_task_count = 0

    valid_gt_correct = 0
    valid_gt_count = 0

    bad_sub_lst = []
    

    remove_sub=[]
    for cur_sub_num in range(1, pair_data['subNum'].nunique() + 1):

        cur_sub_data = pair_data[pair_data['subNum'] == cur_sub_num]
        cur_sub_total = len(cur_sub_data)

        if cur_sub_total != standard_trial_num:
            remove_sub.append(cur_sub_num)
            print('cur sub total trial num = {}, removed from the data.'.format(cur_sub_num))
            bad_sub_lst.append(cur_sub_num)
        else:
            cur_sub_task = cur_sub_data[cur_sub_data['task_type'] == task_type]
            cur_sub_gt = cur_sub_data[cur_sub_data['task_type'] == 'gt']

            cur_sub_task_acc = (cur_sub_task['correct'] == True).sum() / len(cur_sub_task)
            cur_sub_gt_acc = (cur_sub_gt['correct'] == True).sum() / len(cur_sub_gt)
            print('cur sub: {}, task acc: {:.2f}, gt acc: {:.2f}'.format(cur_sub_num, cur_sub_task_acc, cur_sub_gt_acc))

            if(cur_sub_gt_acc<0.5):
                remove_sub.append(cur_sub_num)
                
            
            if cur_sub_gt_acc > gt_acc_threshold:
                valid_gt_correct += (cur_sub_gt['correct'] == True).sum()
                valid_gt_count += len(cur_sub_gt)

                valid_task_correct += (cur_sub_task['correct'] == True).sum()
                valid_task_count += len(cur_sub_task)
            else:
                bad_sub_lst.append(cur_sub_num)

    task_acc = valid_task_correct / valid_task_count
    gt_acc = valid_gt_correct / valid_gt_count

    print('cur trait = {}, task acc = {:.2f}, gt acc = {:.2f}, valid trials = {}, gc threshold={:.2f}'.format(
        trait_name, task_acc, gt_acc, valid_task_count, gt_acc_threshold))

    p_binomial = binom_test(valid_task_correct, valid_task_count, alternative='greater')
    print('p value of the hypothesis test is {:.3f}'.format(p_binomial))

    
    
    pairs={}

    for p in range(len(pair_data)):

        if sub_num_dict[pair_data.iloc[p]["subId"]] in remove_sub:
            continue
        else:
            i=pair_data.iloc[p]["pair_ind"]
            if i not in pairs:
                pairs[i]=[]
            if pair_data.iloc[p]["correct"]==True:
                pairs[i].append(1)
            else:
                pairs[i].append(0)

    for i in pairs:
        pairs[i]=sum(pairs[i])/len(pairs[i])

    sorted_pairs=sorted(pairs.items(), key=lambda x: x[1])
    print("Pair Id,Accuracy")
    for i in sorted_pairs:
        print(i[0],i[1])
    
    return



comp_modifae_new_with_correct_data_format()


