#coding: utf8
from flask import Blueprint, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import select, distinct, func
from ..utils.utilssqlalchemy import json_resp, GenericTable, serializeQuery, serializeQueryOneResult
from .models import DataMeteo

adresses = Blueprint('meteo', __name__)
db = SQLAlchemy()


@adresses.route('/getoneday/<int:yyyy>/<int:mm>/<int:dd>', methods=['GET'])
@json_resp
def get_one_day(yyyy, mm, dd):
    results = db.session.query(DataMeteo.ctime,DataMeteo.t).\
    	filter(DataMeteo.cyear == yyyy).\
    	filter(DataMeteo.cmonth == mm).\
    	filter(DataMeteo.cday == dd).\
    	all()
    return [data._asdict() for data in results]

@adresses.route('/getmonthsstats/', methods=['GET'])
@json_resp
def get_months_production():
    q = db.session.query(DataMeteo.cmonth.label('month'), func.avg(DataMeteo.t).label('moyenTemperature'))
    results = q.group_by(DataMeteo.cmonth).all()
    return [data._asdict() for data in results]

@adresses.route('/getdaystats/<int:yyyy>/<int:mm>/<int:dd>', methods=['GET'])
@json_resp
def get_day_stats(yyyy, mm, dd):
    results = db.session.query(
        func.min(DataMeteo.t).label('minExt'),
        func.max(DataMeteo.t).label('maxExt'),
        func.avg(DataMeteo.t).label('moyExt')
	)\
    .filter(DataMeteo.cyear == yyyy)\
    .filter(DataMeteo.cmonth == mm)\
    .filter(DataMeteo.cday == dd)\
    .group_by(DataMeteo.cyear, DataMeteo.cmonth, DataMeteo.cday).all()
    return results[0]._asdict()