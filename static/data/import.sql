CREATE TABLE import_regul (
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

CREATE TABLE data_regul (
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

.separator ";"
.import "/home/gil/solaire/static/data/regul/17/05/10170501.CSV" import_regul


INSERT INTO data_regul
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
FROM import_regul
;