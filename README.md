# econ_face_ucsd

## 0. Make all necessary changes locally, then push to Github
- Make sure you change the config.txt to make the right database name for the current experiment

## 1. Turning on the ubuntu machine on aws: (https://aws.amazon.com)
- Go to EC2 - instances, start the instance ending in "ccd" on there (right click > state > start)
- Don't fotget to turn it off when done

## 2. Connecting to machine:
- Download private key (pem)
- ssh -i "face_eco_ubuntu.pem" ubuntu@[ip address you get from the aws page)

## 3. Download latest codes from Github into the ubuntu machine on AWS

## 4. Running the experiment in debug mode:
remark: you can do this directly by running ptdir/rerunPsiturk.sh
- you should be at /home/ubuntu (NOT in sudo mode, all of this is under the user ubuntu)
- cd to econ_face_ucsd/ptdir/, this is the psiturk directory
- enter the command psiturk, it will take you to a psiturk terminal
- server on, turns 
- debug -p, this will give you a url that you can access through your local browser
- server off and exit if you want to stop the debugging

## 5. Running experiment in sandbox
remark: you can do this directly by running ptdir/runPsiturkInSandbox.sh

## 6. Running experiment in live mode (Actual experiment on AMT)
remark: we want to write a sh for this. ptdir/runPsiturkInSandbox.sh

## 7. Download database files on server, then git push remotely
remark: we want to write a sh for this. ptdir/runPsiturkInSandbox.sh

## 8. Git pull the files into local folder. Move the trial.csv/ event.csv/ question.csv into other folders from further processing. 
remark: we want to make it more automatic
