import React from 'react';
import { Alert, StyleSheet, View, TextInput, Text, Button, TimePickerAndroid, DatePickerAndroid, ActivityIndicator, TouchableOpacity } from 'react-native';
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



var staticServerURL = "http://1b64ded1.ngrok.io/predict";
var testServerURL = "http://1b64ded1.ngrok.io/predict?lat=40.6447&lon=-73.7824&radius=100&nrows=10&day_week=5&day_month=25&hour_start=0&minute_start=22&hour_end=16&minute_end=22"

function addParameterToURL(_url, param){
  _url += (_url.split('?')[1] ? '&':'?') + param;
  return _url;
}

class SearchScreen extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = { 
      displayMarkers: false,
      timeHour: moment().hour(),
      timeMinute: moment().minute(),
      endTimeHour: moment().hour() + 1,
      endTimeMinute: moment().minute(),
      startText: "Enter Pickup Location",
      timeString: moment().format("h:mm A"),
      dateString: moment().format("MM/DD/YY"),
      radius: 200,
      isLoading: true,
      markers: [],
      loadedURL: null,
      visibleModal: false,
      serverResponse: null,
      startMarker: null,
      dateMonth: moment().month(),
      dateDay: moment().day(),
      region: {
        latitude: 40.7128,
        longitude: -74.0060,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      dow: moment().weekday() - 1,
    };
  }

  _onPressGo = async () => {
    if (!((global.startCoords === null) || (this.state.timeString === null))) {
      this.setState({
        fetching: true
      })
      var myVar = await this.fetchData();
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
    } 
    const {action2, hour2, minute2} = await TimePickerAndroid.open({
      hour2:  new Date().getHours(),
      minute2: new Date().getMinutes(),
      is24Hour: false
    });
    if (action2 !== TimePickerAndroid.dismissedAction && hour2 >= hour) {
      global.endTimeHour = hour2;
      global.endTimeMinute = minute2;
      this.setState({
        timeHourEnd: hour,
        timeMinuteEnd: minute,
      })
    } 
    console.log("end of _onPressTime");
  }

  _onPressDate = async () => {
    const {action, year, month, day} = await DatePickerAndroid.open({
      date: new Date(),
      minDate: new Date(),
      mode: 'calendar',
    });
    if (action !== DatePickerAndroid.dismissedAction) {
      this.setState({
        dateString: moment().year(year).month(month).day(day).format("MM/DD/YY"),
        dateMonth: month,
        dateDay: day,
        dow: moment().year(year).month(month).day(day).weekday() - 1,
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

    return this.state.isLoading
      ? null
      : this.state.markers.map((marker, index) => {
          const coords = {
            latitude: marker.lat,
            longitude: marker.lon,
          };

          console.log("marker: " + String(marker))

          console.log(coords)
          return (
            <MapView.Marker
              key={index} 
              coordinate={coords}
              title={String(marker.name)}
              description={"Score: " + String(marker.rating)}
              pinColor={'teal'}
            />
          );
        });
  }

  fetchData() {
    var requestURL = staticServerURL;
    requestURL = addParameterToURL(requestURL, 'lat=' + String(global.startCoords.lat));
    requestURL = addParameterToURL(requestURL, 'lon=' + String(global.startCoords.lng));
    requestURL = addParameterToURL(requestURL, 'radius=' + String(this.state.radius));
    requestURL = addParameterToURL(requestURL, 'day_month=' + String(this.state.dateDay));
    requestURL = addParameterToURL(requestURL, 'day_week=' + String(this.state.dow));
    requestURL = addParameterToURL(requestURL, 'hour_start=' + String(this.state.timeHour));
    requestURL = addParameterToURL(requestURL, 'minute_start=' + String(this.state.timeMinute));
    requestURL = addParameterToURL(requestURL, 'hour_end=' + String(this.state.timeHour+1));
    requestURL = addParameterToURL(requestURL, 'minute_end=' + String(this.state.timeMinute));
    requestURL = addParameterToURL(requestURL, 'nrows=7');
    requestURL = addParameterToURL(requestURL, 'reverse=true');

    //for testing 
    // requestURL = testServerURL;

    console.log(requestURL);
    //if (!(this.state.loadedURL === null) || requestURL === this.state.loadedURL) { return; }
    console.log("fetching")

    fetch(requestURL, {method: 'GET'})
      .then((response) => response.json())
      .then((responseJson) => { 
        this.setState({ 
          isLoading: false,
          serverResponse: responseJson, 
          markers: responseJson.suggestions, 
          startMarker: responseJson.start,
          loadedURL: requestURL,
        });
        global.data = responseJson.suggestions;
        console.log("the suggestions " + JSON.stringify(responseJson.suggestions));
        this.setState({ 
          displayMarkers: true,
          fetching: false
        })
        const {navigate} = this.props.navigation;
        navigate('Results')
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
          {this.state.fetching || <Button
            onPress={this._onPressGo}
            title="Go!"
            color="#FF1493"
            accessibilityLabel="Start your search"
          />}
          <View backgroundColor="#FF1493">
            {!this.state.fetching || <ActivityIndicator backgroundColor="#FF1493" size="large" color="white" animating={this.state.fetching}/>}
          </View>
          <MapView
          style={styles.mapFlex}
          provder="google"
          initialRegion={this.state.region}
          customMapStyle={global.mapStyle}
        >
          {this.renderMarkers()}
        </MapView>
      </View>
    );
  }

}

export default SearchScreen;