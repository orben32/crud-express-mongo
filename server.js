const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db

// Remember to change YOUR_USERNAME and YOUR_PASSWORD to your username and password! 
//MongoClient.connect('mongodb://comments-admin:qwer1234@ds047955.mongolab.com:47955/star-wars-quotes', (err, database) => {
MongoClient.connect('mongodb+srv://comments-admin:qwer1234@cluster0-sgcwv.mongodb.net/test?retryWrites=true&w=majority', (err, database) => {
  if (err) return console.log(err)
  db = database.db('sample_airbnb')
  app.listen(process.env.PORT || 3000, () => {
    console.log('listening on 3000')
  })
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('listingsAndReviews').find().limit(10).toArray((err, result) => {
    if (err) return console.log(err)
    res.send(result);
  })
})

app.post('/quotes', (req, res) => {
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/quotes', (req, res) => {
  db.collection('quotes')
  .findOneAndUpdate({name: 'Yoda'}, {
    $set: {
      name: req.body.name,
      quote: req.body.quote
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/quotes', (req, res) => {
  db.collection('quotes').findOneAndDelete({name: req.body.name}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('A darth vadar quote got deleted')
  })
})
