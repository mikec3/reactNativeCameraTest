import { useEffect, useState } from 'react';
import { ImageBackground, View } from 'react-native';

const ImagePreview = props => {

  return (
    <View>
        <ImageBackground 
            style={{ 
            height: props.width,
            width: '100%'
            }} 
            source={{uri: props.capturedImage.uri}}/>
    </View>
      );
}

export default ImagePreview;