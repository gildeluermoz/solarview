#coding: utf8
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
import importlib
import datetime

db = SQLAlchemy()

def init_app():
    # Define other delimiters for Jinja templates variables 
    # in order to avoid vue.js "{{}}" delimiter conflicts  
    class CustomFlask(Flask):
        jinja_options = Flask.jinja_options.copy()
        jinja_options.update(
            dict(
                block_start_string='$$',
                block_end_string='$$',
                variable_start_string='$',
                variable_end_string='$',
                comment_start_string='$#',
                comment_end_string='#$',
            )
        )   
    app = CustomFlask(__name__)

    app.config.from_pyfile('config.py')
    db.init_app(app)

    from app.index import routes
    app.register_blueprint(routes, url_prefix='/')

    from app.api.regul import routes
    app.register_blueprint(routes, url_prefix='/api/regul')

    return app

app = init_app()
if __name__ == '__main__':
    app.run()
