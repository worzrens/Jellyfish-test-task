from flask import Flask, render_template, redirect, request, url_for, jsonify
from flask_socketio import SocketIO, emit
import time
import hashlib
from models import *


app = Flask(__name__)
app.config.from_pyfile('app_config.py')
db.init_app(app)


socketio = SocketIO(app)


def encrypt_password(password):
    return hashlib.sha256(password.encode()).hexdigest()


@socketio.on('message_sent')
def handle_message_sent(msg):
    timestamp = str(int(time.time()))
    message = Messages(message=msg["message"], username=msg["username"], timestamp=timestamp)
    db.session.add(message)
    db.session.commit()

    emit('response', {"message": msg['message'], "username": msg['username'], "time": timestamp}, broadcast=True)


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
    with app.app_context():
        db.create_all()
    login_manager.init_app(app)
    socketio.run(app, host='0.0.0.0')
