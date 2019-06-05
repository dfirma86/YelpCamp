const express = require('express'),
  router = express.Router(),
  Campground = require('../models/campground'),
  middleware = require('../middleware')

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
router.post('/', middleware.isLoggedIn, (req, res) => {
  const { _id, username } = req.user
  const author = {
    username: username,
    id: _id,
  }

  const { name, price, image, description } = req.body
  const newCampground = {
    name: name,
    price: price,
    image: image,
    description: description,
    author: author,
  }

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
router.get('/new', middleware.isLoggedIn, (req, res) => {
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
      if (err || !foundCampground) {
        console.log(err)
        req.flash('error', 'Campground not found')
        res.redirect('back')
      } else {
        res.render('campgrounds/show', { campground: foundCampground })
      }
    })
})

// EDIT CAMPGROUND ROUTE (show form to edit...)
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err || !foundCampground) {
      console.log(err)
      req.flash('error', 'Campground not found')
      res.redirect('back')
    } else {
      res.render('campgrounds/edit', { campground: foundCampground })
    }
  })
})

// UPDATE CAMPGROUND ROUTE (edited form submitted here)
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
  // find and update the correct campground
  // redirect somewhere (usually the show page of the updated campground)
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
    if (err || !updatedCampground) {
      console.log(err)
      req.flash('error', 'Campground not found')
      res.redirect('back')
    } else {
      res.redirect('/campgrounds/' + req.params.id)
    }
  })
})

// DESTROY CAMPGROUND ROUTE
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      console.log(err)
      req.flash('error', err.message)
      res.redirect('back')
    } else {
      res.redirect('/campgrounds')
    }
  })
})

module.exports = router
