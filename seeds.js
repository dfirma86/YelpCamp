const mongoose = require('mongoose'),
  Campground = require('./models/campground'),
  Comment = require('./models/comment')

const data = [
  {
    name: "Cloud's Rest",
    image: 'https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg',
    description:
      'Jean shorts narwhal gentrify, kale chips hella air plant tumblr tofu sustainable meggings kinfolk succulents polaroid before they sold out. Succulents skateboard snackwave deep v XOXO bicycle rights fashion axe ugh authentic, vinyl food truck man braid PBR&B. Kitsch pok pok selvage twee taiyaki, normcore vexillologist asymmetrical next level forage. XOXO four loko offal forage tote bag bicycle rights bespoke. Celiac meh hexagon gochujang, snackwave iPhone ramps portland retro etsy drinking vinegar. Cliche skateboard deep v, typewriter tofu heirloom everyday carry kitsch man bun vegan roof party stumptown. Pok pok cliche prism flexitarian tbh vaporware jianbing crucifix squid austin affogato franzen lomo sartorial.',
  },
  {
    name: 'Desert Mesa',
    image: 'https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg',
    description:
      'Lorem ipsum dolor amet messenger bag hoodie butcher next level lyft crucifix taxidermy williamsburg church-key. Cornhole four loko neutra next level, bicycle rights trust fund banh mi unicorn fashion axe bespoke street art letterpress waistcoat copper mug pop-up. Leggings try-hard tbh, gochujang shaman tousled waistcoat mlkshk heirloom pinterest hoodie. Church-key four dollar toast pabst offal hammock. Gochujang fashion axe crucifix, mustache activated charcoal dreamcatcher farm-to-table flexitarian irony.',
  },
  {
    name: 'Canyon Floor',
    image: 'https://farm1.staticflickr.com/189/493046463_841a18169e.jpg',
    description:
      'Distillery dreamcatcher raw denim ennui kinfolk beard. Church-key letterpress ugh shaman af +1 cred dreamcatcher messenger bag godard taxidermy wolf skateboard. Lyft kitsch air plant, taiyaki helvetica kombucha lumbersexual franzen. Edison bulb you probably havent heard of them pabst jean shorts squid pitchfork tote bag banh mi, pok pok shabby chic DIY etsy art party whatever.',
  },
]

function seedDB() {
  //Remove all campgrounds
  Campground.deleteMany({}, (err) => {
    if (err) {
      console.log(err)
    } else {
      console.log('All campgrounds removed!')
      data.forEach((seed, i) => {
        Campground.create(seed, (err, campground) => {
          if (err) {
            console.log(err)
          } else {
            console.log(`${i + 1} Campgrounds added!`)
            // create a comment on each campground
            Comment.create(
              {
                text: 'This place is great, but I wish there was internet!',
                author: 'Homer',
              },
              (err, comment) => {
                if (err) {
                  console.log(err)
                } else {
                  campground.comments.push(comment)
                  campground.save()
                  console.log('New comment created!')
                }
              }
            )
          }
        })
      })
    }
  })
}

function seedDBORIGINAL() {
  //Remove all campgrounds
  Campground.remove({}, function(err) {
    if (err) {
      console.log(err)
    }
    console.log('removed campgrounds!')
    Comment.remove({}, function(err) {
      if (err) {
        console.log(err)
      }
      console.log('removed comments!')
      //add a few campgrounds
      data.forEach(function(seed) {
        Campground.create(seed, function(err, campground) {
          if (err) {
            console.log(err)
          } else {
            console.log('added a campground')
            //create a comment
            Comment.create(
              {
                text: 'This place is great, but I wish there was internet',
                author: 'Homer',
              },
              function(err, comment) {
                if (err) {
                  console.log(err)
                } else {
                  campground.comments.push(comment)
                  campground.save()
                  console.log('Created new comment')
                }
              }
            )
          }
        })
      })
    })
  })
  //add a few comments
}

module.exports = seedDB

// Campground.create(
//   {
//     name: 'Mountain Hill',
//     image:
//       'https://media-cdn.tripadvisor.com/media/photo-s/0f/cb/90/dd/family-friendly-camping.jpg',
//     description: 'This is a huge campground with no bathrooms.',
//   },
//   (err, campground) => {
//     if (err) {
//       console.log(err)
//     } else {
//       console.log(`Newly created campground: ${campground}`)
//     }
//   }
// )

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
