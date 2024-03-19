import { Camera, CameraType } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';

export default function App() {

  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  const {width} = useWindowDimensions();
  const height = Math.round((width*4)/3);

  console.log('permission at startup: ' + permission);

  // if permission hasn't been granted, ask for it. Should really be checking for permission.granted at some point
  if (!permission) {
    requestPermission(Camera.requestCameraPermissionsAsync());

    console.log('permission after requesting' + permission);
  }

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  return (
    <View style={styles.container}>
      <Camera 
        ratio="4:3"
        style={{
          height: height,
          width: "100%",
          justifyContent: 'flex-end'
        }} 
        type={type}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </Camera>
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
