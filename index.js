// server/index.js

const express = require("express");
const path = require('path');
const bodyParser = require("body-parser")
require('dotenv').config();
const http = require('http');

const PORT = process.env.PORT || 3001;

const app = express();

const server = http.createServer(app);

// api for testing response
app.post("/api/testAPICall", async function(req, res) {
	console.log('api/testAPICall');
    //console.log(req);
    res.json({'message':'testAPICall called'});

	// return new theme or success message
});

app.get('/api/testSimple', async function(req, res) {
  console.log('simple API Test Called');
  res.json({'message': 'simple API called'});
})

app.get('*', (req, res)=> {
 // console.log(req);
  res.json({'message':'hello'})
})


server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});