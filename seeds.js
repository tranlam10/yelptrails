var mongoose = require("mongoose");
var Trail = require("./models/trail");
var Comment = require("./models/comment");

var data = [
	{
		name: "Angel's Landing",
		image: "https://images.unsplash.com/photo-1475351177616-1e5e440dccef?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=7cde0a2b5b4ba4abb69d19f61288c30d&auto=format&fit=crop&w=1950&q=80",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	},
	{
		name: "The Narrows",
		image: "https://images.unsplash.com/photo-1509595427827-45f14a172eec?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a0e0a17e48cd1c7a18c06314455e5155&auto=format&fit=crop&w=1050&q=80",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	},
	{
		name: "South Kaibab Trail",
		image: "https://images.unsplash.com/photo-1505191878972-12d4a2be6e49?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=397e549577a1d4fdf5c1c307667d9379&auto=format&fit=crop&w=1053&q=80",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
	}];

function seedDB() {
	//Remove all trails
	Trail.remove({}, function(err){
		if(err) {
			console.log(console.log(err));
		}
		console.log("Removed trails");

		//Add new trails
		data.forEach(function(seed) {
			Trail.create(seed, function(err, trail) {
				if (err) {
					console.log(err);
				} else {
					console.log("Added a trail");
					Comment.create(
					{
						text: "Great place!",
						author: "Homer"
					}, function(err, comment){
						if (err) {
							console.log(err);
						} else {
							trail.comments.push(comment);
							trail.save();
							console.log("Created new comment");
						}
					});
				}
			});
		});
	});



}

module.exports = seedDB;
