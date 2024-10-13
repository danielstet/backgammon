import { useContext } from 'react';
import { ChatContext } from '../../context/ChatContext';
import moment from 'moment';
import PropTypes from "prop-types";
import { useFetchLatestMessage } from '../../hooks/useFetchLatestMessage';
import { useFetchRecipientUser } from '../../hooks/useFetchRecipient';
import { unreadNotificationsFunc } from '../../utils/unreadNotifications';
import avatar from '../../assets/avatar.svg'
import './UserChat.css'

// the user Interface where he reads the chat messages
const UserChat = ({ chat, user }) => {
	const { recipientUser } = useFetchRecipientUser(chat, user);
	const { latestMessage } = useFetchLatestMessage(chat);
	const { onlineUsers, notifications, markThisUserNotificationsAsRead } =
		useContext(ChatContext);
	const unreadNotifications = unreadNotificationsFunc(notifications);

	const thisUserNotifications = unreadNotifications?.filter(
		(n) => n.senderId == recipientUser?._id
	);

	const isOnline = onlineUsers?.some(
		(user) => user?.userId === recipientUser?._id
	);

	const truncateText = (text) => {
		let shortText = text.substring(0, 20);

		if (text.length > 20) {
			shortText = shortText + '...';
		}

		return shortText;
	};
	return (
		<>
			<div
				className="user-card"
				role="button"
				onClick={() => {
					if (thisUserNotifications?.length !== 0) {
						console.log("thisUserNotifications:", thisUserNotifications);
						console.log("Notifications:", notifications);
						
						markThisUserNotificationsAsRead(
							thisUserNotifications,
							notifications
						);
					}
				}}
			>
				<div className="chat-item">
					<div className="avatar-container">
						<img
							src={avatar}
							height="35px"
							alt="User Avatar"
						/>
						<div className="name">
							{recipientUser?.name}
							<div className="text">
								{latestMessage?.text && (
									<span>{truncateText(latestMessage?.text)}</span>
								)}
							</div>
						</div>
					</div>
						<div className="date-container">
							<div className="date">
								{moment(latestMessage?.createdAt).calendar()}
							</div>
							<div
								className={
									thisUserNotifications?.length > 0
										? 'this-user-notifications'
										: ''
								}
							>
								{thisUserNotifications?.length > 0
									? thisUserNotifications?.length
									: ''}
							</div>
							<span className={isOnline ? 'user-online' : ''}></span>
						</div>
			
				</div>
			</div>
		</>
	);
};

UserChat.propTypes = {
	chat: PropTypes.any,
	user: PropTypes.any,
};

export default UserChat;
