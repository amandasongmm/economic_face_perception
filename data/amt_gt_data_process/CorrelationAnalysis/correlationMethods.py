import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from collections import Counter
from scipy.stats import pearsonr as corr
from sklearn.linear_model import LinearRegression
from IPython.display import Image, display
from sklearn import preprocessing

celeb = pd.read_csv("celeb_ratings.csv")

def calcSelfConsistency(trait, prnt=False):
    if prnt:
        print("Consistency with self")
    corrList = []
    df = pd.read_csv("../" + trait + "/likert_data.csv")
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
        corrList.append(c[0])
        if prnt:
            print("SubId: " + sub)
            print("\t Pearson Cor: ", c[0])
            print("\t p-val: ", c[1])
        # Show the hist
    return corrList
def calcGroupConsistency(trait, prnt=False):
    if prnt:
        print("Consistency with group")
    corrList = []
    df = pd.read_csv(f"../{trait}/likert_data.csv")
    df2 = pd.pivot_table(df, index="subId", columns="imgName", values="rating")
    for sub in df2.index:
        subData = df2.loc[sub]
        groupdf =  df2.drop(sub, axis=0)
        groupData = groupdf.mean(axis=0)
        c = corr(subData, groupData)
        corrList.append(c[0])
        if prnt:  
            print("SubId: " + sub)
            print("\t Pearson Cor: ", c[0])
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

def calcmHumrMac(trait, new=False):
    if new:
        mHum = pd.read_csv("../modifae_new_" + trait + "/likert_data.csv")
    else:
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


def linear(trait):
    df = pd.read_csv("../modifae_" + trait + "/likert_data.csv")
    data = pd.DataFrame(pd.pivot_table(df, index="subId", columns="imgName", values="rating").mean(axis=0))
    targetIndex = data.index

    indexNames = []
    for i in targetIndex:
        indexNames.append(i.split("_")[0] + ".jpg")
    data.index = indexNames

    intendedScore = []
    for i in targetIndex:
        intendedScore.append(float(i.split("_")[1][:-4]) * 4 + 5)
    data["intendedScore"] = intendedScore

    rCom = celeb[["Filename", trait]]
    rCom = rCom.loc[rCom['Filename'].isin(indexNames)].sort_values("Filename")
    rCom.index = rCom.Filename
    rCom = rCom.drop("Filename", axis=1)

    x = pd.concat([rCom, data], axis=1, join_axes=[rCom.index])
    x = x.rename(columns={trait: "predictedScore", 0:"humanRating"})

    reg = LinearRegression().fit(list(zip(x["predictedScore"], x["intendedScore"])), x["humanRating"])
    print(trait)
    print("Score: ", reg.score(list(zip(x["predictedScore"], x["intendedScore"])), x["humanRating"]))
    print("Coef: ", reg.coef_)
    print("Intercept: ", reg.intercept_)

    scatterX = np.array(x["intendedScore"]) - np.array(x["predictedScore"])
    scatterY = np.array(x["humanRating"]) - np.array(x["predictedScore"])
    plt.scatter(scatterX, scatterY)
    plt.xlabel("intendedScore - predicted")
    plt.ylabel("humanRating - predicted")
    plt.show()

    scatterX = np.array(x["predictedScore"]) - np.array(x["intendedScore"])
    scatterY = np.array(x["humanRating"]) - np.array(x["intendedScore"])
    plt.scatter(scatterX, scatterY)
    plt.xlabel("predicted - intended")
    plt.ylabel("human - intended")
    plt.show()

def displayFaces(trait, scoreOne, scoreTwo, ascending=False):
    scores = ["humanRating", "intendedScore", "predictedScore"]
    scores.remove(scoreOne)
    scores.remove(scoreTwo)

    humanRating = pd.read_csv("../modifae_" + trait + "/likert_data.csv")
    humanRatingData = pd.DataFrame(pd.pivot_table(humanRating, index="subId", columns="imgName", values="rating").mean(axis=0))
    targetIndex = humanRatingData.index

    indexNames = []
    for i in targetIndex:
        indexNames.append(i.split("_")[0] + ".jpg")
    humanRatingData["originalNames"] = humanRatingData.index
    humanRatingData.index = indexNames

    intendedScore = []
    for i in targetIndex:
        intendedScore.append(float(i.split("_")[1][:-4]) * 4 + 5)
    humanRatingData["intendedScore"] = intendedScore

    predictedScore = celeb[["Filename", trait]]
    predictedScore = predictedScore.loc[predictedScore['Filename'].isin(indexNames)].sort_values("Filename")
    predictedScore.index = predictedScore.Filename
    predictedScore = predictedScore.drop("Filename", axis=1)

    x = pd.concat([predictedScore, humanRatingData], axis=1, join_axes=[predictedScore.index])
    x = x.rename(columns={trait: "predictedScore", 0:"humanRating"})

    x["predictedScore"] = x["predictedScore"] / x["predictedScore"].max()
    x["humanRating"] =  x["humanRating"] / x["humanRating"].max()
    x["intendedScore"] = x["intendedScore"] / x["intendedScore"].max()

    x["humanPredictedDiff"] = list(map(lambda x: abs(x), np.array(x[scoreOne]) - np.array(x[scoreTwo])))
    x = x.sort_values("humanPredictedDiff", ascending=ascending)
    correctNum = 0
    for i, filename in enumerate(x.originalNames):
        if (x["predictedScore"][i] - x["intendedScore"][i] > 0 and x["humanRating"][i] - x["predictedScore"][i] > 0) or \
         (x["predictedScore"][i] - x["intendedScore"][i] < 0 and x["humanRating"][i] - x["predictedScore"][i] < 0):
            correctNum += 1
        print(scoreOne, x[scoreOne][i])
        print(scoreTwo, x[scoreTwo][i])
        print(scores[0], x[scores[0]][i])
        print("Difference:", x["humanPredictedDiff"][i])
        display(Image(filename="../../../ptdir/static/images/modifAE_linspace/" + trait + "/" + filename))
    print(correctNum / len(x.index))
