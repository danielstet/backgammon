const userModel = require('../Models/userModel');
const bycrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const colors = require('colors');

const createToken = (_id) => {
	const JwtKey = process.env.JWT_SECRET_KEY;

	return jwt.sign({ _id }, JwtKey, { expiresIn: '1d' });
};

const registerUser = async (req, res) => {
	try {
		console.log(req.body);
		let { name, email, password } = req.body;
		if (!name || !email || !password) {
			return res.status(400).json('All fields are required');
		}
		let user = await userModel.findOne({ email });
		if (user) {
			return res
				.status(400)
				.json('User with the given email already exists...');
		}
		if (!validator.isEmail(email))
			return res
				.status(400)
				.json('Email must contain a valid email address');
		if (!validator.isStrongPassword(password))
			return res.status(400).json('Password must be strong password');

		const salt = await bycrypt.genSalt(10);
		password = bycrypt.hashSync(password, salt);

		user = new userModel({ name, email, password });

		await user.save();

		const token = createToken(user._id);

		res.status(200).json({ _id: user._id, name, email, token });
	} catch (error) {
		console.log(
			`error when registering a new user \n \t location: ${__dirname}`.red
		);
		console.log(`error: \n ${error}`.red);
		res.status(500).json(error);
	}
};

const loginUser = async (req, res) => {
	const { email, password } = req.body;
	try {
		let user = await userModel.findOne({ email });
		if (!user) return res.status(400).json('Invalid email or password...');
		const isValidPassword = await bycrypt.compare(password, user.password);
		if (!isValidPassword)
			return res.status(400).json('Invalid email or password');
		const token = createToken(user._id);
		res.status(200).json({ _id: user._id, name: user.name, email, token });
	} catch (error) {
		console.log(
			`error when trying to login \n \t location: ${__dirname}`.red
		);
		console.log(`error: \n ${error}`.red);
		res.status(500).json(error);
	}
};

const findUser = async (req, res) => {
	const userId = req.params.userId;
	try {
		const user = await userModel.findById(userId);

		res.status(200).json(user);
	} catch (error) {
		console.log(
			`error when trying to find a new user \n \t location: ${__dirname}`
				.red
		);
		console.log(`error: \n ${error}`.red);
		res.status(500).json(error);
	}
};

const getUsers = async (req, res) => {
	try {
		const users = await userModel.find();
		res.status(200).json(users);
	} catch (error) {
		console.log(
			`error when trying to find a new user \n \t location: ${__dirname}`
				.red
		);
		console.log(`error: \n ${error}`.red);
		res.status(500).json(error);
	}
};

module.exports = { registerUser, loginUser, findUser, getUsers };
