import React from 'react';
import { Alert, StyleSheet, View, TextInput, Text, Button, TimePickerAndroid, DatePickerAndroid, Modal, TouchableOpacity } from 'react-native';
import { MapView } from 'expo';
import moment from 'moment';
import "../global.js"

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
    paddingLeft: 20,
    paddingRight: 20
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
      timeString: moment().format("h:mm A"),
      dateString: moment().format("MM/DD/YY"),
      radius: 500,
      isLoading: true,
      markers: [],
      loadedURL: null,
      visibleModal: false
    };
  }

  _onPressGo = () => {
    if (!((global.startCoords === null) || (this.state.timeString === null))) {
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
    else if (this.state.timeString === null) {
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

  _onPressDate = async () => {
    const {action, year, month, day} = await DatePickerAndroid.open({
      date: new Date(),
      minDate: new Date(),
      mode: 'calendar'
    });
    if (action !== DatePickerAndroid.dismissedAction) {
      this.setState({
        dateString: moment().year(year).month(month).day(day).format("MM/DD/YY")
      })
    }
    console.log("end of _onPressDate");
  }

  updateRadius = () => {
    let newRadius = this.state.radius;
    if (this.state.radius > 900) 
      newRadius = 100;
    else
      newRadius = this.state.radius + 100;
    this.setState({ 
      radius: newRadius
    })
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
                onPress={this._onPressDate}
              >
                <Text style={styles.buttonText}> {this.state.dateString} </Text>
              </TouchableOpacity> 
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={this._onPressTime}
              >
                <Text style={styles.buttonText}> {this.state.timeString} </Text>
              </TouchableOpacity> 
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={this.updateRadius}
              >
                <Text style={styles.buttonText}> Within {this.state.radius} meters </Text>
              </TouchableOpacity> 
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
          customMapStyle={global.mapStyle}
        >
          {this.renderMarkers()}
        </MapView>
      </View>
    );
  }

}

export default SearchScreen;