import "./ChatBox.css"
import moment from 'moment';
import InputEmoji from 'react-input-emoji';
import { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from '../../context/ChatContext';
import { useFetchRecipientUser } from '../../hooks/useFetchRecipient';

const ChatBox = () => {
	const { user } = useContext(AuthContext);
	const { currentChat, messages, isMessagesLoading, sendTextMessage } =
		useContext(ChatContext);
	const { recipientUser } = useFetchRecipientUser(currentChat, user);
	const [textMessage, setTextMessage] = useState('');
	const scroll = useRef();

	// מאפס את הגובה של הגלילה 
	const handleScroll = () => {
		if (scroll.current) {
			scroll.current.scrollTop = scroll.current.scrollHeight; // גלילה לתחתית של הקופסה
		}
	};
	
	useEffect(() => {
		handleScroll(); // קובע גלילה לתחתית לאחר קבלת הודעות
	}, [messages]);

	if (!user) {
		return (
			<p style={{ textAlign: 'center', width: '100%' }}>
				Loading user...
			</p>
		);
	}

	if (!recipientUser)
		return (
			<p style={{ textAlign: 'center', width: '100%' }}>
				No conversation selected yet...
			</p>
		);

	if (isMessagesLoading)
		return (
			<p style={{ textAlign: 'center', width: '100%' }}>
				Loading Chat...
			</p>
		);

	return (
		<div className="chat-box">
			<div className="chat-header">
				<strong>{recipientUser?.name}</strong>
			</div>
			<div className="messages" ref={scroll}>
				{messages &&
					messages.map((message, index) => (
						<div
							key={index}
							className={`message ${
								message?.senderId === user._id
									? 'self align-self-end'
									: 'align-self-start'
							}`}
						>
							<span>{message.text}</span>
							<span className="message-footer">
								{moment(message.createdAt).calendar()}
							</span>
						</div>
					))}
			</div>
			<div className="chat-input">
				<InputEmoji
					value={textMessage}
					onChange={setTextMessage}
					fontFamily="nunito"
					borderColor="rgba(72, 112, 223, 0.2)"
				/>
				<button
					className="send-btn"
					onClick={() =>
						sendTextMessage(
							textMessage,
							user,
							currentChat._id,
							setTextMessage
						)
					}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						fill="currentColor"
						className="bi bi-send-fill"
						viewBox="0 0 16 16"
					>
						<path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
					</svg>
				</button>
			</div>
		</div>
	);
}

export default ChatBox;
