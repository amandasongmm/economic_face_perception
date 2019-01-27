import pandas as pd
from correlationMethods import *
import matplotlib.pyplot as plt
import numpy as np
import re
from scipy.stats import pearsonr as corr

celeb = pd.read_csv("celeb_ratings.csv")
def calcSelfConsistency(df):
    print("Consistency with self")
    corrList = []
    for sub in sorted(df.subId.unique()):
        # find the imgNames that repeat
        subdf = df.loc[df["subId"] == sub]
        imgCounts = subdf["imgName"].value_counts()
        imgPairs = list(imgCounts[imgCounts == 2].index)
        # extract the scores
        trials = subdf.loc[subdf['imgName'].isin(imgPairs)].sort_values("imgName").rating
        first = trials[::2]
        second = trials[1::2]
        # Pearson + output
        c = corr(first, second)
        print("SubId: " + sub)
        print("\t Pearson Cor: ", c[0])
        corrList.append(c[0])
        print("\t p-val: ", c[1])
    return corrList
def calcGroupConsistency(df):
    print("Consistency with group")
    corrList = []
    df2 = pd.pivot_table(df, index="subId", columns="imgName", values="rating")
    for sub in df2.index:
        subData = df2.loc[sub]
        groupdf =  df2.drop(sub, axis=0)
        groupData = groupdf.mean(axis=0)
        print("SubId: " + sub)
        c = corr(subData, groupData)
        print("\t Pearson Cor: ", c[0])
        corrList.append(c[0])
        print("\t p-val: ", c[1])
    return corrList
def calcrHumrMacConsistency(df, attribute):
    print("Attribute Correlation: ")
    f = celeb[["Filename", "aggressive","attractive", "intelligent", "trustworthy"]]
    MacData = f.loc[f['Filename'].isin(set(agg.imgName))].sort_values("Filename")[attribute]
    HumData = pd.pivot_table(agg, index="subId", columns="imgName", values="rating").mean(axis=0)
    c = corr(MacData, HumData)
    print("\t Pearson Cor: ", c[0])
    print("\t p-val: ", c[1])

def calcmHumrMac(trait):
    mHum = pd.read_csv("../modifae_" + trait + "/likert_data.csv")
    mHumData = pd.pivot_table(mHum, index="subId", columns="imgName", values="rating").mean(axis=0)
    mHumIndex = mHumData.index

    indexNames = []
    for i in mHumIndex:
        indexNames.append(i.split("_")[0] + ".jpg")
    mHumData.index = indexNames

    rCom = celeb[["Filename", trait]]
    rCom = rCom.loc[rCom['Filename'].isin(indexNames)].sort_values("Filename")
    rCom.index = rCom.Filename
    rCom = rCom.drop("Filename", axis=1)

    x = pd.concat([rCom, mHumData], axis=1, join_axes=[rCom.index])
    c = corr(x[0], x[trait])

    plt.scatter(x[0], x[trait])
    plt.ylabel("Computer - Raw")
    plt.xlabel("Human - Modified")
    plt.title("P-Corr: " + str(round(c[0], 3)) + ", HuMa " + trait + " Rating")
    plt.show()
