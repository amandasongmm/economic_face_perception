import os
import glob
from shutil import copyfile
import pandas as pd
import numpy as np


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












