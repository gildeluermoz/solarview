#coding: utf8
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Sequence

from ..utils.genericmodels import serializableModel

db = SQLAlchemy()

class DataRegul(serializableModel, db.Model):
    __tablename__ = 'data_regul'
    id = db.Column(db.Integer, primary_key=True)
    cyear  = db.Column(db.Integer)
    cmonth  = db.Column(db.Integer)
    cday  = db.Column(db.Integer)
    ctime = db.Column(db.Unicode)
    t1  = db.Column(db.Integer)
    t2  = db.Column(db.Integer)
    t3  = db.Column(db.Integer)
    t4  = db.Column(db.Integer)
    t5  = db.Column(db.Integer)
    t6  = db.Column(db.Integer)
    tds  = db.Column(db.Integer)
    debit  = db.Column(db.Integer)
    pcurrent = db.Column(db.Float)
    qday  = db.Column(db.Integer)
    qyear  = db.Column(db.Integer)
    qsum  = db.Column(db.Integer)
    r1  = db.Column(db.Integer)
    r2  = db.Column(db.Integer)
    r3  = db.Column(db.Integer)
    h1  = db.Column(db.Integer)
    h2  = db.Column(db.Integer)