var mongoose = require("mongoose");

//SCHEMA SETUP
var trailSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	website: String,
	location: String,
	lat: Number,
	lng: Number,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String,
	},
	comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
    ]
});

module.exports = mongoose.model("Trail", trailSchema);
