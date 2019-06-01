const express = require('express'),
  router = express.Router(),
  passport = require('passport'),
  User = require('../models/user')

// Root route
router.get('/', (req, res) => {
  res.send('This is the landing page')
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
      console.log(err)
      return res.render('register')
    }
    passport.authenticate('local')(req, res, () => {
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
  res.redirect('/campgrounds')
})

// Middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next()
  res.redirect('/login')
}

module.exports = router
