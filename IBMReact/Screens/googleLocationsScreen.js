import React from 'react';
import { Alert, StyleSheet, View, TextInput, Text, Button, TimePickerAndroid, FlatList } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import { List, ListItem } from 'react-native-elements'

import '../global.js';
import Map from '../Components/map.js';
import Search from '../Components/search.js';

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "stretch",
    alignContent: "stretch",
    height: "100%",
  },
  notificationBar: {
    backgroundColor: "black",
    padding: 15
  },
  directionsContainer: {
    backgroundColor: "black",
    paddingBottom: 5,
    flexDirection: "row"
  },
  searchContainer: {
    flex: 1
  },
  calloutSearch: {
    margin: 5,
    borderColor: "black",
    borderRadius: 5,
    backgroundColor: "white"
  },
  headline: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: "#FF1493",
    fontSize: 18,
    marginTop: 0,
    width: 200,
    backgroundColor: 'black',
  }
});

class GoogleLocationsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      displayLocation: "",
      locationCoords: ""
    };
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.notificationBar}></View>
        <GooglePlacesAutocomplete
          placeholder='Search Pickup Location'
          minLength={2}
          autoFocus={true}
          returnKeyType={'search'}
          listViewDisplayed={false}
          fetchDetails={true}
          onPress={(data, details = null) => { 
            console.log(JSON.stringify(data))
            global.startLocation = data.description;
            global.startCoords = details.geometry.location;
            const {navigate} = this.props.navigation;
            navigate('Search', { location: this.state.displayLocation });
            }
          }
          query= {{
            key: "AIzaSyAEtt0A-9cN4MEfTP_383SJHuobDHGSVZ8",
            language: 'en'
          }}
          nearbyPlacesAPI='GooglePlacesSearch'
          debounce={200}
          styles={{
            textInputContainer: {
              // backgroundColor: 'rgba(0,0,0,0)', //These two don't seem to do anything
              // color: 'rgba(0,0,0,0)',
              borderTopWidth: 0,
              borderBottomWidth:0
            },
            textInput: {
              marginLeft: 0,
              marginRight: 0,
              height: 38,
              color: "#FF1493",
              fontSize: 16
            },
            predefinedPlacesDescription: {
              color: '#ff69b4'
            },
          }}
        /> 
      </View> 
    )
  }
}

export default GoogleLocationsScreen;