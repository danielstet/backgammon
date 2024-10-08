const { Server } = require('socket.io');

require('dotenv').config();
const io = new Server({ cors: process.env.CLIENT_CORS });

let onlineUsers = [];

io.on('connection', (socket) => {
	console.log('New connection: ', socket.id);

	// listen to a connection
	
	socket.on('addNewUser', (userId) => {
		!onlineUsers.some((user) => user.userId === userId) &&
			onlineUsers.push({
				userId,
				socketId: socket.id,
			});
	});
	// console.log('online users:', onlineUsers);

	io.emit('getOnlineUsers', onlineUsers);

	socket.on('disconnect', () => {
		onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
		io.emit('getOnlineUsers', onlineUsers);
	});

	socket.on('sendMessage', (message) => {
		const user = onlineUsers.find(
			(user) => user.userId === message.recipientId
		);

		if (user) {
			io.to(user.socketId).emit('getMessage', message);
			io.to(user.socketId).emit('getNotification', {
				senderId: message.senderId,
				isRead: false,
				date: new Date(),
			});
		}
	});
});

io.listen(process.env.SOCKET_PORT);

console.log('running socket server on port:', process.env.SOCKET_PORT);
