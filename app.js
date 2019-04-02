const express = require('express');
const port =  process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI;
const mongoose = require("mongoose");
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const connectOptions = {
  keepAlive: true, 
  reconnectTries: Number.MAX_VALUE
}

app.use(express.urlencoded());
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

// schema
require('./models/UrlShortener');
require("./routes/urlshorten") (app);

mongoose.Promise = global.Promise;
mongoose.connect(mongoURI, connectOptions, (err, db) => {
  if (err) console.log('error' + err);
  console.log('Connected to MongoDB');
});

// view engine
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index')
})

app.listen(port, () => {
  console.log('Server started on port ' + port);
})