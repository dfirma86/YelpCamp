const express = require('express'),
  router = express.Router(),
  Campground = require('../models/campground')

// Index route (Shows all campgrounds)
router.get('/', (req, res) => {
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err)
    } else {
      res.render('campgrounds/index', {
        campgrounds: allCampgrounds,
        currentUser: req.user,
      })
    }
  })
})

// Create route (Add new campground to DB)
router.post('/', isLoggedIn, (req, res) => {
  const { _id, username } = req.user
  const author = {
    username: username,
    id: _id,
  }

  const { name, image, description } = req.body
  const newCampground = {
    name: name,
    image: image,
    description: description,
    author: author,
  }
  console.log('user is... ' + req.user.username)

  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) {
      console.log(err)
    } else {
      console.log(newlyCreated)
      res.redirect('/campgrounds')
    }
  })
})

// New route (Shows form to create new campground)
router.get('/new', isLoggedIn, (req, res) => {
  // find the campground with provided ID
  // render show template with that campground
  res.render('campgrounds/new')
})

// SHOW - shows more info about one campground
router.get('/:id', (req, res) => {
  const { id } = req.params

  Campground.findById(id)
    .populate('comments')
    .exec((err, foundCampground) => {
      if (err) {
        console.log(err)
      } else {
        res.render('campgrounds/show', { campground: foundCampground })
      }
    })
})

// EDIT CAMPGROUND ROUTE (show form to edit...)
router.get('/:id/edit', checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    res.render('campgrounds/edit', { campground: foundCampground })
  })
})

// UPDATE CAMPGROUND ROUTE (edited form submitted here)
router.put('/:id', checkCampgroundOwnership, (req, res) => {
  // find and update the correct campground
  // redirect somewhere (usually the show page of the updated campground)
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
    if (err) {
      console.log(err)
      res.redirect('/campgrounds')
    } else {
      res.redirect('/campgrounds/' + req.params.id)
    }
  })
})

// DESTROY CAMPGROUND ROUTE
router.delete('/:id', checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      console.log(err)
      res.redirect('/campgrounds')
    } else {
      res.redirect('/campgrounds')
    }
  })
})

// Middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next()
  res.redirect('/login')
}

function checkCampgroundOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err) {
        console.log(err)
        res.redirect('back')
      } else {
        // does user own campground?
        if (foundCampground.author.id.equals(req.user._id)) {
          // res.render('campgrounds/edit', { campground: foundCampground })
          next()
        } else {
          res.redirect('back')
        }
      }
    })
  } else {
    res.redirect('back')
  }
}

module.exports = router
