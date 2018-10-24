# econ_face_ucsd

## 1. Turning on the ubuntu machine on aws:
- Use the password shared on lastpass for account remylevin@gmail.com
- Start the only instance on there (right click > state > start)
- Don't fotget to turn it off when done

## 2. Connecting to machine:
- Download remy.pem (private key manaf and sam have)
- ssh -i "remy.pem" ubuntu@[ip address you get from the aws page, need to make fixed at some pt)

## 3. Running the experiment in debug mode:
remark: you can do this directly by running ptdir/rerunPsiturk.sh
- you should be at /home/ubuntu (NOT in sudo mode, all of this is under the user ubuntu)
- cd to econ_face_ucsd/ptdir/, this is the psiturk directory
- enter the command psiturk, it will take you to a psiturk terminal
- server on, turns 
- debug -p, this will give you a url that you can access through your local browser
- server off and exit if you want to stop the debugging

## 4. Running experiment in sandbox
remark: you can do this directly by running ptdir/runPsiturkInSandbox.sh

-----------------------------------------------------

## Remy: text to change
- Consent form: ptdir/templates/consent.html, line 27-...
- Ad 1 (first thing people see if they click on HIT on MTurk): ptdir/templates/ad.html, line 79-93
- Ad 2 (displays after people selected "Accept HIT"): line 110-114
- Experiment params: ptdir/config.txt. Almost everything in [HIT Configuration] needs to be changed.
- Message if person's already taken the HIT: ptdir/templates/error.html
- Page title (appears in the top of the tab in your browser): ptdir/templates/exp.html, line 4 (inside the <title> tag)
