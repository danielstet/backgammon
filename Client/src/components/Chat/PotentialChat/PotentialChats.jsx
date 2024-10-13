import './PotentialChat.css';
import { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { ChatContext } from '../../../context/ChatContext';

const PotentialChats = () => {
	const { user } = useContext(AuthContext);
	const { potentialChats, createChat, onlineUsers } = useContext(ChatContext);

	return (
		<div className="PotentialChats">
			<p className='title'>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="12px">
				<path d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c0 0 0 0 0 0s0 0 0 0s0 0 0 0c0 0 0 0 0 0l.3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z"/>
			</svg>
				Potential Chats
			</p>
			<div className="all-users">
				{potentialChats &&
					potentialChats.map((u, index) => {
						return (
							<div
								key={index}
        				        className="single-user"
								onClick={() => createChat(user._id, u._id)}
							>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="12" height="12" fill='white'>
									{/* Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc. */}
									<path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"/>
								</svg>
								{u.name}
								<span
									className={
										onlineUsers?.some(
											(user) => user?.userId === u?._id
										)
											? 'user-online'
											: ''
									}
								></span>
							</div>
						);
					})}
			</div>
		</div>
	);
};

export default PotentialChats;
