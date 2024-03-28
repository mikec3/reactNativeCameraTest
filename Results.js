import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions,ImageBackground, Image } from 'react-native';

const Results = props => {

    let message = 'Hot dog or nah? Take a picture.';

    useEffect(()=> {
        console.log('result rendered');
    }, []);

  return (
    <View style={styles.container}>
        <Text style={styles.text}> {message} </Text>
    </View>
      );
}

export default Results;

const styles = StyleSheet.create({
  container: {
    marginTop: 70,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  text: {
    color: 'grey',
    fontSize: 20,
    fontWeight: 'bold'
  }
});