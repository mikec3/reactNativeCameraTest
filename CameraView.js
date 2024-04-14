import { useEffect, useState } from 'react';
import { Camera, CameraType } from 'expo-camera';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

const CameraView = props => {


  // instantiate the camera
  let camera: Camera;

  // variable for camera front/back
  const [type, setType] = useState(CameraType.back);

  // stores if we have permission from device to use the camera
  const [permission, requestPermission] = Camera.useCameraPermissions();

    // do we have permission to use the camera?
  console.log('permission at startup: ' + permission);

    // if permission hasn't been granted, ask for it. Should really be checking for permission.granted at some point
  if (!permission) {
    requestPermission(Camera.requestCameraPermissionsAsync());
  }

      // toggle the camera (front or back)
  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  async function takePicture() {
    // tell the camera to store the base64 for images it takes
    const options = {base64: true}

    // take the photo
    const photo = await camera.takePictureAsync(options);

    // pass up the photo to the app.js for sending to api and displaying results
    props.processPicture(photo);
  }

  return (
    <Camera 
    // ratio="4:3"
     style={{
       height: props.height,
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
      );
}

export default CameraView;

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
    }
  });