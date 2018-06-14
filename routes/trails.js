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

//INDEX - show all trails
router.get("/trails", function(req, res) {
	//Get all trails from DB
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

module.exports = router;
