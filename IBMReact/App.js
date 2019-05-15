import React from 'react';
import { Dimensions, StyleSheet, Text, View, TextInput } from 'react-native';
import { MapView } from 'expo';

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

class App extends React.Component {
  
  constructor(props) {
    super(props);
    // this.state = { 
    // };
  }

  render() {
        return (
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: 40.7128,
              longitude: -74.0060,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
        );
      }

}

export default App;


