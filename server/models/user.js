var mongoose = require('mongoose');

var User = mongoose.model('User', {
	name: {
		type: String,
		required: true,
		minlength: 3,
		trim: true
	},
	email: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	}
});
// 
// var newUser = new User({
// 	name: "Namkyu Yang",
// 	email: "namkyux@gmail.com"
// });
//
// newUser.save().then((doc) => {
// 	console.log(doc);
// }, (e) => {
// 	console.log('error', e);
// });

module.exports = {
	User
};
