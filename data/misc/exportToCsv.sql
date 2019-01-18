-- This is a sql script that automate the export to CSV.

-- run in sqlite like this:
-- sqlite> .read exportCSV.sql
.headers on
.mode csv
.output participants.csv
-- wait what is the SELECT command again?
SELECT * from turkdemo; 
.quit
