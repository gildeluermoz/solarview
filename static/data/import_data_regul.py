#!/usr/bin/env python
#coding: utf8

'''
    Create the application database from a year directory
    usage : ./import_data.py dbname.db "/the/path/of/csvdata/directory/"
    for instance : ./import_data_regul.py "/home/gil/solaire/static/data/solar.db" "/home/gil/solaire/static/data/regul/"
'''

import sqlite3
import csv
import os
import glob
import sys

#database name (remove if exists)
db = sys.argv[1]
try:
    os.remove(db)
except OSError:
    pass

#path to parse. Must contain only subpathes and csv files
mypath = sys.argv[2]

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

#Generate empty database

cursor.execute("""
CREATE TABLE import_regul(
    num_Regul integer,
    date_time varchar(20),
    t1 integer,
    t2 integer,
    t3 integer,
    t4 integer,
    t5 integer,
    t6 integer,
    tds integer,
    debit integer,
    pcurrent real,
    qday integer,
    qyear integer,
    qsum integer,
    r1 integer,
    r2 integer,
    r3 integer,
    h1 integer,
    h2 integer);
""")
conn.commit()

cursor.execute("""
CREATE TABLE data_regul(
    id integer primary key,
    cyear integer,
    cmonth integer,
    cday integer,
    ctime varchar(5),
    t1 integer,
    t2 integer,
    t3 integer,
    t4 integer,
    t5 integer,
    t6 integer,
    tds integer,
    debit integer,
    pcurrent real,
    qday integer,
    qyear integer,
    qsum integer,
    r1 integer,
    r2 integer,
    r3 integer,
    h1 integer,
    h2 integer);
""")
conn.commit()

for f in csvfiles:
    i = 0
    reader = csv.reader(open(f, 'r'), delimiter=';')
    for row in reader:
        if i > 0:
            to_db = [
                row[0], 
                unicode(row[1], "utf8"), 
                row[2],
                row[3],
                row[4],
                row[5],
                row[6],
                row[7],
                row[8],
                row[9],
                row[10],
                row[11],
                row[12],
                row[13],
                row[14],
                row[15],
                row[16],
                row[17],
                row[18],
            ]
            cursor.execute(
                """INSERT INTO import_regul (
                    num_Regul,
                    date_time,
                    t1,
                    t2,
                    t3,
                    t4,
                    t5,
                    t6,
                    tds,
                    debit,
                    pcurrent,
                    qday,
                    qyear,
                    qsum,
                    r1,
                    r2,
                    r3,
                    h1,
                    h2
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"""
                , to_db
            )
        i += 1
conn.commit()

cursor.execute(
    """INSERT INTO data_regul
    (
    cyear
    ,cmonth
    ,cday
    ,ctime
    ,t1
    ,t2
    ,t3
    ,t4
    ,t5
    ,t6
    ,tds
    ,debit
    ,pcurrent
    ,qday
    ,qyear
    ,qsum
    ,r1
    ,r2
    ,r3
    ,h1
    ,h2
    )
    SELECT  
    substr(date_time,0,5)
    ,substr(date_time,6,2)
    ,substr(date_time,9,2)
    ,substr(date_time,12,5)
    ,t1
    ,t2
    ,t3
    ,t4
    ,t5
    ,t6
    ,tds
    ,debit
    ,pcurrent
    ,qday
    ,qyear
    ,qsum
    ,r1
    ,r2
    ,r3
    ,h1
    ,h2
    FROM import_regul;
""")
conn.commit()

cursor.execute("DROP TABLE import_regul;")
conn.commit()

cursor.execute("VACUUM;")
conn.commit()

conn.close()
