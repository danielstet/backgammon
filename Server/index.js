const express = require('express')
const cors = require('cors')
const colors = require('colors');
const mongoose = require('mongoose')
const userRoute = require('./Routes/userRouter')



const app = express()
require("dotenv").config()
const port = process.env.PORT || 4040; 
const connectionString = process.env.CONNECTION_STRING;

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.status(200).json("Welcome to the Backgammon RestAPI")
})


app.use('/api/users', userRoute)

app.listen(port, (req, res) => {
    console.log(`RestAPI is running on port: ${port}`.green);
})




mongoose
	.connect(connectionString)
	.then(() => console.log('Successfuly Connected to mongoDB'.green))
	.catch((error) => {
		console.log(
			`Connection failed to mongoDB \n Error: \n ${error.message}`.red
		);
	});