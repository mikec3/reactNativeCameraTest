import { Camera, CameraType } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions,ImageBackground, Image } from 'react-native';
import axios from 'axios'
import Results from './Results';

export default function App() {

  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();

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
    const photo = await camera.takePictureAsync();

    setCapturedImage(photo);
    setPreviewVisible(true);

    getPictureResults(photo);

    console.log(photo);
  }

  async function getPictureResults(photo) {
   // e.preventDefault(); // prevent page re-load
		let data = JSON.stringify({
			"photo": photo
		})

		let config = {
			method : 'post',
			url: 'http://192.168.4.25:3001/api/testAPICall',
			headers: {
				    'Content-Type': 'application/json', 
    				'Accept': 'application/json'
			},
			data : data
		};

		axios(config)
		.then((response) => {
			console.log(JSON.stringify(response.data))
			if (response.data != 'error') {
        // do something with the response
			} else {
        // error occurred.
			}
		})
		.catch((error) => {
  		console.log(error);
		});
  }

  function resetCamera() {
    setCapturedImage(null);
    setPreviewVisible(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
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
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <Text style={styles.text}>Take Picture</Text>
            </TouchableOpacity>
          </View>
        </Camera>
        }
      </View>
      <View style={{alignItems: 'center'}}>
        <Results/>
        {previewVisible && capturedImage ? 
        <TouchableOpacity style={styles.button} onPress={resetCamera}>
                <Text> Try Again </Text>
        </TouchableOpacity> : <></>}
      </View>
    </View>
      );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    // borderColor: 'blue',
    // borderWidth: 2
  },
  imageContainer: {
    justifyContent: 'flex-start',
    paddingTop: 50,
    // borderColor: 'red',
    // borderWidth: 1
  },
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
  text: {
    color: 'white',
    fontWeight: 'bold'
  }
});
