require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Require short unique id generator
const ShortUniqueId = require('short-unique-id');
// Instantiate
const uid = new ShortUniqueId({ length: 5 });

// Create a body-parser object function
const bodyParser = require('body-parser');
// Use body-parser to Parse POST Requests
app.use(bodyParser.urlencoded({extended: false}));

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

// Get Data from POST Requests using bodyparser
app.post("/api/shorturl", function(req, res) {
  res.json({ url: req.body.url });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
