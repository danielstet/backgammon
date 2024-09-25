import PotentialChats from '../components/Chat/PotentialChat/PotentialChats';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import UserChat from '../components/Chat/UserChat';
import ChatBox from '../components/Chat/ChatBox';

const Lobby = () => {
	const { userChats, isUserChatsLoading, updateCurrentChat } =
		useContext(ChatContext);
	const { user } = useContext(AuthContext);

	return (
		<div className="wrapper">
			<div className="chat">
				<PotentialChats />
				Chat part:
				<br />
				{userChats?.length < 1 ? null : (
					<div className="horizontal-stack">
						<div className="messages-box">
							{isUserChatsLoading && <p>Loading chats...</p>}
							{
								userChats?.map((chat, index) => {
								return (
									<div
										key={index}
										onClick={() => updateCurrentChat(chat)}
									>
										<UserChat chat={chat} user={user} />
									</div>
								);
							})}
						</div>
						<ChatBox />
					</div>
				)}
			</div>
			<div className="lobby">Game lobby part</div>
		</div>
	);
};

export default Lobby;
