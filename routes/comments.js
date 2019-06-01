const express = require('express'),
  router = express.Router({ mergeParams: true }),
  Campground = require('../models/campground'),
  Comment = require('../models/comment')

// Comments New
router.get('/new', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      console.log(err)
    } else {
      res.render('comments/new', { campground: foundCampground })
    }
  })
})

// Comments Create
router.post('/', isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err)
      res.redirect('/campgrounds')
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err)
        } else {
          // add username and id to comment
          comment.author.id = req.user._id
          comment.author.username = req.user.username
          // console.log(`New comment's username will be ${req.user.username}.`)
          // console.log(`New comment's ID will be ${req.user._id}.`)
          comment.save()
          campground.comments.push(comment)
          campground.save()
          console.log(comment)
          res.redirect('/campgrounds/' + campground._id)
        }
      })
    }
  })
})

// Middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next()
  res.redirect('/login')
}

module.exports = router
