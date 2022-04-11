const mongoose = require('mongoose')
const Person = require('../models/person')
require('dotenv').config()

const mongoURI = process.env.MONGODB_URI

mongoose.connect(mongoURI)
	.then(() => {
		console.log('Connected to mongo')
	})
	.catch(err => {
		console.log('Error connecting to mongo', err.message)
	})

const startingPeople = [
	new Person({ name: 'John Dwyer', number: '234-556' }),
	new Person({ name: 'Lila Ramani', number: '222-181' }),
	new Person({ name: 'Stu Mackenzie', number: '16728-29' })
]

Person.insertMany(startingPeople).then(() => {
	console.log('People have been saved!')
	mongoose.connection.close()
})






