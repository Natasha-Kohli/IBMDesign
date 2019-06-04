import React from 'react';
import { Alert, StyleSheet, View, TextInput, Button, TimePickerAndroid } from 'react-native';

import '../global.js';
import Map from '../Components/map.js';

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
  }
});

class SearchScreen extends React.Component {
  static navigationOptions = {
    title: 'Catch-A-Ride',
  };
  
  constructor(props) {
    super(props);
    this.state = { 
      timeHour: 12,
      timeMinute: 0,
      startText: "Enter Pickup Location",
      timeString: "Enter Departure Time"
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
    console.log("Will the time change?");
    const {action, hour, minute} = await TimePickerAndroid.open({
      hour:  new Date().getHours(),
      minute: new Date().getMinutes(),
      is24Hour: false
    });
    if (action !== TimePickerAndroid.dismissedAction) {
      global.timeHour = hour,
      global.timeMinute = minute,
      global.timeString = "Leaving at " + String(hour % 12) + ":" 
      + ((minute < 10) ? "0" + String(minute) : String(minute)) 
      + ((hour > 12) ? " pm" : " am")
      console.log("HELLO, the time is changing: " + "Leaving at " + String(hour) + ":" + String(minute));
    }
    console.log("end of _onPressTime");
  }

  _onStartFocus = () => {
    const {navigate} = this.props.navigation;
    navigate('GoogleLocations')
  } 

  render() {
  
    return (
      <View style={styles.container}>
        <View style={styles.notificationBar}></View> 
        <View style={styles.directionsContainer}>
          <View style={styles.searchContainer}>
            <TextInput style={styles.calloutSearch}
              placeholder={global.startLocation}
              placeholderTextColor={"black"}
              onFocus={this._onStartFocus}
            /> 
            <TextInput style={styles.calloutSearch}
              placeholder={global.timeString}
              placeholderTextColor={"black"}
              onFocus={this._onPressTime}
            />
          </View>
          </View>
          <Button
            onPress={this._onPressGo}
            title="Go!"
            color="#FF1493"
            accessibilityLabel="Start your search"
          />
        {/* <Search /> */}
        <Map />
      </View>
    );
  }

}

export default SearchScreen;