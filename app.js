const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true })
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

// SCHEMA SETUP
const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
})

const Campground = mongoose.model('Campground', campgroundSchema)

// Campground.create({
//   name: 'Mountain Hill',
//   image: 'https://media-cdn.tripadvisor.com/media/photo-s/0f/cb/90/dd/family-friendly-camping.jpg',
//   description: "This is a huge campground with no bathrooms."
// }, (err, campground) => {
//   if (err) {
//     console.log(err)
//   } else {
//     console.log(`Newly created campground: ${campground}`)
//   }
// })

// const campgrounds = [
//   { name: 'Salmon Creek', image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60' },
//   { name: 'Mountain Hill', image: 'https://media-cdn.tripadvisor.com/media/photo-s/0f/cb/90/dd/family-friendly-camping.jpg' },
//   { name: 'Hellyer Park', image: 'http://shop.mooredeals.com/wp-content/uploads/sites/47/2018/06/Camping-e1527869407566.jpg' },
//   { name: 'Secret River', image: 'https://cdn.muenchen-p.de/.imaging/stk/responsive/image980/dms/lhm/tourismus/camping-l/document/camping-l.jpg' },
//   { name: 'Silent Trees', image: 'https://www.camping.hr/cmsmedia/katalog/724/140-camp-turist-indian-tents.jpg' },
//   { name: 'Lake Kamach', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIri6KV08hjiS7VYhTonBAN3I5VscAlQY1nIC1e0T0AWifi7RlyA' },
//   { name: 'Mt. Rasario', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAJn9ALzxgCpW3z-dNC5YasQbLWoKidby7uK5xLE36jnKNeAPWEg' },
//   { name: 'Twin Trees', image: 'https://static1.squarespace.com/static/56c14e2307eaa0ed26a63daf/t/59f41eb971c10b247dcdad54/1509170884398/Fall+and+winter+camping+-+Pacific+North+Wanderers.jpg' },
//   { name: 'Beatle Path', image: 'https://pokenstoke.com/wp-content/uploads/2018/11/camping-sunset.jpg' },
//   { name: 'Twilight Row', image: 'https://www.visitbend.com/wp-content/uploads/2018/04/camping-bend-oregon-1600x900.jpg' },
//   { name: 'Greedy Meadows', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRObaqL8AP_FUaOrc97GcQdVLNQ9625hcjkocYWJbfmsulFKIsV' },
//   { name: 'Silver Star', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9sDgOVrA-470eKq_ns7xV3WefYLbUq_122coYRcEzlHs4F_5Yww' },
// ]

app.get('/', (req, res) => {
  res.render('landing')
})

// INDEX - Show all campgrounds
app.get('/campgrounds', (req, res) => {
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err)
    } else {
      res.render('index', { campgrounds: allCampgrounds })
    }
  })
})

// CREATE - Add new campground to DB
app.post('/campgrounds', (req, res) => {
  // const name = req.body.name
  // const image = req.body.image
  // const desc = req.body.description
  // const newCampground = { name: name, image: image, description: desc }

  const { name, image, description } = req.body
  const newCampground = { name: name, image: image, description: description }

  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) {
      console.log(err)
    } else {
      res.redirect('/campgrounds')
    }
  })
})

// NEW - show form to create new campground
app.get('/campgrounds/new', (req, res) => {
  // find the campground with provided ID
  // render show template with that campground
  res.render('new.ejs')
})

// SHOW - shows more info about one campground
app.get('/campgrounds/:id', (req, res) => {
  const { id } = req.params

  Campground.findById(id, (err, foundCampground) => {
    if (err) {
      console.log(err)
    } else {
      res.render('show', { campground: foundCampground })
    }
  })
})

app.listen(process.env.PORT, process.env.IP, () => console.log(`YelpCamp served up...`))
