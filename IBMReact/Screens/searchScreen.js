import React from 'react';
import { Alert, StyleSheet, View, TextInput, Text, Button, TimePickerAndroid, TouchableOpacity } from 'react-native';
import { MapView } from 'expo';
import moment from 'moment';

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
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center"
  },
  calloutSearch: {
    margin: 5,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "black",
    paddingLeft: 10,
    fontWeight: "bold"
  },
  buttonStyle: {
    color: "black",
    borderColor: "white",
    borderWidth: 1,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 35,
    paddingRight: 35
  },
  buttonText: {
    color: "white",
    fontWeight: "bold"
  },
  mapFlex: {
    display: "flex",
    height: "100%"
  }
});

var mapStyle = [
  {
      "featureType": "all",
      "elementType": "all",
      "stylers": [
          {
              "color": "#c180a2"
          }
      ]
  },
  {
      "featureType": "all",
      "elementType": "labels",
      "stylers": [
          {
              "visibility": "on"
          }
      ]
  },
  {
      "featureType": "all",
      "elementType": "labels.text.fill",
      "stylers": [
          {
              "saturation": 36
          },
          {
              "color": "#a4a3a3"
          },
          {
              "lightness": 40
          }
      ]
  },
  {
      "featureType": "all",
      "elementType": "labels.text.stroke",
      "stylers": [
          {
              "visibility": "on"
          },
          {
              "color": "#3d2e2e"
          },
          {
              "lightness": 16
          }
      ]
  },
  {
      "featureType": "all",
      "elementType": "labels.icon",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "administrative",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "color": "#000000"
          },
          {
              "lightness": 20
          }
      ]
  },
  {
      "featureType": "administrative",
      "elementType": "geometry.stroke",
      "stylers": [
          {
              "color": "#000000"
          },
          {
              "lightness": 17
          },
          {
              "weight": 1.2
          }
      ]
  },
  {
      "featureType": "administrative.country",
      "elementType": "labels.text.fill",
      "stylers": [
          {
              "color": "#e2dfdf"
          }
      ]
  },
  {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [
          {
              "color": "#ffffff"
          }
      ]
  },
  {
      "featureType": "administrative.neighborhood",
      "elementType": "labels.text.fill",
      "stylers": [
          {
              "color": "#d1d0d1"
          }
      ]
  },
  {
      "featureType": "administrative.neighborhood",
      "elementType": "labels.text.stroke",
      "stylers": [
          {
              "visibility": "on"
          },
          {
              "hue": "#ff0000"
          }
      ]
  },
  {
      "featureType": "landscape",
      "elementType": "geometry",
      "stylers": [
          {
              "color": "#000000"
          },
          {
              "lightness": 20
          }
      ]
  },
  {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
          {
              "color": "#000000"
          },
          {
              "lightness": 21
          },
          {
              "visibility": "on"
          }
      ]
  },
  {
      "featureType": "poi.business",
      "elementType": "geometry",
      "stylers": [
          {
              "visibility": "on"
          }
      ]
  },
  {
      "featureType": "road.highway",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "color": "#e605c1"
          },
          {
              "saturation": "-17"
          },
          {
              "lightness": "-10"
          }
      ]
  },
  {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "road.highway",
      "elementType": "labels.text",
      "stylers": [
          {
              "color": "#ffffff"
          }
      ]
  },
  {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
          {
              "color": "#dcdcdc"
          }
      ]
  },
  {
      "featureType": "road.highway",
      "elementType": "labels.text.stroke",
      "stylers": [
          {
              "color": "#565256"
          }
      ]
  },
  {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
          {
              "color": "#000000"
          },
          {
              "lightness": 18
          }
      ]
  },
  {
      "featureType": "road.arterial",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "color": "#ac1b6a"
          }
      ]
  },
  {
      "featureType": "road.arterial",
      "elementType": "labels.text.fill",
      "stylers": [
          {
              "color": "#d8d8d8"
          }
      ]
  },
  {
      "featureType": "road.arterial",
      "elementType": "labels.text.stroke",
      "stylers": [
          {
              "color": "#696969"
          }
      ]
  },
  {
      "featureType": "road.local",
      "elementType": "geometry",
      "stylers": [
          {
              "color": "#64646c"
          },
          {
              "lightness": 16
          }
      ]
  },
  {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
          {
              "color": "#d8d8d8"
          }
      ]
  },
  {
      "featureType": "transit",
      "elementType": "geometry",
      "stylers": [
          {
              "color": "#000000"
          },
          {
              "lightness": 19
          }
      ]
  },
  {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
          {
              "color": "#252525"
          },
          {
              "lightness": 17
          }
      ]
  }
]

