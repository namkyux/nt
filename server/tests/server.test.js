const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const seedTodo = [{
	_id: new ObjectID(),
	text: "First test todo"
}, {
	_id: new ObjectID(),
	text: "Second test todo"
}, {
	_id: new ObjectID(),
	text: "Third test todo"
}];

beforeEach((done) => {
	Todo.remove({}).then(() => {
		return Todo.insertMany(seedTodo);
	}).then(() => done());
});

describe('POST /todos', () => {
	it('should create a new todo', (done) => {
		var text = 'This is a test';

		request(app)
			.post('/todos')
			.send({text})
			.expect(200)
			.expect((res) => {
				expect(res.body.text).toBe(text);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.find().then((todos) => {
					expect(todos.length).toBe(4);
					expect(todos[3].text).toBe(text);
					done();
				}).catch((e) => done(e));
			});
	});

	it('should not create todo with invalid body data', (done) => {
		request(app)
			.post('/todos')
			.send({})
			.expect(400)
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				Todo.find().then((todos) => {
					expect(todos.length).toBe(3);
					done();
				}).catch((e) => done(e));
			})
	});
});

describe('GET /todos', () => {
	it('should get all todos', (done) => {
		request(app)
			.get('/todos')
			.expect(200)
			.expect((res) => {
				expect(res.body.todos.length).toBe(3);
			})
			.end(done);
	});
});

describe('GET /todos/:id', () => {
	it('should get todo doc by id', (done) => {
		request(app)
			.get(`/todos/${seedTodo[0]._id.toHexString()}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(seedTodo[0].text);
			})
			.end(done);
	});

	it('should return 404 if todo not found', (done) => {
		var testId = new ObjectID().toHexString();
		request(app)
			.get(`/todos/${testId}`)
			.expect(404)
			.end(done);
	});

	it('should return 404  for non object ids', (done) => {
		var fakeId = 'asdfdasfdasdfa';
		request(app)
			.get(`/todos/${fakeId}`)
			.expect(404)
			.end(done);
	});
});

describe('DELETE /todos/:id', () => {
	it('should remove a todo', (done) => {
		var hexId = seedTodo[1]._id.toHexString();
		request(app)
			.delete(`/todos/${hexId}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo._id).toBe(hexId)
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.findById(hexId).then((todo) => {
					expect(todo).toNotExist();
					done();
				}).catch((e) => done(e));
			});
	});

	it('should return 404 if todo not found', (done) => {
		var hexId = new ObjectID().toHexString();
		request(app)
			.delete(`/todos/${hexId}`)
			.expect(404)
			.end(done);
	});

	it('should return 404 if object is invalid', (done) => {
		var id = 'asdfasdfas';
		request(app)
			.delete(`/todos/${id}`)
			.expect(404)
			.end(done);
	});
});

// it('should return a 404 if todo not found')
