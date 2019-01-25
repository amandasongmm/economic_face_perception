import os
import glob
import shutil
from shutil import copyfile
import pandas as pd
import numpy as np
from pylab import imread
import matplotlib.pyplot as plt
from sklearn.utils import shuffle
from os import listdir
import random


trait_lst = ['attractive', 'aggressive', 'trustworthy', 'intelligent']


def gen_modifae_pairwise_lst():

    # First, generate a list for modifAE.
    # Each lst contains 70 unique pairs, 20 repetitions, and 10 gt pairs.

    pair_levels = ['low-high', 'low-mid', 'mid-high']
    low_postfix, mid_postfix, high_postfix = '_-0.75.png', '_0.0.png', '_0.75.png'
    gt_img_dir = '/static/images/gt_pairwise/'
    prep_data_dir = '../../../preparation_data/amt_modifae_pairwise/'

    n_unique_num = 80
    n_rep_num = 10
    n_gt_num = 10

    for cur_trait in trait_lst:

        cur_im_dir = '../images/modifae_pairwise/' + cur_trait + '/'
        git_im_dir = '/static/images/modifae_pairwise/' + cur_trait + '/'

        cur_dir_all_file_lst = os.listdir(cur_im_dir)
        cur_dir_all_uniq_lst = set([i.split('_')[0] for i in cur_dir_all_file_lst])
        select_file_lst = list(cur_dir_all_uniq_lst)[0:n_unique_num]

        for cur_pair_level in pair_levels:

            print cur_pair_level, cur_trait

            if cur_pair_level == 'low-high':
                im1_postfix, im2_postfix = low_postfix, high_postfix
                gt_im1_lst = [gt_img_dir + cur_trait + '-low-' + str(i) + '.png' for i in range(0, n_gt_num)]
                gt_im2_lst = [gt_img_dir + cur_trait + '-high-' + str(i) + '.png' for i in range(0, n_gt_num)]

            elif cur_pair_level == 'low-mid':
                im1_postfix, im2_postfix = low_postfix, mid_postfix
                gt_im1_lst = [gt_img_dir + cur_trait + '-low-' + str(i) + '.png' for i in range(0, n_gt_num)]
                gt_im2_lst = [gt_img_dir + cur_trait + '-mid-' + str(i) + '.png' for i in range(0, n_gt_num)]

            else:
                im1_postfix, im2_postfix = mid_postfix, high_postfix
                gt_im1_lst = [gt_img_dir + cur_trait + '-mid-' + str(i) + '.png' for i in range(0, n_gt_num)]
                gt_im2_lst = [gt_img_dir + cur_trait + '-high-' + str(i) + '.png' for i in range(0, n_gt_num)]

            im1_lst = [git_im_dir + i + im1_postfix for i in select_file_lst]
            im2_lst = [git_im_dir + i + im2_postfix for i in select_file_lst]

            stim_df = pd.DataFrame({'im1_name': im1_lst,
                                    'im2_name': im2_lst,
                                    'task_type': 'modifae',
                                    'repeat': 0,
                                    'low_first': 1,
                                    'pair_ind': range(0, n_unique_num)})

            stim_repeat = stim_df.sample(n_rep_num)
            stim_repeat['repeat'] = 1

            gt_df = pd.DataFrame({'im1_name': gt_im1_lst,
                                  'im2_name': gt_im2_lst,
                                  'task_type': 'gt',
                                  'repeat': 0,
                                  'low_first': 1,
                                  'pair_ind': range(n_unique_num, n_unique_num+n_gt_num)})

            stim_df = pd.concat([stim_df, stim_repeat], ignore_index=True)
            stim_df = pd.concat([stim_df, gt_df], ignore_index=True)
            stim_df = shuffle(stim_df)
            stim_df = stim_df.sample(frac=1, random_state=1)

            rand_lst = [random.randint(0, 1) for i in range(0, len(stim_df))]

            # change the left-right order
            stim_df.is_copy = False
            for ind, row in stim_df.iterrows():
                im1_name = row['im1_name']
                im2_name = row['im2_name']

                if rand_lst[ind] == 0:
                    stim_df['im1_name'].iloc[ind] = im2_name
                    stim_df['im2_name'].iloc[ind] = im1_name
                    stim_df['low_first'].iloc[ind] = 0

            # write the df into txt.

            save_csv_name = prep_data_dir + cur_trait + '-' + cur_pair_level + '-stim-lst.csv'
            stim_df.to_csv(save_csv_name, index=False)
            # todo:
            # for some reason, when saved as csv, the order of the columns got changed. Find out why.


            # write the stim_lst into a txt file and then copy and paste into a javascript file.

            # write the df into txt format. list of lists.
            test_lst = []
            for ind, row in stim_df.iterrows():
                test_lst.append(row.values.tolist())

            save_txt_name = prep_data_dir + cur_trait + '-' + cur_pair_level + '.txt'

            with open(save_txt_name, 'w') as f:
                f.write("var stims = [\n")
                for cur_line in test_lst:
                    f.write("{},\n".format(cur_line))
                f.write('];\n')


