import csv
import json
import ast

#print "assignmentId,hitId,workerId,trialNumber,q0,q1,q2,q3,q4,q5"
#WORK IN PROGRESS
'''
#code from sam's project, should be helpful in getting going

import csv
import json
import ast

#in order to convert parcticipants.db into participants.csv
#look at http://www.sqlitetutorial.net/sqlite-export-csv/
#is easy

print "assignmentId,hitId,workerId,trialNumber,imgNum,qNumber,Response"

rownum = 0
with open('participants.csv', 'rb') as f:
	reader = csv.reader(f)
	for row in reader:
		if rownum == 0:
			header = row	
		else:
			colnum = 0
			for col in row:
				if header[colnum]=="datastring":
					if col!="":
						parsed_datastring = json.loads(col)
						#print json.dumps(parsed_datastring, indent=4, sort_keys=True)
						assignmentId = parsed_datastring["assignmentId"]
						hitId = parsed_datastring["hitId"]
						workerId = parsed_datastring["workerId"]

						for item in parsed_datastring["data"]:
							if item["trialdata"]["trial_type"]=="20traits":
								responsesString = str(item["trialdata"]["responses"])
								responsesDict = ast.literal_eval(responsesString)
								for q in sorted(responsesDict):
									print assignmentId + "," + hitId + "," + workerId + ",",
									print str(item["current_trial"]) + ",",
									print str(item["trialdata"]["imgNum"]) + ",",
									print q + ",",
									print responsesDict[q]
				colnum += 1
		rownum += 1
'''
