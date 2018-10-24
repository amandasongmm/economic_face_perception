#!/bin/bash

#export db to csv
sqlite3 ../ptdir/participants.db < exportToCsv.sql

#parses question data
python dbParse.py > finalParticipantData.csv
