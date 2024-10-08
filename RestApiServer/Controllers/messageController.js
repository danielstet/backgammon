const { default: mongoose } = require('mongoose');
const messageModel = require('../Models/messageModel');

const createMessage = async (req, res) => {
	const { chatId, senderId, text } = req.body;

	const message = new messageModel({
		chatId,
		senderId,
		text,
	});

	try {
		const response = await message.save();
		res.status(200).json(response);
	} catch (error) {
		console.log(
			`error when trying to save message to DB \n \t location: ${__dirname}`
				.red
		);
		console.log(`error: \n ${error}`.red);
		res.status(500).json(error);
	}
};

const getMessages = async (req, res) => {
	const { chatId } = req.params;
	try {
		const messages = await messageModel.find({ chatId });
		res.status(200).json(messages);
	} catch (error) {
		console.log(
			`error when trying to get messages from DB \n \t location: ${__dirname}`
				.red
		);
		console.log(`error: \n ${error}`.red);
		res.status(500).json(error);
	}
};

module.exports = { createMessage, getMessages };
