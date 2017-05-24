const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
	// console.log(req.body);
	var todo = Todo({
		text: req.body.text
	});
	todo.save().then((doc) => {
		res.send(doc);
		// console.log("Saved todo", doc);
	}, (e) => {
		// console.log('Error. Unable to save.', e);
		res.status(400).send(e);
	});
});

app.get('/todos', (req, res) => {
	Todo.find().then((todos) => {
		res.send({todos});
	}, (e) => {
		res.status(400).send(e);
	});
});

app.get('/todos/:id', (req, res) => {
	var id = req.params.id;
	if (!ObjectID.isValid(id)) {
		// res.status(404).send('this is an invalid id');
		// message not required, can send empty
		res.status(404).send();
	}
	Todo.findById(id).then((todo) => {
		if (!todo) {
			res.status(404).send('todo doesn\'t exist');
		}
		res.send({todo});
	}).catch((e) => {
		// message not required, can send empty
		res.status(400).send();
	});
});

app.delete('/todos/:id', (req, res) => {
	//	get the id
	var id = req.params.id;

	//	validate the id, not valid? return 404
	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	//	remove todo by id
	Todo.findByIdAndRemove(id).then((todo) => {
		if (!todo) {
			return res.status(404).send();
		}
		res.status(200).send({todo});
	}).catch((e) => {
		res.status(400).send();
	});
});

app.patch('/todos/:id', (req, res) => {
	var id = req.params.id;
	var body = _.pick(req.body, ['text', 'completed']);

	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	if (_.isBoolean(body.completed) && body.completed) {
		body.completedAt = new Date().getTime();
	} else {
		body.completed = false;
		body.completedAt = null;
	}

	Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
		if (!todo) {
			return res.status(404).send();
		}
		res.status(200).send({todo});
	}).catch((e) => {
		res.status(400).send();
	});
});

// app.get('/todos/1231')

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});

module.exports = {app};
