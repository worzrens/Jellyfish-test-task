from flask_sqlalchemy import *
from flask_login import LoginManager, login_required, logout_user, login_user, UserMixin

login_manager = LoginManager()
login_manager.login_view = 'login'


@login_manager.user_loader
def load_user(user_id):
    return Users.query.filter_by(id=user_id).first()


db = SQLAlchemy()


class Users(db.Model, UserMixin):
    id = db.Column("id", db.Integer, primary_key=True)
    username = db.Column("username", db.String(30))
    email = db.Column("email", db.String(30))
    password = db.Column("password", db.String(200))
    pass


class Messages(db.Model):
    id = db.Column('message_id', db.Integer, primary_key=True)
    message = db.Column('message', db.String(1000))
    username = db.Column('user_id', db.String(30))
    timestamp = db.Column('sent_time', db.TIMESTAMP)
    pass

