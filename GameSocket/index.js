const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const io = new Server({ cors: process.env.CLIENT_CORS });

let onlinePlayers = [];
let publicRooms = [];

io.on('connection', (socket) => {
	console.log('New connection: ', socket.id);

	// Listen to a connection and add a new player
	socket.on('addNewPlayer', (userId) => {
		console.log('userId:', userId);

		if (!onlinePlayers.some((player) => player.userId === userId)) {
			onlinePlayers.push({
				userId: userId,
				socketId: socket.id,
			});
		}
		io.emit('getOnlinePlayers', onlinePlayers);
	});

	io.emit('getOnlinePlayers', onlinePlayers);
	io.emit('updatePublicRooms', publicRooms); // Notify all clients about the new room

	console.log('online players:', onlinePlayers);
	console.log('rooms:', publicRooms);

	// Handle player disconnect
	socket.on('disconnect', () => {
		onlinePlayers = onlinePlayers.filter(
			(user) => user.socketId !== socket.id
		);
		io.emit('getOnlinePlayers', onlinePlayers);
	});

	// Handle room creation
	socket.on('createRoom', (roomData) => {
		// Check if the creator already has a room
		const existingRoom = publicRooms.find(
			(room) => room.CreatorId === roomData.CreatorId
		);

		if (!existingRoom) {
			const newRoomId = uuidv4(); // Generate a new unique room ID
			publicRooms.push({
				...roomData,
				RoomId: newRoomId, // Use the generated RoomId
			});
			socket.emit('roomCreated', { ...roomData, RoomId: newRoomId }); // Notify the creator with the new RoomId
			io.emit('updatePublicRooms', publicRooms); // Notify all clients about the new room
		} else {
			socket.emit('error', 'You can only create one room.'); // Send error to the client
		}
	});

	// Handle room deletion
	socket.on('deleteRoom', (roomId) => {
		// Find the index of the room to delete
		const roomIndex = publicRooms.findIndex(
			(room) => room.RoomId === roomId
		);

		if (roomIndex !== -1) {
			const removedRoom = publicRooms.splice(roomIndex, 1); // Remove the room
			io.emit('updatePublicRooms', publicRooms); // Notify all clients about the updated room list
			socket.emit('roomDeleted', removedRoom); // Notify the requester
		} else {
			socket.emit('error', 'Room not found.'); // Notify if the room doesn't exist
		}
	});

	// Handle room joining
	socket.on('joinRoom', (roomData) => {
		// check for existing room
		const room = publicRooms.find(
			(room) => room.RoomId === roomData.RoomId
		);

		if (room) {
			const creatorId = room.CreatorId; // get the room creator Id
			room.OpponentId = roomData.OpponentId; // Set the opponent Id
			const opponentId = room.OpponentId; // needed for filtering 

			// Search the creator socketData in the players pool
			const creatorSocketData = onlinePlayers.find(
				(user) => user.userId === creatorId
			);
			if (creatorSocketData) {

				// Join the creator to the room as well
				socket.join(roomData.RoomId); // Join the opponent

				//filter the room in case the oppoenent is hosting a game
				publicRooms = publicRooms.filter((room) => {
					return room.CreatorId !== opponentId
				})

				// Get the socket instance of the creator
				const creatorSocketInstance = io.sockets.sockets.get(
					creatorSocketData.socketId
				);

				if (creatorSocketInstance) {
					// Join the creator to the room
					creatorSocketInstance.join(roomData.RoomId);

					// Notify both the creator and the opponent
					io.to(creatorSocketData.socketId).emit(
						'opponentJoined',
						roomData.OpponentId
					);
				}

				// Notify both the creator and the opponent
				io.to(creatorSocketData.socketId).emit(
					'opponentJoined',
					roomData.OpponentId
				);
				socket.emit('joinedRoom', room); // Notify the opponent that they joined the room

				console.log(
					`Creator ${creatorSocketData.socketId} joined room ${roomData.RoomId}`
				);
				console.log(
					`Opponent ${socket.id} joined room ${roomData.RoomId}`
				);

				io.emit('updatePublicRooms', publicRooms); // Notify all clients about the new room
			} else {
				socket.emit('error', 'Creator not found.');
			}
		} else {
			socket.emit('error', 'Room not found.');
		}

		console.log('rooms after join:', publicRooms);
	});
});

io.listen(process.env.SOCKET_PORT);
console.log('running socket server on port:', process.env.SOCKET_PORT);
