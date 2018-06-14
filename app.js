require('dotenv').config();

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
// var cookieParser = require("cookie-parser");
var localStrategy = require("passport-local");
var flash = require("connect-flash");
var Trail = require("./models/trail");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB= require("./seeds");
// var session = require("express-session");
var methodOverride = require("method-override");

//Requiring routes
var commentRoutes = require("./routes/comments");
var trailRoutes = require("./routes/trails");
var indexRoutes = require("./routes/index");

//mongoose.connect("mongodb://localhost/yelp_trails");
mongoose.connect("mongodb://lam:lol654qp10@ds259070.mlab.com:59070/yelptrail");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Once again Rusty wins!",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(indexRoutes);
app.use(commentRoutes);
app.use(trailRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
	console.log("The YelpTrail server has started!");
});
