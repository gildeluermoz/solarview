#coding: utf8
from flask import Blueprint, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import select, distinct
from ..utils.utilssqlalchemy import json_resp, GenericTable, serializeQuery, serializeQueryOneResult
from .models import DataRegul

routes = Blueprint('regul', __name__)
db = SQLAlchemy()


@routes.route('/getoneday/<int:yyyy>/<int:mm>/<int:dd>', methods=['GET'])
@json_resp
def get_one_day(yyyy, mm, dd):
    results = db.session.query(DataRegul).\
    	filter(DataRegul.cyear == yyyy).\
    	filter(DataRegul.cmonth == mm).\
    	filter(DataRegul.cday == dd).\
    	all()
    return [data.as_dict() for data in results]

# @routes.route('/getdays/<int:yyyy>/<int:mm>/<int:dd>/<int:duration>', methods=['GET'])
# @json_resp
# def get_days(yyyy, mm, dd, duration):
#     results = db.session.query(DataRegul).\
#     	filter(DataRegul.cyear == yyyy).\
#     	filter(DataRegul.cmonth == mm).\
#     	filter(DataRegul.cday == dd).\
#     	all()
#     return [data.as_dict() for data in results]


# @routes.route('/getdays/<int:startyear>/<int:startmonth>/<int:startday>/<int:endyear>/<int:endmonth>/<int:endday>', methods=['GET'])
# @json_resp
# def get_days(startyear, startmonth, startday, endyear, endmonth, endday):
# 	startid = select_first_id_by_date(startyear, startmonth, startday)
# 	endid = select_last_id_by_date(endyear, endmonth, endday)
# 	results = db.session.query(DataRegul).\
#     	filter(DataRegul.id >= startid).all()
#     	# filter(DataRegul.id <= endid).\
#     	# all()
# 	return [data.as_dict() for data in results]

# def select_first_id_by_date(yyyy, mm, dd):
# 	myid = db.session.query(DataRegul.id).\
#     	filter(DataRegul.cyear == yyyy).\
#     	filter(DataRegul.cmonth == mm).\
#     	filter(DataRegul.cday == dd).\
#     	filter(DataRegul.ctime == '00:00').\
#     	first()
# 	return myid[0]

# def select_last_id_by_date(yyyy, mm, dd):
# 	myid = db.session.query(DataRegul.id).\
#     	filter(DataRegul.cyear == yyyy).\
#     	filter(DataRegul.cmonth == mm).\
#     	filter(DataRegul.cday == dd).\
#     	filter(DataRegul.ctime == '23:59').\
#     	first()
#     	print(myid[0])
# 	return myid[0]

###################""
# def calculate_last_date(firstdate,duration):
# 	lastdate = 0;
# 	return lastdate