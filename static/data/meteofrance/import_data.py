#!/usr/bin/env python
#coding: utf8

'''
    add meteo values to application database from meteo france csv files
    usage : ./import_data.py dbname.db "/the/path/of//csvdata/directory/"
    for instance : ./import_data.py "/home/gil/solaire/static/data/regul/solar.db" "/home/gil/solaire/static/data/meteofrance/"
'''

import sqlite3
import csv
import os
import glob
import sys

#database name
db = sys.argv[1]

#path to parse
mypath = sys.argv[2]

#meteo station number
numer_sta = '07591' # = Embrun
diff_emb_bri = 2.5 # différence de température en Embrun et Briançon

conn = sqlite3.connect(db)
conn.text_factory = str  # allows utf-8 data to be stored
cursor = conn.cursor()

fileslist = []
def test_dir(path_param):
    for f in os.listdir(path_param):
        if (os.path.isfile(os.path.join(path_param, f))):
            fileslist.append(os.path.join(path_param, f))
        else:
            test_dir(os.path.join(path_param, f))
    return fileslist

#Create a list of csv files
csvfiles = test_dir(mypath)

#Generate data_meteo table
cursor.execute("DROP TABLE IF EXISTS data_meteo;")
conn.commit()

cursor.execute("""
CREATE TABLE data_meteo(
    id integer primary key,
    cyear integer,
    cmonth integer,
    cday integer,
    ctime integer,
    t real
);
""")
conn.commit()

for thefile in csvfiles:
    i = 0
    with open(thefile) as f:
        reader = csv.reader(f, delimiter=';')
        for row in reader:
            if i > 0 and row:
                if row[0]==numer_sta:
                    to_db = [
                        row[1][:4], 
                        row[1][4:6], 
                        row[1][6:8], 
                        row[1][8:10], 
                        round((float(row[7])-273.15),2)-diff_emb_bri
                    ]
                    # print(to_db)
                    cursor.execute(
                        """INSERT INTO data_meteo(cyear, cmonth, cday, ctime, t)
                            VALUES (?, ?, ?, ?, ?);"""
                        , to_db
                    )
            i += 1
conn.commit()

cursor.execute("VACUUM;")
conn.commit()

conn.close()
