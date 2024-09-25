const chatModel = require('../Models/chatModel');
const colors = require('colors');

const createChat = async (req, res) => {
	const { firstId, secondId } = req.body;

	try {
		const chat = await chatModel.findOne({
			members: { $all: [firstId, secondId] },
		});
		if (chat) return res.status(200).json(chat);

		const newChat = new chatModel({
			members: [firstId, secondId],
		});

		const response = await newChat.save();

		res.status(200).json(response);
	} catch (error) {
		console.log(
			`error when trying to create a new chat \n \t location: ${__dirname}`
				.red
		);
		console.log(`error: \n ${error}`.red);
		res.status(500).json(error);
	}
};

const findUserChats = async (req, res) => {
	const userId = req.params.userId;

	try {
		const chats = await chatModel.find({
			members: { $in: [userId] },
		});
		res.status(200).json(chats);
	} catch (error) {
		console.log(
			`error when trying to find user's chats \n \t location: ${__dirname}`
				.red
		);
		console.log(`error: \n ${error}`.red);
		res.status(500).json(error);
	}
};

const findChat = async (req, res) => {
	const { firstId, secondId } = req.params;
	try {
		const chat = await chatModel.findOne({
			members: { $all: [firstId, secondId] },
		});

		return res.status(200).json(chat);
	} catch (error) {
		console.log(
			`error when trying to find a chat \n \t location: ${__dirname}`.red
		);
		console.log(`error: \n ${error}`.red);
		res.status(500).json(error);
	}
};

module.exports = { createChat, findUserChats, findChat };
