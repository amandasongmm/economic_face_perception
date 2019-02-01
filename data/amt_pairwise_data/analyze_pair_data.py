from __future__ import division
import pandas as pd
import os
import re
from scipy.stats import binom_test


def comp_stargan(trait_lst):
    task_type = 'stargan'
    high_low_type = 'low-high'

    standard_trial_num = 100

    for trait_name in trait_lst:
        print('==============\n{}'.format(trait_name))
        pair_data_csv = './' + task_type + '/' + trait_name + '-' + high_low_type + '/pair_data.csv'
        pair_data = pd.read_csv(pair_data_csv, index_col=None)

        # convert subId to subNum
        sub_num_dict = {}
        sub_counter = 1
        for sub_id in pair_data['subId']:
            if sub_id not in sub_num_dict:
                sub_num_dict[sub_id] = sub_counter
                sub_counter += 1
        pair_data['subNum'] = pair_data['subId'].map(sub_num_dict)

        correct_count = 0
        correct_total = 0

        gt_count = 0
        gt_total = 0

        task_count = 0
        task_total = 0

        # compute accuracy by subject.
        total_sub_num = pair_data['subNum'].nunique()
        above_chance_sub_num = 0
        above_chance_sub_lst = []
        for cur_sub_num in range(1, total_sub_num+1):

            cur_sub_data = pair_data[pair_data['subNum'] == cur_sub_num]
            cur_sub_total = len(cur_sub_data)
            cur_sub_correct_count = 0

            cur_sub_task_correct = 0
            cur_sub_task_total = 0

            cur_sub_gt_correct = 0
            cur_sub_gt_total = 0

            for ind, row in cur_sub_data.iterrows():
                im1, im2 = os.path.basename(row['im1']), os.path.basename(row['im2'])

                # test if the index matches. Test passed.
                im1_ind, im2_ind = re.findall(r'\d+', im1)[0], re.findall(r'\d+', im2)[0]
                if im1_ind != im2_ind:
                    print im1_ind, im2_ind

                # next, test if the low_first is correct.
                if im1[:4] == 'star':
                    cur_sub_task_total += 1
                    im1_high_low = im1.split('.png')[0][-2:]
                    if im1_high_low == 'lo':
                        response_should_be = 'right'
                        if trait_name == 'trustworthy':
                            response_should_be = 'left'
                    else:
                        response_should_be = 'left'
                        if trait_name == 'trustworthy':
                            response_should_be = 'right'

                    if row['response'] == response_should_be:
                        cur_sub_task_correct += 1
                else:
                    cur_sub_gt_total += 1
                    low_status = im1.split('-')[1]
                    if low_status == 'low':
                        response_should_be = 'right'
                    else:
                        response_should_be = 'left'

                    if row['response'] == response_should_be:
                        cur_sub_gt_correct += 1

                if row['response'] == response_should_be:
                    cur_sub_correct_count += 1

            sub_acc = cur_sub_correct_count / cur_sub_total
            sub_task_acc = cur_sub_task_correct / cur_sub_task_total

            p_binomial = binom_test(cur_sub_task_correct, cur_sub_task_total, alternative='greater')

            if cur_sub_gt_total == 0:
                sub_gt_acc = 0
            else:
                sub_gt_acc = cur_sub_gt_correct / cur_sub_gt_total

            print('cur sub = {}, task acc = {:.2f}, task p = {:.2f}, gt acc={:.2f}. task trials = {}, gt trials = {}'.format(
                cur_sub_num, sub_task_acc, p_binomial, sub_gt_acc, cur_sub_task_total, cur_sub_gt_total))

            if p_binomial < 0.05:
                above_chance_sub_lst.append(cur_sub_num)
                above_chance_sub_num += 1

            if cur_sub_total == standard_trial_num:
                correct_count += cur_sub_correct_count
                correct_total += standard_trial_num

                gt_count += cur_sub_gt_correct
                gt_total += cur_sub_gt_total

                task_count += cur_sub_task_correct
                task_total += cur_sub_task_total

        acc = correct_count / correct_total
        task_acc = task_count / task_total
        gt_acc = gt_count / gt_total
        p_binomial_cur_trait = binom_test(task_count, task_total, alternative='greater')
        p_binomial_gt = binom_test(gt_count, gt_total, alternative='greater')

        print('cur trait: {}, task acc = {:.2f}, p = {:.2f}, gt acc = {:.2f}, p = {:.2f}. '
              '{} out of {} above chance.'.format(
            trait_name, task_acc, p_binomial_cur_trait, gt_acc, p_binomial_gt, above_chance_sub_num, total_sub_num))

        #
        # print('p value for {} task is {:.2f}. p for ground truth pairs is {:.2f}. p < 0.05 means above chance.'.format(
        #     trait_name, p_binomial_cur_trait, p_binomial_gt))
        #
        # print('{} out of {} subjects are above chance for star-gan pairs.'.format(above_chance_sub_num, total_sub_num))


