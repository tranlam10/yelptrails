var Trail = require("../models/trail");
var Comment = require("../models/comment");

var middlewareObj = {
  isLoggedIn: function(req, res, next) {
  	if(req.isAuthenticated()) {
  		return next();
  	}
    req.flash("error", "You need to be logged in to do that");
  	res.redirect("/login");
  },

  checkTrailOwner: function(req, res, next) {
    	if (req.isAuthenticated) {
    		Trail.findById(req.params.id, function(err, foundTrail) {
    			if (err) {
            req.flash("error", "Trail not found");
    				res.redirect("/trails");
    			} else {
    				//does user own the trail?
    				if (foundTrail.author.id.equals(req.user._id)) {
    					next();
    				} else {
              req.flash("error", "You don't have permission to do that!");
    					res.redirect("back");
    				}
    			}
    		});
    	} else {
    		res.redirect("back");
    	}
    },

  checkCommentOwner: function(req, res, next) {
    	if (req.isAuthenticated()) {
    		Comment.findById(req.params.comment_id, function(err, foundComment) {
    			if (err) {
    				res.redirect("back");
    			} else {
    				//does user own the comment?
    				if(foundComment.author.id.equals(req.user._id)) {
    					next();
    				} else {
              req.flash("error", "You don't have permission to do that!");
    					res.redirect("back");
    				}
    			}
    		});
    	} else {
    		res.redirect("back");
    	}
    }
  }

module.exports = middlewareObj;
