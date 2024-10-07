import PotentialChats from '../components/Chat/PotentialChat/PotentialChats';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import UserChat from '../components/Chat/UserChat';
import ChatBox from '../components/Chat/ChatBox';
import RoomCreator from '../components/RoomCreator/RoomCreator';
import { GameContext } from '../context/GameContext';

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
				Chat part:
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
				Game lobby part
				<RoomCreator />
				{publicRooms.length}
				{publicRooms.length ? (
					publicRooms.map((room) => {
						return (
							<div key={room.RoomId}>
								{room.CreatorId === user._id ? (
									<>
										<button
											onClick={() =>
												deletePublicRoom(room.RoomId)
											}
										>
											Delete Room
										</button>
										<p style={{color: 'blue'}}>
											CreatorId: {room.CreatorId}
											OpponentId: {room.OpponentId}
										</p>
									</>
								) : (
									<>
										<button
											onClick={() =>
												joinRoom(room.RoomId)
											}
										>
											Join Room
										</button>
										<p style={{color: 'green' }}>
											CreatorId: {room.CreatorId}
											OpponentId: {room.OpponentId}
										</p>
									</>
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
