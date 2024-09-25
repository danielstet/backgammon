import { createContext, useEffect, useState, useCallback } from 'react';
import { baseUrl, getRequest, postRequest } from '../utils/apiServices';
import { io } from 'socket.io-client';
import PropTypes from 'prop-types';

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
	const [userChats, setUserChats] = useState(null);
	const [isUserChatsLoading, setIsUserChatLoading] = useState(false);
	const [userChatsError, setUserChatsError] = useState(null);
	const [potentialChats, setPotentialChats] = useState([]);
	const [currentChat, setCurrentChat] = useState(null);
	const [messages, setMessages] = useState(null);
	const [isMessagesLoading, setIsMessagesLoading] = useState(false);
	const [messagesError, setMessagesError] = useState(null);
	const [sendTextMessageError, setSendTextMessageError] = useState(null);
	const [newMessage, setNewMessage] = useState(null);
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const [notifications, setNotifications] = useState([]);
	const [allUsers, setAllUsers] = useState([]);

	// console.log("currentChat in chatContext:", currentChat);
	// console.log("messages:" , messages);
	// console.log('onlineUsers:', onlineUsers);
	// console.log("Notifications:", notifications);
	// console.log("user in chatContext:", user);

	// initital socekt:
	useEffect(() => {
		const newSocket = io(
			import.meta.env.VITE_SOCKET_URL || 'http://localhost:3333'
		);
		setSocket(newSocket);

		return () => {
			newSocket.disconnect();
		};
	}, [user]);

	// add online users
	useEffect(() => {
		if (socket === null) return;

		socket.emit('addNewUser', user?._id);
		socket.on('getOnlineUsers', (res) => {
			setOnlineUsers(res);
		});
	}, [socket]);

	// send message
	useEffect(() => {
		if (socket === null) return;
		const recipientId = currentChat?.members.find((id) => id !== user?._id);
		socket.emit('sendMessage', { ...newMessage, recipientId });
	}, [newMessage]);

	// recive message and notification from webSocekt
	useEffect(() => {
		if (socket === null) return;

		socket.on('getMessage', (res) => {
			if (currentChat?._id !== res.chatId) return;
			setMessages((prev) => [...prev, res]);
		});

		socket.on('getNotification', (res) => {
			const isChatOpen = currentChat?.members.some(
				(id) => id === res.senderId
			);

			if (isChatOpen) {
				setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
			} else {
				setNotifications((prev) => [res, ...prev]);
			}
		});

		return () => {
			socket.off('getMessage');
			socket.off('getNotification');
		};
	}, [socket, currentChat]);

	// sets potential chats and all users by searching existing users in the database
	// (should be changed and updated to a friends system)
	useEffect(() => {
		const getUsers = async () => {
			const response = await getRequest(`${baseUrl}/users`);
			if (response.error) {
				return console.log('Error fetching users:', response);
			}

			const pChats = response.filter((u) => {
				let isChatCreated = false;
				if (user._id === u._id) return false;

				if (userChats) {
					isChatCreated = userChats?.some((chat) => {
						return (
							chat.members[0] === u._id ||
							chat.members[1] === u._id
						);
					});
				}
				return !isChatCreated;
			});
			setPotentialChats(pChats);
			setAllUsers(response);
		};
		getUsers();
	}, [userChats]);

	// loads all the User's chats
	useEffect(() => {
		const getUserChats = async () => {
			if (user?._id) {
				setIsUserChatLoading(true);
				setUserChatsError(null);
				const response = await getRequest(
					`${baseUrl}/chats/${user?._id}`
				);
				setIsUserChatLoading(false);

				if (response.error) {
					return setUserChatsError(response);
				}

				setUserChats(response);
			}
		};
		getUserChats();
	}, [user, notifications]);

	// get's all the messages of the chat (current chat)
	useEffect(() => {
		const getMessages = async () => {
			setIsMessagesLoading(true);
			setMessagesError(null);
			const response = await getRequest(
				`${baseUrl}/messages/${currentChat?._id}`
			);
			setIsMessagesLoading(false);

			if (response.error) {
				return setMessagesError(response);
			}

			setMessages(response);
		};
		getMessages();
	}, [currentChat]);

	// sends a text message to restAPI and wait for confirmation
	// if success render it on current client side
	const sendTextMessage = useCallback(
		async (textMessage, sender, currentChatId, setTextMessage) => {
			if (!textMessage) return console.log('You must type something...');

			const response = await postRequest(
				`${baseUrl}/messages`,
				JSON.stringify({
					chatId: currentChatId,
					senderId: sender._id,
					text: textMessage,
				})
			);

			if (response.error) return setSendTextMessageError(response);

			setNewMessage(response);
			setMessages((prev) => [...prev, response]);
			setTextMessage('');
		},
		[]
	);

	// updates the current "Active" chat to another
	const updateCurrentChat = useCallback((chat) => {
		setCurrentChat(chat);
	}, []);

	// creates a new chat with other user if that doesnt exist yet
	// if exists the restAPI will send back the existing chat of both users
	const createChat = useCallback(async (firstId, secondId) => {
		const response = await postRequest(
			`${baseUrl}/chats`,
			JSON.stringify({
				firstId,
				secondId,
			})
		);
		if (response.error) {
			return console.log('Error creating chat', response);
		}

		setUserChats((prev) => [...prev, response]);
	}, []);

	// marks all the unread notifications as read
	const markAllNotificationsAsRead = useCallback((notifications) => {
		const mNotifications = notifications.map((n) => {
			return { ...n, isRead: true };
		});
		setNotifications(mNotifications);
	}, []);

	// mark notification as read from specific user in the Notifications menu / bubble
	const markNotificationAsRead = useCallback(
		(n, userChats, user, notifications) => {
			// find chat to open
			const desiredChat = userChats.find((chat) => {
				const chatMembers = [user._id, n.senderId];
				const isDesiredChat = chat?.members.every((member) => {
					return chatMembers.includes(member);
				});
				return isDesiredChat;
			});

			// mark notifications as read
			const mNotifications = notifications.map((el) => {
				if (n.senderId === el.senderId) return { ...n, isRead: true };
				else return el;
			});
			updateCurrentChat(desiredChat);
			setNotifications(mNotifications);
		},
		[]
	);

	// mark this user notification by entering the chat
	const markThisUserNotificationsAsRead = useCallback(
		(thisUserNotifications, notifications) => {
			// mark notifications as read
			// m stands for modified
			const mNotifications = notifications.map((el) => {
				let notification;

				thisUserNotifications.forEach((n) => {
					if (n.senderId === el.senderId) {
						notification = { ...n, isRead: true };
					} else {
						notification = el;
					}
				});

				return notification;
			});
			console.log(
				'markThisUserNotificationsAsRead before set:',
				mNotifications
			);

			setNotifications(mNotifications);
		},
		[]
	);

	return (
		<ChatContext.Provider
			value={{
				userChats,
				isUserChatsLoading,
				userChatsError,
				potentialChats,
				createChat,
				updateCurrentChat,
				messages,
				isMessagesLoading,
				messagesError,
				currentChat,
				sendTextMessage,
				onlineUsers,
				notifications,
				allUsers,
				markAllNotificationsAsRead,
				markNotificationAsRead,
				markThisUserNotificationsAsRead,
				sendTextMessageError,
			}}
		>
			{children}
		</ChatContext.Provider>
	);
};
ChatContextProvider.propTypes = {
	children: PropTypes.node.isRequired,
	user: PropTypes.any,
};
