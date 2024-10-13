import { createContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import PropTypes from 'prop-types';

export const GameContext = createContext();

const GameContextProvider = ({ children, user }) => {
	// console.log(user);
	const navigate = useNavigate();

	const [socket, setSocket] = useState(null);
	const [mySocketId, setSocketId] = useState(null);
	const [onlinePlayers, setOnlinePlayers] = useState([]);
	const [publicRoom, setPublicRoom] = useState(null);
	const [publicRoomError, setPublicRoomError] = useState(null);
	const [publicRooms, setPublicRooms] = useState([]);
	const [socketThisTurn, setSocketThisTurn] = useState(null);
	const [socketGameData, setSocketGameData] = useState(null);
	const [socketThisMove, setSocketThisMove] = useState(null)

	let tmp;

	// Initialize socket
	useEffect(() => {
		const newSocket = io(
			import.meta.env.VITE_GAME_SOCKET_URL || 'http://localhost:3334'
		);
		setSocket(newSocket);

		// TODO: check for existing room session if exists set as publicRoom
		if (localStorage.getItem('roomData') !== null)
		{
			let tmpData = localStorage.getItem('roomData')
			const roomData = JSON.parse(tmpData)
			setPublicRoom(roomData)
		}

		if (localStorage.getItem('gameData') !== null)
			{
				let tmpData = localStorage.getItem('gameData')
				const gameData = JSON.parse(tmpData)
				setSocketGameData(gameData)
			}

		if (localStorage.getItem('thisTurnData') !== null)
				{
					let tmpData = localStorage.getItem('thisTurnData')
					const thisTurnData = JSON.parse(tmpData)
					setSocketThisTurn(thisTurnData)
				}

		if (localStorage.getItem('thisMoveData') !== null)
					{
						let tmpData = localStorage.getItem('thisMoveData')
						const thisMoveData = JSON.parse(tmpData)
						setSocketThisMove(thisMoveData)
					}
		return () => {
			newSocket.disconnect();
		};
	}, [user]);

	useEffect(() => {
		if (socket === null) return;
		socket.on('error', (res) => {
			console.log('error:', res);
		});
	}, [socket]);

	// Add online players
	useEffect(() => {
		if (socket === null) return;
		console.log('GameContext userId:', user?._id);
		socket.emit('addNewPlayer', user?._id);
		socket.on('getOnlinePlayers', (res) => {
			setOnlinePlayers(res);
		});
		socket.on('mySocketId', (res) => {
			console.log('My Socket ID from server:', res.id);
			setSocketId(res.id);
		});
	}, [socket]);

	// Handle room creation
	const createPublicRoom = useCallback(() => {
		if (socket === null) return;

		socket.emit('createRoom', {
			CreatorId: user?._id,
			OpponentId: null,
			RoomId: null,
			CreatorName: user?.name
		});


		setSocketThisTurn(null)
		setSocketThisMove(null)
		setSocketGameData(null)
	}, [socket, user]);

	// Handle room creation response
	useEffect(() => {
		if (socket === null) return;

		socket.on('roomCreated', (roomData) => {
			console.log(`Room created: ${roomData.RoomId}`);

			// add to local storage the data
			tmp = JSON.stringify(roomData)
			localStorage.setItem('roomData', tmp)

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
			localStorage.removeItem('roomData')
			localStorage.removeItem('gameData')
			localStorage.removeItem('thisTurnData')
			localStorage.removeItem('thisMoveData')
			socket.emit('deleteRoom', RoomId);
		},
		[socket]
	);

	// Handle room joining
	const joinRoom = useCallback(
		(roomId) => {
			if (socket === null) return;

			setSocketThisTurn(null)
			setSocketThisMove(null)
			setSocketGameData(null)
			setPublicRoom(null);
			localStorage.removeItem('roomData')
			localStorage.removeItem('gameData')
			localStorage.removeItem('thisTurnData')
			localStorage.removeItem('thisMoveData')

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
			localStorage.removeItem('roomData')

			tmp = JSON.stringify(room)
			localStorage.setItem('roomData', tmp)
			setPublicRoom(room); // Store the joined room details
			setSocketGameData(null)
			setSocketThisTurn(null)
			setSocketThisMove(null)
			navigate('/Game');
		});

		socket.on('opponentJoined', (opponentId) => {
			console.log(`Opponent joined: ${opponentId} your room`);
		
			localStorage.removeItem('roomData');

			// setSocketGameData(null)
			setPublicRoom((prevRoom) => {
				const updatedRoom = {
					...prevRoom,
					OpponentId: opponentId,
				};
				
				const tmp = JSON.stringify(updatedRoom);
				localStorage.setItem('roomData', tmp);
		
				return updatedRoom; // Return the updated room state
			});
		
			navigate('/Game');
		});

		// Cleanup event listeners
		return () => {
			socket.off('joinedRoom');
			socket.off('opponentJoined');
		};
	}, [socket]);

	// get this turn data
	useEffect(() => {
		if (socket === null) return;

		const moveMadeHandler = (res) => {
			console.log('recivied this turn data:', res.thisTurnData);
			setSocketThisTurn(res.thisTurnData);

			localStorage.removeItem('thisTurnData')
			localStorage.setItem('thisTurnData', JSON.stringify(res.thisTurnData))
		};

		socket.on('turnMade', moveMadeHandler);

		// Cleanup function
		return () => {
			socket.off('turnMade', moveMadeHandler);
		};
	}, [socket]);

	// send this turn data
	const sendThisTurn = useCallback(
		(thisTurn) => {
			socket.emit('thisTurn', {
				userId: user?._id,
				roomData: publicRoom,
				thisTurnData: thisTurn,
			});
		},
		[socket, publicRoom]
	);

	// get game data
	useEffect(() => {
		if (socket === null) return;

		const gameOnHandler = (res) => {
			console.log('recivied gameOn data', res);

			setSocketGameData(res.gameData);
			localStorage.removeItem('gameData')
			localStorage.setItem('gameData', JSON.stringify(res.gameData))
		};

		socket.on('gameOn', gameOnHandler);
		// Cleanup function
		return () => {
			socket.off('gameOn', gameOnHandler);
		};
	}, [socket]);

	// send game data
	const sendGame = useCallback(
		(game) => {
			socket.emit('game', {
				userId: user?._id,
				roomData: publicRoom,
				gameData: game,
			});
		},
		[socket, publicRoom]
	);

	// get thisMove Data
	useEffect(() => {
	if (socket === null) return;

	const thisMoveHandler = (res) => {
		console.log('recivied thisMove data', res);
		setSocketThisMove(res.thisMoveData);
		localStorage.removeItem('thisMoveData')
		localStorage.setItem('thisMoveData', JSON.stringify(res.thisMoveData))
	};

		socket.on('moveMade', thisMoveHandler);
		
		return () => {
			socket.off('moveMade', thisMoveHandler)
		}
	}, [socket])

	// send thisMove data
	const sendThisMove = useCallback(
		(thisMove) => {
			socket.emit('thisMove', {
				userId: user?._id,
				roomData: publicRoom,
				thisMoveData: thisMove,
			});
		},
		[socket, publicRoom]
	);

	return (
		<GameContext.Provider
			value={{
				socket,
				onlinePlayers,
				publicRoom,
				publicRoomError,
				createPublicRoom,
				deletePublicRoom,
				joinRoom,
				publicRooms,
				mySocketId,
				socketThisTurn,
				socketGameData,
				socketThisMove,
				sendThisTurn,
				sendGame,
				sendThisMove,
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