def comp_modifae_old_data(high_low_type_lst, trait_lst):
    task_type = 'modifae'
    standard_trial_num = 100
    gc_acc_threshold = 0.5
    for trait_name in trait_lst:
        print('================')

        for high_low_type in high_low_type_lst:

            if high_low_type == 'low-high':
                right_lst = ['-0.75', '-0.5']
                left_lst = ['0.75', '0.5']
            elif high_low_type == 'low-mid':
                right_lst = ['-0.75', '-0.5']
                left_lst = ['0.0']
            else:
                right_lst = ['0.0']
                left_lst = ['0.75', '0.5']

            print task_type, trait_name, high_low_type
            pair_data_csv = './' + task_type + '/' + trait_name + '-' + high_low_type + '/pair_data.csv'
            pair_data = pd.read_csv(pair_data_csv, index_col=None)

            sub_num_dict = {}
            sub_counter = 1
            for sub_id in pair_data['subId']:
                if sub_id not in sub_num_dict:
                    sub_num_dict[sub_id] = sub_counter
                    sub_counter += 1
            pair_data['subNum'] = pair_data['subId'].map(sub_num_dict)

            correct_count, correct_total = 0, 0
            gt_count, gt_total = 0, 0
            task_count, task_total = 0, 0

            # compute accuracy by subject.

            total_sub_num = pair_data['subNum'].nunique()
            above_chance_sub_num = 0
            for cur_sub_num in range(1, total_sub_num+1):

                cur_sub_data = pair_data[pair_data['subNum']==cur_sub_num]
                cur_sub_total = len(cur_sub_data)
                cur_sub_correct_count = 0

                cur_sub_task_correct = 0
                cur_sub_task_total = 0

                cur_sub_gt_correct = 0
                cur_sub_gt_total = 0

                for ind, row in cur_sub_data.iterrows():
                    im1, im2 = os.path.basename(row['im1']), os.path.basename(row['im2'])

                    # test if the index matches. Test passed.
                    im1_ind, im2_ind = re.findall(r'\d+', im1)[0], re.findall(r'\d+', im2)[0]
                    if im1_ind != im2_ind:
                        print im1_ind, im2_ind

                    # next, test if the low_first is correct.
                    if im1[0] == '1':
                        cur_sub_task_total += 1
                        im1_high_low = im1.split('.png')[0].split('_')[1]
                        if im1_high_low in right_lst:
                            response_should_be = 'right'
                        elif im1_high_low in left_lst:
                            response_should_be = 'left'
                        else:
                            print im1_high_low
                        if row['response'] == response_should_be:
                            cur_sub_task_correct += 1
                    else:
                        cur_sub_gt_total += 1
                        low_status = im1.split('-')[1]
                        if low_status == 'low':
                            response_should_be = 'right'
                        else:
                            response_should_be = 'left'

                        if row['response'] == response_should_be:
                            cur_sub_gt_correct += 1

                    if row['response'] == response_should_be:
                        cur_sub_correct_count += 1

                sub_acc = cur_sub_correct_count / cur_sub_total
                sub_task_acc = cur_sub_task_correct / cur_sub_task_total

                if cur_sub_gt_total == 0:
                    sub_gt_acc = 0
                else:
                    sub_gt_acc = cur_sub_gt_correct / cur_sub_gt_total

                p_binomial = binom_test(cur_sub_task_correct, cur_sub_task_total, alternative='greater')
                p_gt_bi = binom_test(cur_sub_gt_correct, cur_sub_gt_total, alternative='greater')

                if p_binomial < 0.05:
                    above_chance_sub_num += 1

                # print('cur sub = {}, task acc = {:.2f}, task p = {:.2f}, gt acc={:.2f}, gt p = {:.2f}. '
                #       'task trials = {}, gt trials = {}'.format(cur_sub_num, sub_task_acc, p_binomial,
                #                                                 sub_gt_acc, p_gt_bi, cur_sub_task_total, cur_sub_gt_total))

                if cur_sub_total == standard_trial_num and sub_gt_acc > gc_acc_threshold:
                    correct_count += cur_sub_correct_count
                    correct_total += standard_trial_num

                    gt_count += cur_sub_gt_correct
                    gt_total += cur_sub_gt_total

                    task_count += cur_sub_task_correct
                    task_total += cur_sub_task_total

            acc = correct_count / correct_total
            task_acc = task_count / task_total
            gt_acc = gt_count / gt_total

            p_binomial_cur_trait = binom_test(task_count, task_total, alternative='greater')
            p_binomial_gt = binom_test(gt_count, gt_total, alternative='greater')

            print('cur trait: {}, task acc = {:.2f}, p = {:.2f}, gt acc = {:.2f}, p = {:.2f}. '
                  '{} out of {} above chance. gt threshold = {:.2f}'.format(
                trait_name, task_acc, p_binomial_cur_trait, gt_acc, p_binomial_gt, above_chance_sub_num,
                total_sub_num, gc_acc_threshold))

        # print('cur trait = {}, correct {} out of {}, accuracy = {:.2f}'.format(trait_name, correct_count,
        #                                                                        correct_total, acc))
        # print('cur trait = {}, task acc = {:2f}, gt acc = {:.2f}'.format(trait_name, task_acc, gt_acc))

