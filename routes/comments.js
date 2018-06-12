var express = require("express");
var router = express.Router({mergeParams: true});
var Trail = require("../models/trail");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments New
router.get("/trails/:id/comments/new", middleware.isLoggedIn, function(req, res){
	Trail.findById(req.params.id, function(err, trail) {
		if (err) {
			console.log(err);
		}
		else {
			res.render("comments/new", {trail: trail});
		}
	});
});

//Comments Create
router.post("/trails/:id/comments", middleware.isLoggedIn, function(req, res){
	//lookup trail using ID
	Trail.findById(req.params.id, function(err, trail){
		if (err) {
			console.log(err);
			res.redirect("/trails");
		} else {
			Comment.create(req.body.comment, function(err, comment) {
				if (err) {
					console.log(err);
				} else {
					//Add username and id to comments
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					//Save comment
					trail.comments.push(comment);
					trail.save();
					console.log(comment);
					res.redirect('/trails/' + trail._id);
				}
			});
		}
	});
});

//Edit comments
router.get("/trails/:id/comments/:comment_id/edit", middleware.checkCommentOwner, function(req, res) {
	Comment.findById(req.params.comment_id, function(err, foundComment) {
		if (err) {
			res.redirect("back");
		} else {
			res.render("comments/edit", {trail_id: req.params.id, comment: foundComment});
		}
	});
});

//UPDATE COMMENT
router.put("/trails/:id/comments/:comment_id", middleware.checkCommentOwner, function(req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
		if (err) {
			res.redirect("back");
		} else {
			res.redirect("/trails/" + req.params.id);
		}
	});
});

router.delete("/trails/:id/comments/:comment_id", middleware.checkCommentOwner, function(req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function(err) {
		if (err) {
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted");
			res.redirect("/trails/" + req.params.id);
		}
	});
});


//middleware
// function isLoggedIn(req, res, next) {
// 	if(req.isAuthenticated()) {
// 		return next();
// 	}
// 	res.redirect("/login");
// }
//
// function checkCommentOwner(req, res, next) {
// 	if (req.isAuthenticated()) {
// 		Comment.findById(req.params.comment_id, function(err, foundComment) {
// 			if (err) {
// 				res.redirect("back");
// 			} else {
// 				//does user own the comment?
// 				if(foundComment.author.id.equals(req.user._id)) {
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
