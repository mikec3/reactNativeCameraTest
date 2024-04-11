import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Results = props => {

    // store the results
    const [isHotDog, setIsHotDog] = useState();

    // create the results jsx fragment
    useEffect(()=> {
        if (props.isHotDog) {
            setIsHotDog(<View style={styles.hotDog}><Text style={styles.dogText}> Hotdog!</Text></View>)
        } else {
            setIsHotDog(<View style={styles.noHotdog}><Text style={styles.dogText}>Not Hotdog!</Text></View>)
        }
    }, []);

  return (
    <View style={styles.container}>
        {props.capturedImage ? 
            <View style={{alignItems: 'center'}}>
                {isHotDog}
                <TouchableOpacity style={styles.resultsButton} onPress={props.resetCamera}>
                    <Text style={styles.text}> Another! </Text>
                </TouchableOpacity> 
            </View>
        :
            <View style={{alignItems: 'center'}}>
                <Text style={styles.promptText}> Hotdog / Not Hotdog</Text>
            </View>
        }
    </View>
      );
}

export default Results;

const styles = StyleSheet.create({
  container: {
    marginTop: 70,
    marginBottom: 30,
    width: '100%'
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  },
  resultsButton: {
    alignItems: 'center',
    marginTop: 25,
    backgroundColor: 'blue',
    borderColor: 'blue',
    borderWidth: 3,
    width: '50%',
    borderRadius: 10,
  },
  noHotdog : {
    height: 100,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
   // width: '100%',
    backgroundColor: 'red'
  },

  hotDog: {
    height: 100,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green'
  },

  dogText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 40
  },
  promptText: {
    fontSize: 20,
    fontWeight: 'bold'
  }
});