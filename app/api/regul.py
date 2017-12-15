#coding: utf8
from flask import Blueprint, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import select, distinct, func
from ..utils.utilssqlalchemy import json_resp, GenericTable, serializeQuery, serializeQueryOneResult
from .models import DataRegul

adresses = Blueprint('regul', __name__)
db = SQLAlchemy()


@adresses.route('/getoneday/<int:yyyy>/<int:mm>/<int:dd>', methods=['GET'])
@json_resp
def get_one_day(yyyy, mm, dd):
    results = db.session.query(DataRegul).\
    	filter(DataRegul.cyear == yyyy).\
    	filter(DataRegul.cmonth == mm).\
    	filter(DataRegul.cday == dd).\
    	all()
    return [data.as_dict() for data in results]

@adresses.route('/getmonths/', methods=['GET'])
@json_resp
def get_months():
    results = db.session.query(DataRegul.cmonth).distinct().all()
    return [data[0] for data in results]

@adresses.route('/getyears/', methods=['GET'])
@json_resp
def get_years():
    results = db.session.query(DataRegul.cyear).distinct().all()
    return [data[0] for data in results]

@adresses.route('/getqmonths/', methods=['GET'])
@json_resp
def get_months_production():
    q = db.session.query(DataRegul.cmonth.label('month'), (func.max(DataRegul.qyear)-func.min(DataRegul.qyear)).label('q'))
    results = q.group_by(DataRegul.cmonth).all()
    return [data._asdict() for data in results]
    # return [{"month":data[0], "q":data[1]} for data in results]

@adresses.route('/getdaystats/<int:yyyy>/<int:mm>/<int:dd>', methods=['GET'])
@json_resp
def get_day_stats(yyyy, mm, dd):
    results = db.session.query(
        func.max(DataRegul.qday).label('production'), 
        func.min(DataRegul.t4).label('minMaison'),
        func.max(DataRegul.t4).label('maxMaison'),
        func.avg(DataRegul.t4).label('moyMaison'),
        func.min(DataRegul.t5).label('minVeranda'),
        func.max(DataRegul.t5).label('maxVeranda'),
        func.min(DataRegul.t2).label('minBasBallon'),
        func.max(DataRegul.t2).label('maxBasBallon'),
		func.min(DataRegul.t3).label('minHautBallon'),
        func.max(DataRegul.t3).label('maxHautBallon'),
        func.min(DataRegul.t1).label('minCapteur'),
        func.max(DataRegul.t1).label('maxCapteur')
	)\
    .filter(DataRegul.cyear == yyyy)\
    .filter(DataRegul.cmonth == mm)\
    .filter(DataRegul.cday == dd)\
    .group_by(DataRegul.cyear, DataRegul.cmonth, DataRegul.cday).all()
    return results[0]._asdict()
    # return {k:v for k, v in zip(results[0]._fields, results[0])}