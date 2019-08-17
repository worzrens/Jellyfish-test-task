from flask import Flask, render_template, redirect, request, url_for
from flask_login import LoginManager, login_required, logout_user, login_user, UserMixin
from flask_socketio import SocketIO, emit
from flask_sqlalchemy import *
import datetime
import hashlib

app = Flask(__name__)
app.config['SECRET_KEY'] = 'mysecret'

socketio = SocketIO(app)

login_manager = LoginManager()
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return Users.query.filter_by(id=user_id).first()


app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://edgar:11@localhost:5432/jellyfish"
db = SQLAlchemy(app)


def encrypt_password(password):
    return hashlib.sha256(password.encode()).hexdigest()


class Users(db.Model, UserMixin):
    id = db.Column("id", db.Integer, primary_key=True)
    username = db.Column("username", db.String(30))
    email = db.Column("email", db.String(30))
    password = db.Column("password", db.String(200))


class Messages(db.Model):
    id = db.Column('message_id', db.Integer, primary_key=True)
    message = db.Column('message', db.String(1000))
    user_id = db.Column('user_id', db.Integer)
    timestamp = db.Column('sent_time', db.TIMESTAMP)


@socketio.on('message_sent')
def handle_message_sent(msg):
    print(msg)
    timestamp = str(datetime.datetime.now())
    message = Messages(message=msg["message"], user_id=msg["user_id"], timestamp=timestamp)
    db.session.add(message)
    db.session.commit()

    emit('response', {"message": msg['message'], "user_id": msg['user_id'], "time": timestamp}, broadcast=True)


@app.route("/")
@login_required
def index():
    messages = Messages.query.all()
    return render_template("index.html", messages=messages)


"""
LOGIN PARTS
"""
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]

        user = Users.query.filter_by(username=username, password=encrypt_password(password)).first()
        print(user.__dict__)
        if user is not None:
            login_user(user)
            return redirect(url_for("index"))
    return render_template("login.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form['username']
        mail = request.form['mail']
        password = request.form['password']

        new_user = Users(username=username, email=mail, password=encrypt_password(password))
        db.session.add(new_user)
        db.session.commit()

        return redirect(url_for("login"))

    return render_template("register.html")


@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("index"))


if __name__ == '__main__':
    db.create_all()
    login_manager.init_app(app)
    socketio.run(app)
