var express = require("express");
var router = express.Router();
var Trail = require("../models/trail");
var Comment = require("../models/comment");
var middleware = require("../middleware");
var NodeGeocoder = require('node-geocoder');

var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};

var geocoder = NodeGeocoder(options);

// var trails = [
// 	{name: "Angel's Landing", image: "https://images.unsplash.com/photo-1475351177616-1e5e440dccef?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=7cde0a2b5b4ba4abb69d19f61288c30d&auto=format&fit=crop&w=1950&q=80"},
// 	{name: "The Narrows", image: "https://images.unsplash.com/photo-1509595427827-45f14a172eec?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a0e0a17e48cd1c7a18c06314455e5155&auto=format&fit=crop&w=1050&q=80"},
// 	{name: "South Kaibab Trail", image: "https://images.unsplash.com/photo-1505191878972-12d4a2be6e49?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=397e549577a1d4fdf5c1c307667d9379&auto=format&fit=crop&w=1053&q=80"},
// 	];

//INDEX - show all campgrounds
router.get("/trails", function(req, res) {
	//Get all campgrounds from DB
	console.log(req.user);
	Trail.find({}, function(err, alltrails){
		if (err) {
			console.log(err);
		} else {
			res.render("trails/trails", {trails: alltrails}); //name of our data, and name we are passing into it
		}
	});
});

//CREATE - add new trails to the database
router.post("/trails", middleware.isLoggedIn, function (req, res) {
	//get data from form and add to trails array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
  var website = req.body.website;
	var author = {
		id: req.user._id,
		username: req.user.username
	};

	geocoder.geocode(req.body.location, function (err, data) {
	 if (err || !data.length) {
		 req.flash('error', 'Invalid address');
		 return res.redirect('back');
	 }
	 var lat = data[0].latitude;
	 var lng = data[0].longitude;
	 var location = data[0].formattedAddress;

	var newTrail = {name: name, image: image, description: desc, website: website, author: author, location: location, lat: lat, lng: lng};
	//create a new campground and save to database
	console.log(newTrail);
	Trail.create(newTrail, function (err, newlyCreated){
		if (err) {
			res.redirect("/trails");
		} else {
			//redirect back to trails page
			res.redirect("/trails");
		}
	});
	trails.push(newTrail);
	});
});

//NEW - show form to create new trail
router.get("/trails/new", middleware.isLoggedIn, function(req, res){
	res.render("trails/new");
});

//SHOW - show info about selected trail
router.get("/trails/:id", function (req, res) {
	Trail.findById(req.params.id).populate("comments").exec(function (err, foundTrail) {
		console.log(foundTrail);
		if (err) {
			console.log(err);
		} else {
			res.render("trails/show", {trail: foundTrail});
		}
	});
});

//EDIT - edit info about selected trail
router.get("/trails/:id/edit", middleware.checkTrailOwner, function(req, res){
		Trail.findById(req.params.id, function (err, foundTrail) {
			res.render("trails/edit", {trail: foundTrail});
		});
});

//UPDATE
router.put("/trails/:id", middleware.checkTrailOwner, function(req, res) {
	geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.trail.lat = data[0].latitude;
    req.body.trail.lng = data[0].longitude;
    req.body.trail.location = data[0].formattedAddress;

		Trail.findByIdAndUpdate(req.params.id, req.body.trail, function(err, updatedTrail) {
			if (err) {
				res.redirect("/trails");
			} else {
				res.redirect("/trails/" + req.params.id);
			}
		});
	});
});

// DESTROY trails
router.delete("/trails/:id", middleware.checkTrailOwner, function(req, res) {
	Trail.findByIdAndRemove(req.params.id, function(err) {
		if (err) {
			res.redirect("/trails");
		} else {
			res.redirect("/trails");
		}
	});
});

// ///middleware
// function isLoggedIn(req, res, next) {
// 	if(req.isAuthenticated()) {
// 		return next();
// 	}
// 	res.redirect("/login");
// }
//
// function checkTrailOwner(req, res, next) {
// 	if (req.isAuthenticated) {
// 		Trail.findById(req.params.id, function(err, foundTrail) {
// 			if (err) {
// 				res.redirect("/trails");
// 			} else {
// 				//does user own the trail?
// 				if (foundTrail.author.id.equals(req.user._id)) {
// 					next();
// 				} else {
// 					res.redirect("back");
// 				}
// 			}
// 		});
// 	} else {
// 		res.redirect("back");
// 	}
// }

module.exports = router;