#
# def comp_modifae_low_mid():
#     task_type = 'modifae'
#     high_low_type = 'low-mid'
#     trait_lst = ['attractive', 'aggressive', 'trustworthy', 'intelligent']
#     standard_trial_num = 100
#     gc_acc_threshold = 0.50
#
#     for trait_name in trait_lst:
#         print trait_name
#         pair_data_csv = './' + task_type + '/' + trait_name + '-' + high_low_type + '/pair_data.csv'
#         pair_data = pd.read_csv(pair_data_csv, index_col=None)
#
#
#         # sanity check.
#         sub_num_dict = {}
#         sub_counter = 1
#         for sub_id in pair_data['subId']:
#             if sub_id not in sub_num_dict:
#                 sub_num_dict[sub_id] = sub_counter
#                 sub_counter += 1
#         pair_data['subNum'] = pair_data['subId'].map(sub_num_dict)
#
#
#         correct_count = 0
#         correct_total = 0
#
#         gt_count = 0
#         gt_total = 0
#
#         task_count = 0
#         task_total = 0
#
#         # compute accuracy by subject.
#         for cur_sub_num in range(1, pair_data['subNum'].nunique()+1):
#
#             cur_sub_data = pair_data[pair_data['subNum']==cur_sub_num]
#             cur_sub_total = len(cur_sub_data)
#             cur_sub_correct_count = 0
#
#             cur_sub_task_correct = 0
#             cur_sub_task_total = 0
#
#             cur_sub_gt_correct = 0
#             cur_sub_gt_total = 0
#
#             for ind, row in cur_sub_data.iterrows():
#                 im1, im2 = os.path.basename(row['im1']), os.path.basename(row['im2'])
#
#                 # test if the index matches. Test passed.
#                 im1_ind, im2_ind = re.findall(r'\d+', im1)[0], re.findall(r'\d+', im2)[0]
#                 if im1_ind != im2_ind:
#                     print im1_ind, im2_ind
#
#                 # next, test if the low_first is correct.
#                 if im1[0] == '1':
#                     cur_sub_task_total += 1
#                     im1_high_low = im1.split('.png')[0].split('_')[1]
#                     if im1_high_low == '-0.75' or im1_high_low == '-0.5':
#                         response_should_be = 'right'
#                     elif im1_high_low == '0.0':
#                         response_should_be = 'left'
#                     else:
#                         print im1_high_low
#                     if row['response'] == response_should_be:
#                         cur_sub_task_correct += 1
#                 else:
#                     cur_sub_gt_total += 1
#                     low_status = im1.split('-')[1]
#                     if low_status == 'low':
#                         response_should_be = 'right'
#                     else:
#                         response_should_be = 'left'
#
#                     if row['response'] == response_should_be:
#                         cur_sub_gt_correct += 1
#
#                 if row['response'] == response_should_be:
#                     cur_sub_correct_count += 1
#
#             sub_acc = cur_sub_correct_count / cur_sub_total
#             sub_task_acc = cur_sub_task_correct / cur_sub_task_total
#
#             if cur_sub_gt_total == 0:
#                 sub_gt_acc = 0
#             else:
#                 sub_gt_acc = cur_sub_gt_correct / cur_sub_gt_total
#
#             print('cur sub = {}, total trial {}, total acc = {:.2f}, task acc = {:.2f}, gt acc={:.2f}'.format(
#                     cur_sub_num, cur_sub_total, sub_acc, sub_task_acc, sub_gt_acc))
#
#             if cur_sub_total == standard_trial_num and sub_gt_acc > gc_acc_threshold:
#                 correct_count += cur_sub_correct_count
#                 correct_total += standard_trial_num
#
#                 gt_count += cur_sub_gt_correct
#                 gt_total += cur_sub_gt_total
#
#                 task_count += cur_sub_task_correct
#                 task_total += cur_sub_task_total
#
#         acc = correct_count / correct_total
#         task_acc = task_count / task_total
#         gt_acc = gt_count / gt_total
#
#         print('cur trait = {}, correct {} out of {}, accuracy = {:.2f}'.format(trait_name, correct_count,
#                                                                                correct_total, acc))
#         print('cur trait = {}, task acc = {:2f}, gt acc = {:.2f}'.format(trait_name, task_acc, gt_acc))
#
#
# def comp_modifae_mid_high():
#     task_type = 'modifae'
#     high_low_type = 'mid-high'
#     trait_lst = ['attractive', 'aggressive', 'trustworthy', 'intelligent']
#     standard_trial_num = 100
#     gc_acc_threshold = 0.50
#
#     for trait_name in trait_lst:
#         print trait_name
#         pair_data_csv = './' + task_type + '/' + trait_name + '-' + high_low_type + '/pair_data.csv'
#         pair_data = pd.read_csv(pair_data_csv, index_col=None)
#
#
#         # sanity check.
#         sub_num_dict = {}
#         sub_counter = 1
#         for sub_id in pair_data['subId']:
#             if sub_id not in sub_num_dict:
#                 sub_num_dict[sub_id] = sub_counter
#                 sub_counter += 1
#         pair_data['subNum'] = pair_data['subId'].map(sub_num_dict)
#
#
#         # pair_uid_lst = []
#         # for i in pair_data['im1']:
#         #     pair_uid_lst.append(os.path.basename(i).split('.png')[0].split('_')[0])
#         # pair_data['pair_ind'] = pair_uid_lst
#
#         correct_count = 0
#         correct_total = 0
#
#         gt_count = 0
#         gt_total = 0
#
#         task_count = 0
#         task_total = 0
#
#         # compute accuracy by subject.
#         for cur_sub_num in range(1, pair_data['subNum'].nunique()+1):
#
#             cur_sub_data = pair_data[pair_data['subNum']==cur_sub_num]
#             cur_sub_total = len(cur_sub_data)
#             cur_sub_correct_count = 0
#
#             cur_sub_task_correct = 0
#             cur_sub_task_total = 0
#
#             cur_sub_gt_correct = 0
#             cur_sub_gt_total = 0
#
#             for ind, row in cur_sub_data.iterrows():
#                 im1, im2 = os.path.basename(row['im1']), os.path.basename(row['im2'])
#
#                 # test if the index matches. Test passed.
#                 im1_ind, im2_ind = re.findall(r'\d+', im1)[0], re.findall(r'\d+', im2)[0]
#                 if im1_ind != im2_ind:
#                     print im1_ind, im2_ind
#
#                 # next, test if the low_first is correct.
#                 if im1[0] == '1':
#                     cur_sub_task_total += 1
#                     im1_high_low = im1.split('.png')[0].split('_')[1]
#                     if im1_high_low == '0.0':
#                         response_should_be = 'right'
#                     elif im1_high_low == '0.75' or im1_high_low == '0.5':
#                         response_should_be = 'left'
#                     else:
#                         print im1_high_low
#                     if row['response'] == response_should_be:
#                         cur_sub_task_correct += 1
#                 else:
#                     cur_sub_gt_total += 1
#                     low_status = im1.split('-')[1]
#                     if low_status == 'low':
#                         response_should_be = 'right'
#                     else:
#                         response_should_be = 'left'
#
#                     if row['response'] == response_should_be:
#                         cur_sub_gt_correct += 1
#
#                 if row['response'] == response_should_be:
#                     cur_sub_correct_count += 1
#
#             sub_acc = cur_sub_correct_count / cur_sub_total
#             sub_task_acc = cur_sub_task_correct / cur_sub_task_total
#
#             if cur_sub_gt_total == 0:
#                 sub_gt_acc = 0
#             else:
#                 sub_gt_acc = cur_sub_gt_correct / cur_sub_gt_total
#
#             print('cur sub = {}, total trial {}, total acc = {:.2f}, task acc = {:.2f}, gt acc={:.2f}'.format(
#                     cur_sub_num, cur_sub_total, sub_acc, sub_task_acc, sub_gt_acc))
#
#             if cur_sub_total == standard_trial_num and sub_gt_acc > gc_acc_threshold:
#                 correct_count += cur_sub_correct_count
#                 correct_total += standard_trial_num
#
#                 gt_count += cur_sub_gt_correct
#                 gt_total += cur_sub_gt_total
#
#                 task_count += cur_sub_task_correct
#                 task_total += cur_sub_task_total
#
#
#
#
#         # for ind, row in pair_data.iterrows():
#         #     im1, im2 = os.path.basename(row['im1']), os.path.basename(row['im2'])
#         #
#         #     # next, test if the low_first is correct.
#         #     if im1[:4] == 'star':
#         #         im1_high_low = im1.split('.png')[0][-2:]
#         #         if im1_high_low == 'low':
#         #             response_should_be = 'right'
#         #         else:
#         #             response_should_be = 'left'
#         #     else:
#         #         low_status = im1.split('-')[1]
#         #         if low_status == 'low':
#         #             response_should_be = 'right'
#         #         else:
#         #             response_should_be = 'left'
#         #
#         #     if row['response'] == response_should_be:
#         #         correct_count += 1
#
#         acc = correct_count / correct_total
#         task_acc = task_count / task_total
#         gt_acc = gt_count / gt_total
#
#         print('cur trait = {}, correct {} out of {}, accuracy = {:.2f}'.format(trait_name, correct_count,
#                                                                                correct_total, acc))
#         print('cur trait = {}, task acc = {:2f}, gt acc = {:.2f}'.format(trait_name, task_acc, gt_acc))
#
#
# def comp_modifae_new():
#
#     task_type = 'modifae'
#     high_low_type = 'mid-high'
#     trait_lst = ['aggressive_new']
#
#     standard_trial_num = 100
#
#     gc_acc_threshold = 0.50
#
#     for trait_name in trait_lst:
#         print trait_name
#         pair_data_csv = './' + task_type + '/' + trait_name + '-' + high_low_type + '/pair_data.csv'
#         pair_data = pd.read_csv(pair_data_csv, index_col=None)
#
#         # sanity check.
#         sub_num_dict = {}
#         sub_counter = 1
#         for sub_id in pair_data['subId']:
#             if sub_id not in sub_num_dict:
#                 sub_num_dict[sub_id] = sub_counter
#                 sub_counter += 1
#         pair_data['subNum'] = pair_data['subId'].map(sub_num_dict)
#
#         # pair_uid_lst = []
#         # for i in pair_data['im1']:
#         #     pair_uid_lst.append(os.path.basename(i).split('.png')[0].split('_')[0])
#         # pair_data['pair_ind'] = pair_uid_lst
#
#         correct_count = 0
#         correct_total = 0
#
#         gt_count = 0
#         gt_total = 0
#
#         task_count = 0
#         task_total = 0
#
#         # compute accuracy by subject.
#         for cur_sub_num in range(1, pair_data['subNum'].nunique() + 1):
#
#             cur_sub_data = pair_data[pair_data['subNum'] == cur_sub_num]
#             cur_sub_total = len(cur_sub_data)
#             cur_sub_correct_count = 0
#
#             cur_sub_task_correct = 0
#             cur_sub_task_total = 0
#
#             cur_sub_gt_correct = 0
#             cur_sub_gt_total = 0
#
#             for ind, row in cur_sub_data.iterrows():
#                 im1, im2 = os.path.basename(row['im1']), os.path.basename(row['im2'])
#
#                 # test if the index matches. Test passed.
#                 im1_ind, im2_ind = re.findall(r'\d+', im1)[0], re.findall(r'\d+', im2)[0]
#                 if im1_ind != im2_ind:
#                     print im1_ind, im2_ind
#
#                 # next, test if the low_first is correct.
#                 if im1[0] == '1':
#                     cur_sub_task_total += 1
#                     im1_high_low = im1.split('.png')[0].split('_')[1]
#                     if im1_high_low == '0.0':
#                         response_should_be = 'right'
#                     elif im1_high_low == '1':
#                         response_should_be = 'left'
#                     else:
#                         print im1_high_low
#                     if row['response'] == response_should_be:
#                         cur_sub_task_correct += 1
#                 else:
#                     cur_sub_gt_total += 1
#                     low_status = im1.split('-')[1]
#                     if low_status == 'mid':
#                         response_should_be = 'right'
#                     elif low_status == 'high':
#                         response_should_be = 'left'
#                     else:
#                         print low_status
#
#                     if row['response'] == response_should_be:
#                         cur_sub_gt_correct += 1
#
#                 if row['response'] == response_should_be:
#                     cur_sub_correct_count += 1
#
#             sub_acc = cur_sub_correct_count / cur_sub_total
#             sub_task_acc = cur_sub_task_correct / cur_sub_task_total
#
#             if cur_sub_gt_total == 0:
#                 sub_gt_acc = 0
#             else:
#                 sub_gt_acc = cur_sub_gt_correct / cur_sub_gt_total
#
#             print('cur sub = {}, total trial {}, total acc = {:.2f}, task acc = {:.2f}, gt acc={:.2f}'.format(
#                 cur_sub_num, cur_sub_total, sub_acc, sub_task_acc, sub_gt_acc))
#
#             if cur_sub_total == standard_trial_num and sub_gt_acc > gc_acc_threshold:
#                 correct_count += cur_sub_correct_count
#                 correct_total += standard_trial_num
#
#                 gt_count += cur_sub_gt_correct
#                 gt_total += cur_sub_gt_total
#
#                 task_count += cur_sub_task_correct
#                 task_total += cur_sub_task_total
#
#         acc = correct_count / correct_total
#         task_acc = task_count / task_total
#         gt_acc = gt_count / gt_total
#
#         print('cur trait = {}, correct {} out of {}, accuracy = {:.2f}'.format(trait_name, correct_count,
#                                                                                correct_total, acc))
#         print('cur trait = {}, task acc = {:2f}, gt acc = {:.2f}'.format(trait_name, task_acc, gt_acc))
#     return


