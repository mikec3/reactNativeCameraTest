import { Camera, CameraType } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions,ImageBackground, Image } from 'react-native';
import axios from 'axios'
import Results from './Results';
import ImagePreview from './ImagePreview'


export default function App() {

  // variable for camera front/back
  const [type, setType] = useState(CameraType.back);

  // stores if we have permission from device to use the camera
  const [permission, requestPermission] = Camera.useCameraPermissions();

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

  // instantiate the camera
  let camera: Camera;


  // do we have permission to use the camera?
  console.log('permission at startup: ' + permission);

  // if permission hasn't been granted, ask for it. Should really be checking for permission.granted at some point
  if (!permission) {
    requestPermission(Camera.requestCameraPermissionsAsync());

    console.log('permission after requesting' + permission);
  }

  // toggle the camera (front or back)
  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  // take the picture and send it to api
  async function takePicture() {
    console.log('take picture');

    // tell the camera to store the base64 for images it takes
    const options = {base64: true}

    // take the photo
    const photo = await camera.takePictureAsync(options);

    // store the photo and tell previewer that we can view the preview
    setCapturedImage(photo);
    setPreviewVisible(true);

   // send the base64 image to the server for analysis
    sendPicToAPI(photo);

    // print the local file system uri of the photo
    console.log(photo.uri);
  }

  // sends the taken photo to our api for analysis, will return a true/false for isHotDog
  async function sendPicToAPI(photo) {
    console.log('image?');

    // isThinking is true, so that results window can show thinking while awaiting api response
    setIsThinking(true);
    
    // extract the base64 from the photo
    const source = photo.base64;

    if (source) {

      // contrsuct api call, pass base64 image in
      let base64Img = source;
      let apiUrl = 'http://192.168.4.25:3001/api/testAPICall';
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
        console.log(JSON.stringify(response.data))
        if (response.data != 'error') {
          // do something with the response
          console.log(response.data)
          console.log(response.status);
          console.log('is hotdog?: ' + response.data.hotdog);
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
        <Camera 
         // ratio="4:3"
          style={{
            height: height,
            width: "100%",
            justifyContent: 'flex-end'
          }} 
          type={type}
          ref={(r)=> {
            camera = r
          }}
          >
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                <Text> </Text>
            </TouchableOpacity>
          </View>
        </Camera>
        }
      </View>
      <View style={{alignItems: 'center', justifyContent: 'center', height: '30%'}}>
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
  buttonContainer: {
    alignItems: 'center'
  },
  button: {
    alignItems: 'center',
    marginBottom: 25,
    borderColor: 'white',
    borderWidth: 1,
    width: '30%',
    borderRadius: 10
  },
  captureButton: {
    height: 70,
    width: 70,
    marginBottom: 10,
    borderRadius: 100,
    border: 'black',
    borderWidth: 2,
    backgroundColor: 'white'
  },  
  text: {
    color: 'white',
    fontWeight: 'bold'
  },
  thinkingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'blue'
  }
});