let region = {
  latitude: 40.7128,
  longitude: -74.0060,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

// var serverURL = 'https://feeds.citibikenyc.com/stations/stations.json'
var staticServerURL = "http://192.168.0.8:5000/predict";

function addParameterToURL(_url, param){
  _url += (_url.split('?')[1] ? '&':'?') + param;
  return _url;
}

class SearchScreen extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = { 
      displayMarkers: false,
      timeHour: 12,
      timeMinute: 0,
      startText: "Enter Pickup Location",
      timeString: "Choose Departure Time", //moment().format("h:mm A"),
      isLoading: true,
      markers: [],
      loadedURL: null
    };
  }

  _onPressGo = () => {
    if (!((global.startCoords === null) || (global.timeHour === null))) {
      this.setState({ 
        displayMarkers: true
      })
      const {navigate} = this.props.navigation;
      navigate('Results')
    } else if (global.startCoords === null) {
      Alert.alert(
        'Wait a minute...',
        'We don\'t know where you\'re leaving from.',
        [
          {text: 'Go back', onPress: () => console.log('Go back was pressed'), style: 'cancel'},
          {text: 'Take me there', onPress: () => {
            const {navigate} = this.props.navigation;
            navigate('GoogleLocations')
          }} 
        ],
        {cancelable: false},
      );
    }
    else if (global.timeHour === null) {
      Alert.alert(
        'Wait a minute...',
        'We don\'t know when you want to leave.',
        [
          {text: 'Go back', onPress: () => console.log('Go back was pressed'), style: 'cancel'},
          {text: 'Take me there', onPress: this._onPressTime } 
        ],
        {cancelable: false},
      );
    }
  }

  _onPressTime = async () => {
    const {action, hour, minute} = await TimePickerAndroid.open({
      hour:  new Date().getHours(),
      minute: new Date().getMinutes(),
      is24Hour: false
    });
    if (action !== TimePickerAndroid.dismissedAction) {
      global.timeHour = hour;
      global.timeMinute = minute;
      this.setState({
        timeHour: hour,
        timeMinute: minute,
        timeString: moment().hour(hour).minute(minute).format("h:mm A")
      })
      // global.timeHour = hour,
      // global.timeMinute = minute,
      // global.timeString = "Leaving at " + String(hour % 12) + ":" 
      // + ((minute < 10) ? "0" + String(minute) : String(minute)) 
      // + ((hour > 12) ? " pm" : " am")
    }
    console.log("end of _onPressTime");
  }

  _onStartFocus = () => {
    const {navigate} = this.props.navigation;
    navigate('GoogleLocations')
  } 

  renderMarkers() { 
    if ( !this.state.displayMarkers ) return null;
    this.fetchData();
    console.log(this.state.markers)
    return this.state.isLoading
      ? null
      : this.state.markers.map((marker, index) => {
          const coords = {
            latitude: marker.lat,
            longitude: marker.lon,
          };

          const metadata = `Status: ${marker.statusValue}`;

          console.log(coords)
          return (
            <MapView.Marker
              key={index} 
              coordinate={coords}
            //   title={marker.stationName}
            //   description={metadata}
              pinColor={'teal'}
            />
          );
        });
  }

  fetchData() {
    var requestURL = staticServerURL;
    requestURL = addParameterToURL(requestURL, 'lat=' + String(global.startCoords.lat));
    requestURL = addParameterToURL(requestURL, 'lon=' + String(global.startCoords.lng));
    // requestURL = addParameterToURL(requestURL, 'lat=40.749021');
    // requestURL = addParameterToURL(requestURL, 'lon=-73.912705');
    requestURL = addParameterToURL(requestURL, 'radius=1000');
    requestURL = addParameterToURL(requestURL, 'day=4');
    requestURL = addParameterToURL(requestURL, 'month=6');
    requestURL = addParameterToURL(requestURL, 'hour=' + String(global.timeHour));
    requestURL = addParameterToURL(requestURL, 'minute=' + String(global.timeMinute));
    // requestURL = addParameterToURL(requestURL, 'hour=10');
    // requestURL = addParameterToURL(requestURL, 'minute=30');
    requestURL = addParameterToURL(requestURL, 'nrows=20');

    console.log(requestURL);
    if (!(this.state.loadedURL === null) || requestURL === this.state.loadedURL) { return; }
    console.log("fetching")

    fetch(requestURL, {method: 'GET'})
      .then((response) => response.json())
      .then((responseJson) => { 
        this.setState({ 
          isLoading: false,
          markers: responseJson, 
          loadedURL: requestURL
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.notificationBar}></View> 
        <View style={styles.directionsContainer}>
          <View style={styles.searchContainer}>
            <TextInput style={styles.calloutSearch}
              placeholder={global.startLocation}
              placeholderTextColor={"white"}
              onFocus={this._onStartFocus}
            />
            <View style={styles.filterContainer}>
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={this._onPressTime}
              >
                <Text style={styles.buttonText}> Date </Text>
              </TouchableOpacity> 
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={this._onPressTime}
              >
                <Text style={styles.buttonText}> Time </Text>
              </TouchableOpacity> 
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={this._onPressTime}
              >
                <Text style={styles.buttonText}> Radius </Text>
              </TouchableOpacity> 
                {/* onPress={this._onPressTime}
                title={this.state.timeString}
                color="black"
              /> */}
              {/* <Button 
                onPress={this._onPressTime}
                title={"Time"}
                color="black"
              />
              <Button 
                onPress={this._onPressTime}
                title={"Radius"}
                color="black"
              /> */}
            </View>
          </View>
        </View>
          <Button
            onPress={this._onPressGo}
            title="Go!"
            color="#FF1493"
            accessibilityLabel="Start your search"
          />
          <MapView
          style={styles.mapFlex}
          provder="google"
          initialRegion={region}
          customMapStyle={mapStyle}
        >
          {this.renderMarkers()}
        </MapView>
      </View>
    );
  }

}

export default SearchScreen;