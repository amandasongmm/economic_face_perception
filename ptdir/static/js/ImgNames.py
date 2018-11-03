# get the file names from ../images/2kfaces
# Source: https://stackoverflow.com/questions/3207219/how-do-i-list-all-files-of-a-directory#3207973
from os import listdir
from os.path import isfile, join

mypath = '../images/2kfaces/'
onlyfiles = [f for f in listdir(mypath) if isfile(join(mypath, f))]

with open('imgNames.txt', 'w') as f:
    f.write(str(onlyfiles))
