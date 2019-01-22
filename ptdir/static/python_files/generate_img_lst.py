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
from os.path import isfile, join


def gen_img_lst(key_word):
    if key_word == 'chicago':
        # Move the Chicago faces into the same folder.
        dst_dir = '../images/chicago_faces/'
        if not os.path.exists(dst_dir):
            os.makedirs(dst_dir)

            # only move the neutral faces.
            neutral_face_lst = glob.glob(
                '/Users/amanda/Github/attractiveness_datamining/ChicagoFaceDataset/CFD Version 2.0/CFD 2.0 Images/**/*-N.jpg')

            print(len(neutral_face_lst))
            for cur_face_path in neutral_face_lst:
                file_name = os.path.basename(cur_face_path)
                dst = dst_dir + file_name
                copyfile(cur_face_path, dst)
            print(len(glob.glob(dst_dir+'*')))

        # Count how many faces are in each category: [W/L/B/A] * [F/M]
        # get a list of all the face photos in the folder.
        all_neutral_faces = glob.glob(dst_dir+'*.jpg')
        keywords_lst = ['WF', 'WM', 'LF', 'LM', 'BF', 'BM', 'AF', 'AM']
        df = pd.DataFrame(data=np.zeros((1, len(keywords_lst),)), columns=keywords_lst)
        category_dict = dict((el, []) for el in keywords_lst)

        for file_path in all_neutral_faces:
            file_name = os.path.basename(file_path)
            for i in keywords_lst:
                if i in file_name:
                    df[i].iloc[0] += 1
                    category_dict[i].append(file_name)

        # Now, randomly pick up 8+2 elements from each category.
        fixed_lst = []  # 2*8=64
        main_lst = []  # 8*8=64
        fix_num_per_cat = 2
        main_num_per_cat = 8

        for key, value in category_dict.iteritems():
            fixed_lst.append(value[:fix_num_per_cat])
            main_lst.append(value[fix_num_per_cat:fix_num_per_cat+main_num_per_cat])

        # make the nested list flat.
        fixed_lst = [item for sublist in fixed_lst for item in sublist]
        main_lst = [item for sublist in main_lst for item in sublist]
        all_lst = main_lst + fixed_lst
        img_dir = '/static/images/chicago_faces/'

        # write the fixed_lst and main_lst and all_lst into the javascript format.
        with open('chicago.txt', 'w') as f:

            f.write("var fixed_lst = [\n")
            for i in fixed_lst:
                f.write("{imgname: '" + img_dir + i + "'},\n")
            f.write('];\n')

            f.write("var all_lst = [\n")
            for i in all_lst:
                f.write("{imgname: '" + img_dir + i + "'},\n")
            f.write('];\n')

            f.write("var main_lst = [\n")
            for i in main_lst:
                f.write("{imgname: '" + img_dir + i + "'},\n")
            f.write('];\n')

        # Then manually copy the txt into the chicago_lst.js file.

    if key_word == 'mit':
        dst_dir = '../images/2kfaces/'
        img_dir = '/static/images/2kfaces/'
        all_lst = glob.glob(dst_dir+'*.jpg')

        with open('mit.txt', 'w') as f:

            f.write("var all_lst = [\n")
            for cur_face_path in all_lst:
                file_name = os.path.basename(cur_face_path)
                f.write("{imgname: '" + img_dir + file_name + "'},\n")
            f.write('];\n')

        # Then manually copy the txt into the chicago_lst.js file.

    if key_word == 'gt-100-attractive':
        dst_dir = '../images/attractive/'
        img_dir = '/static/images/attractive/'
        all_lst = glob.glob(dst_dir+'*.jpg')

        with open('gt-100-attractive.txt', 'w') as f:
            f.write("var all_lst = [\n")
            for cur_face_path in all_lst:
                file_name = os.path.basename(cur_face_path)
                f.write("{imgname: '" + img_dir + file_name + "'},\n")
            f.write('];\n')

        print('Done!')


