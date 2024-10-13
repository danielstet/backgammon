import PotentialChats from '../components/Chat/PotentialChat/PotentialChats';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import UserChat from '../components/Chat/UserChat';
import ChatBox from '../components/Chat/ChatBox';
import RoomCreator from '../components/RoomCreator/RoomCreator';
import { GameContext } from '../context/GameContext';
import './Lobby.css'

const Lobby = () => {
	const { userChats, isUserChatsLoading, updateCurrentChat } =
		useContext(ChatContext);
	const { user } = useContext(AuthContext);
	const { deletePublicRoom, joinRoom, publicRooms } = useContext(GameContext);

	return (
		<div className="wrapper">
			{/* chat part */}

			<div className="chat">
				<PotentialChats />
				<div className='border'>
				</div>
				{/* Chat part: */}
				<br />
				{userChats?.length < 1 ? null : (
					<div className="horizontal-stack">
						<div className="messages-box">
							{isUserChatsLoading && <p>Loading chats...</p>}
							{userChats?.map((chat, index) => {
								return (
									<div
										key={index}
										onClick={() => updateCurrentChat(chat)}
									>
										<UserChat
											chat={chat}
											user={user}
										/>
									</div>
								);
							})}
						</div>
						<ChatBox />
					</div>
				)}
			</div>

			{/* game rooms part */}

			<div className="lobby">
				<RoomCreator />
				{publicRooms.length ? (
					publicRooms.map((room) => {
						return (
							<div key={room.RoomId}>
								{room.CreatorId === user._id ? (
									<div>
										<div className='myRoom'>
											<p className='roomInfo'>
												Game was created by:
											</p>
											<p className='creator'>
												{room.CreatorName}
											</p>
											{/* <p style={{color: 'blue'}}>
												CreatorId: {room.CreatorId}
												OpponentId: {room.OpponentId}
											</p> */}
											<button
												onClick={() =>
													deletePublicRoom(room.RoomId)
												}
											>
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="12px" height="12px">
												<path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/>
											</svg>
												Delete Room
											</button>
										</div>
										<div className='border'>
										</div>
									</div>
								) : (
									<div>
										<div className='Rooms'>
											<p className='roomInfo'>
												Game was created by:
											</p>
											<p className='creator'>
												{room.CreatorName}
											</p>
											{/* <p style={{color: 'green' }}>
												CreatorId: {room.CreatorId}
												OpponentId: {room.OpponentId}
												</p> */}
											<button
												onClick={() =>
													joinRoom(room.RoomId)
												}
											>
												<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="14px" fill='white'>
													<path d="M320 32c0-9.9-4.5-19.2-12.3-25.2S289.8-1.4 280.2 1l-179.9 45C79 51.3 64 70.5 64 92.5L64 448l-32 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0 192 0 32 0 0-32 0-448zM256 256c0 17.7-10.7 32-24 32s-24-14.3-24-32s10.7-32 24-32s24 14.3 24 32zm96-128l96 0 0 352c0 17.7 14.3 32 32 32l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-32 0 0-320c0-35.3-28.7-64-64-64l-96 0 0 64z"/>
												</svg>
												Join Room
											</button>
										</div>
										<div className='border'>
										</div>
									</div>
								)}
							</div>
						);
					})
				) : (
					<div>No aviable rooms</div>
				)}
			</div>
		</div>
	);
};

export default Lobby;
