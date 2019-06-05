const Campground = require('../models/campground'),
  Comment = require('../models/comment')

const middlewareObj = {
  checkCampgroundOwnership: (req, res, next) => {
    if (req.isAuthenticated()) {
      Campground.findById(req.params.id, (err, foundCampground) => {
        if (err || !foundCampground) {
          console.log(err)
          req.flash('error', 'Campground not found')
          res.redirect('back')
        } else {
          if (foundCampground.author.id.equals(req.user._id)) {
            // res.render('campgrounds/edit', { campground: foundCampground })
            next()
          } else {
            req.flash('error', 'You do not have permission to do that')
            res.redirect('back')
          }
        }
      })
    } else {
      req.flash('error', 'You need to be logged in to do that')
      res.redirect('/campgrounds') // should it redirect to 'back'
    }
  },
  checkCommentOwnership: (req, res, next) => {
    if (req.isAuthenticated()) {
      Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err || !foundComment) {
          console.log(err)
          req.flash('error', 'Comment not found')
          res.redirect('back')
        } else {
          if (foundComment.author.id.equals(req.user._id)) {
            // res.render('campgrounds/edit', { campground: foundCampground })
            next()
          } else {
            req.flash('error', 'You do not have permission to do that')
            res.redirect('/campgrounds')
          }
        }
      })
    } else {
      req.flash('error', 'You need to be logged in to do that')
      res.redirect('back')
    }
  },
  isLoggedIn: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    req.flash('error', 'You need to be logged in to do that')
    res.redirect('/login')
  },
}

module.exports = middlewareObj
