import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import '../global.js';

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
            global.data = data;
            global.startLocation = data.description;
            global.briefLocation = data.structured_formatting.main_text;
            global.startCoords = details.geometry.location;
            const {navigate} = this.props.navigation;
            global.region = {
              latitude: details.geometry.location.latitude,
              longitude: details.geometry.location.longitude,
              latitudeDelta: global.latDelt,
              longitudeDelta: global.lonDelt,
            };
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