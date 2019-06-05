const express = require('express'),
  router = express.Router({ mergeParams: true }),
  Campground = require('../models/campground'),
  Comment = require('../models/comment'),
  middleware = require('../middleware')

// Comments New
router.get('/new', middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      console.log(err)
    } else {
      res.render('comments/new', { campground: foundCampground })
    }
  })
})

// Comments Create
router.post('/', middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err)
      res.redirect('/campgrounds')
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          req.flash('error', 'Something went wrong')
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
          req.flash('success', 'Successfully added comment')
          res.redirect('/campgrounds/' + campground._id)
        }
      })
    }
  })
})

// Comments (edit route)
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
  const { id, comment_id } = req.params
  Campground.findById(id, (err, foundCampground) => {
    if (err || !foundCampground) {
      req.flash('error', 'Campground not found')
      return res.redirect('back')
    }
    Comment.findById(comment_id, (err, foundComment) => {
      if (err) {
        console.log(err)
        res.redirect('back')
      } else {
        res.render('comments/edit', {
          campground_id: id,
          comment: foundComment,
        })
      }
    })
  })
})

// Comments (update)
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
    if (err) {
      res.redirect('back')
    } else {
      res.redirect('/campgrounds/' + req.params.id)
    }
  })
})

// COMMENT DESTROY ROUTE
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err) => {
    if (err) {
      req.fash('error', err.message)
      res.redirect('back')
    } else {
      req.flash('success', 'Comment deleted')
      res.redirect('/campgrounds/' + req.params.id)
    }
  })
})

module.exports = router