def comp_modifae_new_with_correct_data_format(high_low_type_lst):

    trait_lst = ['aggressive_new', 'attractive_new', 'trustworthy_new', 'intelligent_new']
    gt_acc_threshold = 0.5

    for trait_name in trait_lst:
        standard_trial_num = 100

        print('=====================')

        for high_low_type in high_low_type_lst:
            task_type = 'modifae'

            # print('trait = {}, type = {}, gt threshold = {}'.format(trait_name, high_low_type, gt_acc_threshold))

            pair_data_csv = './' + task_type + '/' + trait_name + '-' + high_low_type + '/pair_data.csv'
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
            above_chance_sub_num = 0
            for cur_sub_num in range(1, pair_data['subNum'].nunique() + 1):

                cur_sub_data = pair_data[pair_data['subNum'] == cur_sub_num]
                cur_sub_total = len(cur_sub_data)

                cur_sub_task = cur_sub_data[cur_sub_data['task_type'] == task_type]
                cur_sub_gt = cur_sub_data[cur_sub_data['task_type'] == 'gt']

                cur_sub_task_acc = (cur_sub_task['correct'] == True).sum() / len(cur_sub_task)
                cur_sub_task_correct = (cur_sub_task['correct'] == True).sum()
                cur_sub_task_total = len(cur_sub_task)


                cur_sub_gt_acc = (cur_sub_gt['correct'] == True).sum() / len(cur_sub_gt)
                cur_sub_gt_correct = (cur_sub_gt['correct'] == True).sum()
                cur_sub_gt_total = len(cur_sub_gt)


                # print('cur sub: {}, task acc: {:.2f}, gt acc: {:.2f}'.format(cur_sub_num, cur_sub_task_acc, cur_sub_gt_acc))

                p_binomial = binom_test(cur_sub_task_correct, cur_sub_task_total, alternative='greater')
                p_gt_bi = binom_test(cur_sub_gt_correct, cur_sub_gt_total, alternative='greater')

                if p_binomial < 0.05:
                    above_chance_sub_num += 1

                # print('cur sub = {}, task acc = {:.2f}, task p = {:.2f}, gt acc={:.2f}, gt p = {:.2f}. '
                #       'task trials = {}, gt trials = {}'.format(cur_sub_num, cur_sub_task_acc, p_binomial,
                #                                                 cur_sub_gt_acc, p_gt_bi, cur_sub_task_total, cur_sub_gt_total))


                if cur_sub_total == standard_trial_num and cur_sub_gt_acc > gt_acc_threshold:
                    valid_gt_correct += (cur_sub_gt['correct'] == True).sum()
                    valid_gt_count += len(cur_sub_gt)

                    valid_task_correct += (cur_sub_task['correct'] == True).sum()
                    valid_task_count += len(cur_sub_task)
                else:
                    bad_sub_lst.append(cur_sub_num)

            task_acc = valid_task_correct / valid_task_count
            gt_acc = valid_gt_correct / valid_gt_count

            # print('cur trait = {}, task acc = {:.2f}, gt acc = {:.2f}, valid trials = {}, gc threshold={:.2f}'.format(
            #     trait_name, task_acc, gt_acc, valid_task_count, gt_acc_threshold))

            p_binomial_cur_trait = binom_test(valid_task_correct, valid_task_count, alternative='greater')
            p_binomial_cur_gt = binom_test(valid_gt_correct, valid_gt_count, alternative='greater')
            # print('p value of the hypothesis test is {:.3f}'.format(p_binomial))

            print('{}, {}, task acc = {:.2f}, p = {:.2f}, gt acc = {:.2f}, p = {:.2f}. '
                  '{} out of {} above chance.gt threshold = {}'.format(
                trait_name, high_low_type, task_acc, p_binomial_cur_trait, gt_acc, p_binomial_cur_gt,
                above_chance_sub_num, pair_data['subNum'].nunique(), gt_acc_threshold))

    return




# comp_modifae_low_mid()
# comp_modifae_mid_high()
# comp_modifae_new()
# comp_modifae_new_with_correct_data_format()

comp_stargan(['aggressive', 'attractive', 'trustworthy', 'intelligent'])


# high_low_type_lst = ['low-mid', 'mid-high', 'low-high']
#
# comp_modifae_old_data(high_low_type_lst=high_low_type_lst,
#                       trait_lst=['aggressive', 'attractive', 'trustworthy', 'intelligent'])



# comp_modifae_new_with_correct_data_format(high_low_type_lst)