def gen_img_collage():
    img_dir = '../images/attractive/'
    all_im_lst = glob.glob(img_dir + '*.jpg')

    columns = 6
    rows = 5

    for im_id in range(0, 3):
        print im_id

        fig = plt.figure()

        for i in range(1, columns * rows + 1):

            cur_im_path = all_im_lst[im_id * columns * rows + i -1]
            image = imread(cur_im_path)

            fig.add_subplot(rows, columns, i)
            plt.axis('off')
            plt.imshow(image)

        fig.savefig('../images/collage/'+str(im_id)+'.png')


def gen_img_collage_modifae_model():

    trait_lst = ['attractive', 'aggressive', 'trustworthy', 'intelligent']

    for trait_name in trait_lst:
        print trait_name
        img_dir = '../../../ptdir/static/images/modifAE_linspace/' + trait_name + '/'
        img_save_dir = '../../../ptdir/static/images/modifAE_linspace/' + trait_name + '_collage/'

        model_rating_csv_dir = '../../../preparation_data/amt_modifAE_single_rating/' + trait_name + '_stim_lst.csv'
        model_df = pd.read_csv(model_rating_csv_dir)
        model_df = model_df.sort_values(by=[trait_name])

        if not os.path.isdir(img_save_dir):
            os.makedirs(img_save_dir)
        # 80 images in total. plot 5 figure.
        # each contain 4*4.

        fig_num = 5
        column_num = 4
        row_num = 4

        for cur_fig in range(0, fig_num):
            fig = plt.figure()

            for i in range(1, column_num * row_num + 1):
                cur_im_path = img_dir + model_df['Filename'].iloc[cur_fig*column_num*row_num + i - 1]
                model_rating = float(model_df[trait_name].iloc[cur_fig*column_num*row_num + i - 1])
                model_rating = 4 * model_rating + 5

                subtitle = '{:.1f}'.format(model_rating)
                image = imread(cur_im_path)

                fig.add_subplot(row_num, column_num, i)
                plt.axis('off')
                plt.gca().set_title(subtitle)

                plt.imshow(image)

            fig.savefig(img_save_dir + 'model-raw-rating-'+str(cur_fig) + '.png')
    return


def gen_img_collage_modifae_model_and_human():
    return


def gen_gt_stim_lst():

    trait_lst = ['attractive', 'aggressive', 'trustworthy', 'intelligent']

    rating_df = pd.read_csv('/Users/amanda/Dropbox/2019/modifAE/celeb_ratings.csv')

    n_unique_num = 80
    n_rep_num = 20

    img_src_dir = '/Users/amanda/Dropbox/dataset/celebA/oneface/'

    for trait in trait_lst:

        print trait

        dst_dir = '../images/celeba_gt_crop/'+trait+'/'

        if not os.path.exists(dst_dir):
            os.makedirs(dst_dir)

        cur_df = rating_df[['Filename', trait]]
        cur_min, cur_max = cur_df[trait].min(), cur_df[trait].max()

        anchor_lst = np.linspace(cur_min, cur_max, num=n_unique_num)
        cur_names, cur_values = [], []

        for i in range(n_unique_num):

            anchor_value = anchor_lst[i]
            cur_df['distance'] = (cur_df[trait]-anchor_value).abs()
            cur_df = cur_df.sort_values(by=['distance'])
            cur_im_name = cur_df.iloc[0]['Filename']
            shutil.copy(img_src_dir+cur_im_name, dst_dir)

            cur_names.append(cur_im_name)
            cur_values.append(cur_df.iloc[0][trait])
            cur_df.drop(cur_df.index[0], inplace=True)  # remove the selected faces so it won't appear twice.

        stim_df = pd.DataFrame(columns=[['Filename', trait, 'repeat']])
        stim_df['Filename'] = cur_names
        stim_df[trait] = cur_values
        stim_df['repeat'] = 0
        print stim_df['Filename'].nunique()

        stim_repeat = stim_df.sample(n_rep_num)
        stim_repeat['repeat'] = 1

        print stim_repeat['Filename'].nunique()

        stim_df = pd.concat([stim_df, stim_repeat], ignore_index=True)
        stim_df = shuffle(stim_df)
        stim_df = stim_df.sample(frac=1, random_state=1)
        print stim_df['Filename'].nunique()

        save_csv_name = '../../../preparation_data/amt_gt_validation/'+trait+'_stim_lst'+'.csv'
        # save_txt_name = '../../../preparation_data/amt_gt_validation/'+trait+'.txt'
        stim_df.to_csv(save_csv_name)

    # write the stim_lst into a txt file and then copy and paste into a javascript file.
    for trait in trait_lst:
        print trait
        dst_dir = '/static/images/celeba_gt_crop/' + trait + '/'
        save_csv_name = '../../../preparation_data/amt_gt_validation/'+trait+'_stim_lst'+'.csv'
        save_txt_name = '../../../preparation_data/amt_gt_validation/'+trait+'.txt'
        stim_df = pd.read_csv(save_csv_name)

        with open(save_txt_name, 'w') as f:
            f.write("var all_lst = [\n")
            for file_name in stim_df['Filename'].values:
                f.write("{imgname: '" + dst_dir + file_name + "'},\n")
            f.write('];\n')


