const express = require('express'),
  router = express.Router(),
  passport = require('passport'),
  User = require('../models/user')

// Root route
router.get('/', (req, res) => {
  res.render('landing')
})

// Show registration form
router.get('/register', (req, res) => {
  res.render('register')
})

// Handles Sign Up logic
router.post('/register', (req, res) => {
  const { username, password } = req.body
  const newUser = new User({ username: username })
  User.register(newUser, password, (err, user) => {
    if (err) {
      req.flash('error', err.message)
      return res.redirect('register')
    }
    passport.authenticate('local')(req, res, () => {
      req.flash('success', `Welcome to YelpCamp ${username}`)
      res.redirect('/campgrounds')
    })
  })
})

// Show Login form
router.get('/login', (req, res) => {
  res.render('login')
})

// Hanldes Login form logic
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login',
  }),
  (req, res) => {}
)

// Logout route
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success', 'Logged you out!')
  res.redirect('/campgrounds')
})

module.exports = router
