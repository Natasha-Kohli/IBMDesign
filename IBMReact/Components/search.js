import React from 'react';
import { Alert, StyleSheet, View, TextInput, Text, Button, TimePickerAndroid } from 'react-native';
import moment from 'moment';

const styles = StyleSheet.create({
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
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "black",
    paddingLeft: 10,
    fontWeight: "bold"
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

class Search extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = { 
      timeHour: 12,
      timeMinute: 0,
      startText: "Enter Pickup Location",
      timeString: "Choose Departure Time", //moment().format("h:mm A"),
      displayMarkers: this.props.displayMarkers
    };
  }

  _onPressGo = () => {
    if (!((global.startCoords === null) || (global.timeHour === null))) {
      this.setState({ 
        displayMarkers: true
      })
      this.props.handleSearch(true);
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
        // "Leaving at " + String(hour % 12) + ":" 
        // + ((minute < 10) ? "0" + String(minute) : String(minute)) 
        // + ((hour > 12) ? " pm" : " am")
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

  componentDidMount() {
  }

  render() {
  
    return (
      <View >
        <View style={styles.notificationBar}></View> 
        <View style={styles.directionsContainer}>
          <View style={styles.searchContainer}>
            <TextInput style={styles.calloutSearch}
              placeholder={global.startLocation}
              placeholderTextColor={"white"}
              onFocus={this._onStartFocus}
            />
            {/* <TextInput style={styles.calloutSearch}
              placeholderTextColor={"black"}
              onFocus={this._onPressTime}
              placeholder={this.state.timeString}
            />  */}
            <Button 
              onPress={this._onPressTime}
              title={this.state.timeString}
              color="black"
            />
          </View>
        </View>
          <Button
            onPress={this._onPressGo}
            title="Go!"
            color="#FF1493"
            accessibilityLabel="Start your search"
          />
          {console.log(this.state)}
      </View>
    );
  }
}

export default Search;