def gen_modifae_single_rating_stim_lst(flag):

    if flag == 'new ratings':
        print flag
        img_dir_prefix = '../images/modifae_new_linspace/'
        dst_dir_prefix = '/static/images/modifae_new_linspace/'  # '/static/images/modifAE_linspace/'
        save_txt_prefix = '../../../preparation_data/amt_modifae_new_single/'

    else:
        print 'Old single ratings.'
        img_dir_prefix = '../images/modifAE_linspace/'
        dst_dir_prefix = '/static/images/modifAE_linspace/'
        save_txt_prefix = '../../../preparation_data/amt_modifAE_single_rating/'

    trait_lst = ['attractive', 'aggressive', 'trustworthy', 'intelligent']

    n_unique_num = 80
    n_rep_num = 20
    # gt_num = 2

    for trait in trait_lst:
        print trait

        img_dir = img_dir_prefix + trait + '/'
        img_lst = [f for f in listdir(img_dir) if isfile(join(img_dir, f))]

        #todo: sample n_unique elements from the list, then randomly repeat n_rep_num of them.
        #todo: save the score of the chosen list. save it as groundtruth.

        select_lst = np.random.choice(len(img_lst), size=n_unique_num, replace=False)

        rating_lst, name_lst = [], []
        for cur_ind in select_lst:
            cur_file_name = img_lst[cur_ind]
            cur_rating = cur_file_name.split(".png")[0].split("_")[1]
            cur_rating = float(cur_rating)
            name_lst.append(cur_file_name)
            rating_lst.append(cur_rating)

        stim_df = pd.DataFrame(columns=['Filename', trait])
        stim_df['Filename'] = name_lst
        stim_df[trait] = rating_lst
        stim_df['repeat'] = 0

        stim_repeat = stim_df.sample(n_rep_num)
        stim_repeat['repeat'] = 1

        stim_df = pd.concat([stim_df, stim_repeat], ignore_index=True)
        stim_df = shuffle(stim_df)
        stim_df = stim_df.sample(frac=1, random_state=1)
        print stim_df['Filename'].nunique()

        save_csv_name = save_txt_prefix + trait + '_stim_lst.csv'
        stim_df.to_csv(save_csv_name)

        dst_dir = dst_dir_prefix + trait + '/'
        save_txt_name = save_txt_prefix + trait+'.txt'

        with open(save_txt_name, 'w') as f:
            f.write("var all_lst = [\n")
            for file_name in stim_df['Filename'].values:
                f.write("{imgname: '" + dst_dir + file_name + "'},\n")
            f.write('];\n')

    return


if __name__ == '__main__':
    # gen_gt_stim_lst()
    # gen_modifae_single_rating_stim_lst()
    # gen_img_collage_modifae_model()
    gen_modifae_single_rating_stim_lst('new ratings')
    print('Done!')
