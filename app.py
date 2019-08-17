from flask import Flask , render_template
from flask_socketio import SocketIO, emit
from flask_sqlalchemy import *
from sqlalchemy import *
import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'mysecret'
socketio = SocketIO(app)

app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://edgar:11@localhost:5432/jellyfish"
db = SQLAlchemy(app)


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
def index():
    messages = Messages.query.all()
    return render_template("index.html", messages=messages)


if __name__ == '__main__':
    socketio.run(app)
