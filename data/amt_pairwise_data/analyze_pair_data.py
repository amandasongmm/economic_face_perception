import json
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import spearmanr
import os
import os.path
import shutil


if __name__ == '__main__':

    task_type = 'modifae'
    trait_name = 'attractive'
    high_low_type = 'low-high'

    sub_folder_name = './' + task_type + '/' + trait_name + '-' + high_low_type + '/'
    print(sub_folder_name)

    if not os.path.isdir(sub_folder_name):
        os.makedirs(sub_folder_name)

    trial_csv = sub_folder_name + 'trialdata.csv'
    if not os.path.isfile(trial_csv):
        shutil.move("../../ptdir/trialdata.csv", sub_folder_name + 'trialdata.csv')
        shutil.move("../../ptdir/eventdata.csv", sub_folder_name + 'eventdata.csv')
        shutil.move("../../ptdir/questiondata.csv", sub_folder_name + 'questiondata.csv')
        db_file_name = []
        for cur_file in os.listdir('../../ptdir/'):
            if cur_file.endswith('.db'):
                db_file_name = cur_file
        shutil.move('../../ptdir/' + db_file_name, sub_folder_name + db_file_name)

    # parse trialdata.csv into pairdata.csv
    pair_data_csv = sub_folder_name + 'pair_data.csv'




