const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
	name: {
		type: String,
		// required: true,
		// minlength: 3,
		trim: true
	},
	email: {
		type: String,
		required: true,
		minlength: 1,
		unique: true,
		trim: true,
		validate: {
			// validator: validator.isEmail(value),
			// original below
			validator: (value) => {
				return validator.isEmail(value);
			},
			message: '{VALUE] is not a valid email'
		}
	},
	password: {
		type: String,
		require: true,
		minlength: 6
	},
	tokens: [{
		access: {
			type: String,
			require: true
		},
		token: {
			type: String,
			require: true
		}
	}]
});

UserSchema.methods.toJSON = function () {
	var user = this;
	var userObject = user.toObject();
	return _.pick(userObject, ['_id', 'email'])
};

UserSchema.methods.generateAuthToken = function () {
	var user = this;
	var access = 'auth';
	var token = jwt.sign({_id: user._id.toHexString(), access}, 'test').toString();

	user.tokens.push({access, token});

	return user.save().then(() => {
		return token;
	});
};

var User = mongoose.model('User', UserSchema);

module.exports = {
	User
};
