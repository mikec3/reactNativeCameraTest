// server/index.js

const express = require("express");
const path = require('path');
const bodyParser = require("body-parser")
require('dotenv').config();
const http = require('http');
const vision = require('@google-cloud/vision');

const PORT = process.env.PORT || 3001;

const app = express();

const server = http.createServer(app);

// using this for reading API posts - expanded the allowable limit for pictures
app.use(bodyParser.json({limit: '200mb'}))

// api for testing response
app.post("/api/getPhotoResults", async function(req, res) {

       // store the result labels as an array to then get passed into a isHotDog() function
       let resultLabels = [];

       // Creates a client
       const client = new vision.ImageAnnotatorClient();

       // construct the label detection request parameters
       // sends the base64 image into the api request
       const labelDetectionParams = {
        "image": {
          "content": req.body.file
        }
       }
      // Performs label detection on the image file
      const [result] = await client.labelDetection(labelDetectionParams);
      const labels = result.labelAnnotations;
      // console.log(result);
      console.log(labels);
      console.log('Labels:');
      // looop through the result labels and add each description to an array
      labels.forEach(label => {
        resultLabels.push(label.description);
    });
      console.log(resultLabels);
      
      let isHotDog = checkForHotDog(resultLabels);  // Look for hot dog in labels
      console.log("Is it a hot dog?: " + isHotDog);

    res.json({'hotdog': isHotDog});

	// return new theme or success message
});

function checkForHotDog(labels){

	let isHotDog = false;

	const validAnswers = [
	'hot dog'
	, 'sausage'
	, 'brautwurst'
	, 'chili dog'
	, 'kielbasa'
	, 'knackwurst'
	, 'mettwurst',
	, 'diot'
	, 'saveloy'
	, 'kaszanka'
	, 'bockwurst'
	]

	// loop through labels to find any terms that sound like a hot dog
	labels.forEach(label => {
		if (!isHotDog) {  // only do the work if it's not a hot dog yet, otherwise it's already a dog
			// loop through all the valid answers for each label
			validAnswers.forEach(validAnswer => {
				if (label.toLowerCase() == validAnswer) {
					isHotDog = true;
					return;
				}
			})
		}
	});

	return isHotDog;
}

app.get('*', (req, res)=> {
 // console.log(req);
  res.json({'message':'hello'})
})


server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});