def gen_stargan_pairwise_lst():

    # First, generate a list for modifAE.
    # Each lst contains 70 unique pairs, 20 repetitions, and 10 gt pairs.

    low_postfix, mid_postfix, high_postfix = '_-0.75.png', '_0.0.png', '_0.75.png'
    trait_abr_lst = ['attr', 'aggr', 'trust', 'intel']
    gt_img_dir = '/static/images/gt_pairwise/'
    prep_data_dir = '../../../preparation_data/amt_stargan_pairwise/'

    n_unique_num = 80
    n_rep_num = 10
    n_gt_num = 10
    pair_level = 'low-high'

    for cur_trait, cur_trait_abr in zip(trait_lst, trait_abr_lst):

        git_im_dir = '/static/images/stargan_pairwise/'

        print cur_trait

        gt_im1_lst = [gt_img_dir + cur_trait + '-low-' + str(i) + '.png' for i in range(0, n_gt_num)]
        gt_im2_lst = [gt_img_dir + cur_trait + '-high-' + str(i) + '.png' for i in range(0, n_gt_num)]

        im1_lst = [git_im_dir + 'stargan_' + str(i) + cur_trait_abr + '_hi.png' for i in range(1, n_unique_num+1)]
        im2_lst = [git_im_dir + 'stargan_' + str(i) + cur_trait_abr + '_lo.png' for i in range(1, n_unique_num+1)]

        stim_df = pd.DataFrame({'im1_name': im1_lst,
                                'im2_name': im2_lst,
                                'task_type': 'stargan',
                                'repeat': 0,
                                'low_first': 1,
                                'pair_ind': range(0, n_unique_num)})

        stim_repeat = stim_df.sample(n_rep_num)
        stim_repeat['repeat'] = 1

        gt_df = pd.DataFrame({'im1_name': gt_im1_lst,
                              'im2_name': gt_im2_lst,
                              'task_type': 'gt',
                              'repeat': 0,
                              'low_first': 1,
                              'pair_ind': range(n_unique_num, n_unique_num+n_gt_num)})

        stim_df = pd.concat([stim_df, stim_repeat], ignore_index=True)
        stim_df = pd.concat([stim_df, gt_df], ignore_index=True)
        stim_df = shuffle(stim_df)
        stim_df = stim_df.sample(frac=1, random_state=1)

        rand_lst = [random.randint(0, 1) for i in range(0, len(stim_df))]

        # change the left-right order
        stim_df.is_copy = False
        for ind, row in stim_df.iterrows():
            im1_name = row['im1_name']
            im2_name = row['im2_name']

            if rand_lst[ind] == 0:
                stim_df['im1_name'].iloc[ind] = im2_name
                stim_df['im2_name'].iloc[ind] = im1_name
                stim_df['low_first'].iloc[ind] = 0

        # write the df into txt.

        save_csv_name = prep_data_dir + cur_trait + '-stim-lst.csv'
        stim_df.to_csv(save_csv_name, index=False)
        # todo:
        # for some reason, when saved as csv, the order of the columns got changed. Find out why.

        # write the stim_lst into a txt file and then copy and paste into a javascript file.

        # write the df into txt format. list of lists.
        test_lst = []
        for ind, row in stim_df.iterrows():
            test_lst.append(row.values.tolist())

        save_txt_name = prep_data_dir + cur_trait + '-' + pair_level + '.txt'

        with open(save_txt_name, 'w') as f:
            f.write("var stims = [\n")
            for cur_line in test_lst:
                f.write("{},\n".format(cur_line))
            f.write('];\n')


if __name__ == '__main__':
    # gen_modifae_pairwise_lst()
    gen_stargan_pairwise_lst()