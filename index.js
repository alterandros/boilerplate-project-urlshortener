require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Create a body-parser object function
let bodyParser = require('body-parser');
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

let url;

// Create model and assign it to url variable
url = mongoose.model('url', urlSchema);

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



app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
