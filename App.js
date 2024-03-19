import { Camera, CameraType } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions,ImageBackground, Image } from 'react-native';

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

    console.log(photo);
  }

  return (
    <View style={styles.container}>
      {previewVisible && capturedImage ? 
      <View style={{
          flex: 1,
          backgroundColor: 'transparent',
          alignItems: 'center',
          width: '100%',
          height: '100%'}}>
        <ImageBackground 
        style={{ 
          flex:1,
          height: height,
          width: '100%'
          }} source={{uri: capturedImage.uri}}/>
      </View>
      :
      <Camera 
        ratio="4:3"
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
      );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50
  },
  camera: {
    width: '100%',
    height: '65%',
    justifyContent: 'flex-end'
  },
  buttonContainer: {

  },
  button: {
    alignItems: 'center',
    marginBottom: 50
  },
  text: {
    color: 'white',
    fontWeight: 'bold'
  }
});
