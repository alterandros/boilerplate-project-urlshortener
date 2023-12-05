require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Require short unique id generator
const ShortUniqueId = require('short-unique-id');
// Instantiate
const uid = new ShortUniqueId({ length: 5 });

// import dns and url module to check url validity
const dns = require("dns");
const URL = require('url').URL;

// Middleware to encode the post request
app.use(express.urlencoded({extended: false}));

// Add mongoose
const mongoose = require('mongoose');

// Connect to database
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Define Schema
const urlSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  shortUrl: {
      type: String,
      required: true
    }
});

// Create model and assign it to url variable
const Url = mongoose.model('url', urlSchema);

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// Function to check if url is valid format
function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

// Get Data from POST Requests
app.post('/api/shorturl', (req, res) => {
  // Get only hostname to check with dns
  const originalURL = req.body.url;
  // Check is url is valid
  if (isValidURL(originalURL)) {
    const urlObject = new URL(originalURL);
    dns.lookup(urlObject.hostname, (err, address, family) => {
      // If url is invalid then...
      if (err) {
        res.json({ error:	"Invalid URL" });
      } else {
        // If url is valid then...
        Url.create({ url: originalURL, shortUrl: uid.rnd() }, function(err, data) {
        if (err) return console.log(err);
        res.json({original_url: data.url, short_url: data.shortUrl});
        });
      };
    });
  } else {
    res.json({ error:	"Invalid URL" });
  };
});

// Redirect user if short url is used
app.get('/api/shorturl/:shortUrl', async (req, res) => {
  const short_url = await Url.findOne({ shortUrl: req.params.shortUrl });
  if (short_url == null) res.sendStatus(404);
  res.redirect(short_url.url);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
