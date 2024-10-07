import { createContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import PropTypes from 'prop-types';

export const GameContext = createContext();

const GameContextProvider = ({ children, user }) => {
	console.log(user);
	const navigate = useNavigate();

	const [socket, setSocket] = useState(null);
	const [onlinePlayers, setOnlinePlayers] = useState([]);
	const [publicRoom, setPublicRoom] = useState(null);
	const [publicRoomError, setPublicRoomError] = useState(null);
	const [publicRooms, setPublicRooms] = useState([]);

	// Initialize socket
	useEffect(() => {
		const newSocket = io(
			import.meta.env.VITE_GAME_SOCKET_URL || 'http://localhost:3334'
		);
		setSocket(newSocket);

		return () => {
			newSocket.disconnect();
		};
	}, [user]);

	// Add online players
	useEffect(() => {
		if (socket === null) return;
		console.log('GameContext userId:', user?._id);
		socket.emit('addNewPlayer', user?._id);
		socket.on('getOnlinePlayers', (res) => {
			setOnlinePlayers(res);
		});
	}, [socket]);

	// Handle room creation
	const createPublicRoom = useCallback(() => {
		if (socket === null) return;

		socket.emit('createRoom', {
			CreatorId: user?._id,
			OpponentId: null,
			RoomId: null,
		});
	}, [socket, user]);

	// Handle room creation response
	useEffect(() => {
		if (socket === null) return;

		socket.on('roomCreated', (roomData) => {
			console.log(`Room created: ${roomData.RoomId}`);
			setPublicRoom(roomData); // Update state or handle UI changes
			setPublicRoomError(null); // Clear any previous errors
		});

		socket.on('error', (errorMessage) => {
			setPublicRoomError(errorMessage);
		});

		socket.on('updatePublicRooms', (res) => setPublicRooms(res));

		// Cleanup event listeners
		return () => {
			socket.off('roomCreated');
			socket.off('error');
		};
	}, [socket]);

	// Delete a public game room
	const deletePublicRoom = useCallback(
		(RoomId) => {
			if (socket === null) return;
			socket.emit('deleteRoom', RoomId);
		},
		[socket]
	);

	// Handle room joining
	const joinRoom = useCallback(
		(roomId) => {
			if (socket === null) return;

			setPublicRoom(null);

			socket.emit('joinRoom', {
				RoomId: roomId,
				OpponentId: user?._id, // Send userId when joining to be set as opponentId
			});
		},
		[socket, user]
	);

	useEffect(() => {
		if (socket === null) return;

		socket.on('joinedRoom', (room) => {
			console.log(`Joined room: ${room.RoomId}`);
			setPublicRoom(room); // Store the joined room details
			navigate('/Game');
		});

		socket.on('opponentJoined', (opponentId) => {
			console.log(`Opponent joined: ${opponentId} your room`);
			setPublicRoom((prevRoom) => ({
				...prevRoom,
				OpponentId: opponentId,
			}));
			navigate('/Game');
		});

		// Cleanup event listeners
		return () => {
			socket.off('joinedRoom');
			socket.off('opponentJoined');
		};
	}, [socket]);

	return (
		<GameContext.Provider
			value={{
				onlinePlayers,
				publicRoom,
				publicRoomError,
				createPublicRoom,
				deletePublicRoom,
				joinRoom,
				publicRooms,
			}}
		>
			{children}
		</GameContext.Provider>
	);
};

GameContextProvider.propTypes = {
	children: PropTypes.node,
	user: PropTypes.any,
};

export default GameContextProvider;
