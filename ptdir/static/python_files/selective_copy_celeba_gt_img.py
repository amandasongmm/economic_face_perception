import pandas as pd
import shutil
import sys


trait_lst = ['attractive', 'aggressive', 'trustworthy', 'intelligent']


def copy_files(src_file, tar_file):
    try:
        shutil.copy(src_file, tar_file)
    except IOError as e:
        print('unable to copy file. %s' % e)
    except:
        print('Unexpected error:', sys)
    return


def select_gt_pairwise_im():
    rating_df = pd.read_csv('./celeb_ratings.csv')
    mid_num = len(rating_df) / 2
    n_gt_num = 10
    gt_img_dir = '/raid/SAGAN/CelebA/images/'

    tar_dir = '/raid/amanda/gt_triplet/'

    for trait in trait_lst:
        print('Now copying trait ' + trait)
        sorted_rating = rating_df[['Filename', trait]].sort_values(by=[trait])

        for i in range(0, n_gt_num):
            # low
            cur_im_name = sorted_rating['Filename'].iloc[i]
            src_file = gt_img_dir + cur_im_name
            tar_file = tar_dir + trait + '-low-' + str(i) + '.png'
            copy_files(src_file, tar_file)

            # middle
            cur_im_name = sorted_rating['Filename'].iloc[mid_num + i]
            src_file = gt_img_dir + cur_im_name
            tar_file = tar_dir + trait + '-mid-' + str(i) + '.png'
            copy_files(src_file, tar_file)

            # high
            cur_im_name = sorted_rating['Filename'].iloc[-i-1]
            src_file = gt_img_dir + cur_im_name
            tar_file = tar_dir + trait + '-high-' + str(i) + '.png'
            copy_files(src_file, tar_file)

    return


if __name__ == '__main__':
    select_gt_pairwise_im()




