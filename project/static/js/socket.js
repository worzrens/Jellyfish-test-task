import openSocket from 'socket.io-client';
const  socket = io('http://127.0.0.1:5000');

function checkForUpdates(mes) {
    socket.on('connect', () => socket.emit('User has connected!'));
    socket.on('response', msg => mes(null, {"message": msg.message, "username": msg.username, "time": msg.time}))
}

function sendMessage(msg, username) {
     var message = {"message": msg, "username": username }
     socket.emit("message_sent", message);
}

export { checkForUpdates, sendMessage };