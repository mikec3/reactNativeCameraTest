
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions, Image } from 'react-native';
import axios from 'axios'
import Results from './Results';
import ImagePreview from './ImagePreview'
import CameraView from './CameraView'


export default function App() {

  // results from api will update if we found a hot dog or not
  const [isHotDog, setIsHotDog] = useState(false);

  // is thinking to display while awaiting api response for photo analysis
  const [isThinking, setIsThinking] = useState(false);

  // let's us know if there is a preview to show instead of the active camera image
  const [previewVisible, setPreviewVisible] = useState(false);

  // store the image taken with the camera
  const [capturedImage, setCapturedImage] = useState(null);

  // get window width to use when determining camera display port size
  const {width} = useWindowDimensions();
  const height = Math.round((width*4)/3);

  // take the picture and send it to api
  async function processPicture(photo) {

    // store the photo and tell previewer that we can view the preview
    setCapturedImage(photo);
    setPreviewVisible(true);

   // send the base64 image to the server for analysis
    sendPicToAPI(photo);
  }

  // sends the taken photo to our api for analysis, will return a true/false for isHotDog
  async function sendPicToAPI(photo) {

    // isThinking is true, so that results window can show thinking while awaiting api response
    setIsThinking(true);
    
    // extract the base64 from the photo
    const source = photo.base64;

    if (source) {

      // contrsuct api call, pass base64 image in
      let base64Img = source;
      let apiUrl = 'http://192.168.4.25:3001/api/getPhotoResults';
      let data = JSON.stringify({
        file: base64Img
      });

      let config = {
        method: 'post',
        url: apiUrl,
        headers: {
          'Content-Type': 'application/json', 
          'Accept': 'application/json'
        },
        data : data
      }

      axios(config)
      .then((response) => {
        if (response.status == '200') {
          // do something with the response
          if (response.data.hotdog) {
            // hot dog found!
            setIsHotDog(true);
            setIsThinking(false);
          } else {
            // NOT hoddog! 
            setIsHotDog(false);
            setIsThinking(false);
          }
        } else {
          // error occurred.
        }
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }

  // resets the campturedImage to nothing so that the camera viewer will turn on
  function resetCamera() {
    setCapturedImage(null);
    setPreviewVisible(false);
    setIsHotDog(false);
    setIsThinking(false);
  }

  return (
    <View>
      <View style={{marginTop: 50}}>
        {previewVisible && capturedImage ? 
          <ImagePreview width={width} capturedImage={capturedImage}/>
        :
        <CameraView height={height} processPicture={processPicture}/>
        }
      </View>
      <View style={styles.resultsView}>
        {isThinking ?
          <View> 
            <Text style={styles.thinkingText}> Thinking... </Text>
          </View>
        : 
          <Results capturedImage={capturedImage} 
                    isHotDog={isHotDog}
                    resetCamera={resetCamera}/>
        }
      </View>
    </View>
      );
}

const styles = StyleSheet.create({
  resultsView: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '30%'
  },
  thinkingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'blue'
  }
});