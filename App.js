import { Camera, CameraType } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions,ImageBackground, Image } from 'react-native';
import axios from 'axios'
import Results from './Results';
//import { readFile } from 'react-native-fs'; // this gives errors
import FileSystem from "expo-file-system" // using expo file system instead of react-native


export default function App() {

  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  const [isHotDog, setIsHotDog] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const [previewVisible, setPreviewVisible] = useState(false);

  const [capturedImage, setCapturedImage] = useState(null);

  const {width} = useWindowDimensions();
  const height = Math.round((width*4)/3);

  let camera: Camera;



  console.log('permission at startup: ' + permission);

  // if permission hasn't been granted, ask for it. Should really be checking for permission.granted at some point
  if (!permission) {
    requestPermission(Camera.requestCameraPermissionsAsync());

    console.log('permission after requesting' + permission);
  }

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  async function takePicture() {
    console.log('take picture');
    const options = {base64: true}
    const photo = await camera.takePictureAsync(options);

    setCapturedImage(photo);
    setPreviewVisible(true);

   // send the base64 image to the server for analysis
    sendPicToAPI(photo);

    console.log(photo.uri);
  }

  async function sendPicToAPI(photo) {
    console.log('image?');
    setIsThinking(true);
    
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
            setIsHotDog(true);
            setIsThinking(false);
          } else {
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
        <View>
          <ImageBackground 
          style={{ 
            height: height,
            width: '100%',
            // borderColor: 'green',
            // borderWidth: 2
            }} source={{uri: capturedImage.uri}}/>
        </View>
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
  // camera: {
  //   width: '100%',
  //   height: '65%',
  //   justifyContent: 'flex-end'
  // },
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

  resultsButton: {
    alignItems: 'center',
    marginBottom: 25,
    borderColor: 'blue',
    borderWidth: 1,
    width: '50%',
    borderRadius: 10
  },
  thinkingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'blue'
  }
});


{/* <View style={{alignItems: 'center'}}>
<Results/>
{previewVisible && capturedImage ? 
<TouchableOpacity style={styles.resultsButton} onPress={resetCamera}>
        <Text> Try Again </Text>
        <Text style={styles.resultsText}> {isHotDog} </Text>
</TouchableOpacity> : <></>
}
</View> */}