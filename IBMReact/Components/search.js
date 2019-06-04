import React from 'react';
import { Alert, StyleSheet, View, TextInput, Button, TimePickerAndroid } from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation';

const styles = StyleSheet.create({
  // container: {
  //   display: "flex",
  //   alignItems: "stretch",
  //   alignContent: "stretch",
  //   height: "100%",
  // },
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

class Search extends React.Component {
  
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
      // this.setState({
      //   timeHour: hour,
      //   timeMinute: minute,
      //   timeString: "Leaving at " + String(hour % 12) + ":" 
      //   + ((minute < 10) ? "0" + String(minute) : String(minute)) 
      //   + ((hour > 12) ? " pm" : " am")
      // }); 
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

  componentDidMount() {
  }

  render() {
    // const { search } = this.state;
    // const {navigate} = this.props.navigation;
    // const { params } = this.props.navigation.state;
  
    return (
      <View >
        <View style={styles.notificationBar}></View> 
        <View style={styles.directionsContainer}>
          <View style={styles.searchContainer}>
            <TextInput style={styles.calloutSearch}
              placeholder={global.startLocation}
              placeholderTextColor={"black"}
              onFocus={this._onStartFocus}
            />
            {/* <TextInput style={styles.calloutSearch}
              placeholder={"Destination"}
              placeholderTextColor={"black"}
            />  */}
            <TextInput style={styles.calloutSearch}
              placeholder={global.timeString}
              placeholderTextColor={"black"}
              onFocus={this._onPressTime}
            />
              {/* <Button
                onPress={this._onPressTime}
                title="Time"
                color="#FF1493"
                accessibilityLabel="Pick a time"
              /> */}
          </View>
        </View>
          <Button
            onPress={this._onPressGo}
            title="Go!"
            color="#FF1493"
            accessibilityLabel="Start your search"
          />
      </View>
    );
  }
}

// new screen
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


// new screen
class ResultsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Departing From: " + global.startLocation
    };
  };

  constructor(props) {
    super(props);
    this.state = { 
      data: [
        {
          name: 'Leave Now',
          avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
          subtitle: 'It\'s quicker'
        },
        {
          name: 'Leave Then',
          avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
          subtitle: 'It\'s better'
        }]
    };
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ({ item }) => (
    <ListItem
      title={item.name}
      subtitle={item.subtitle}
      leftAvatar={{ source: { uri: item.avatar_url } }}
    />
  )

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.notificationBar}></View>
      <FlatList
        keyExtractor={this.keyExtractor}
        data={this.state.data}
        renderItem={this.renderItem}
      />
      </View>
    )
  }
}
 
const MainNavigator = createStackNavigator({
  Search: {screen: Search,
    navigationOptions: {
      header: null,
    }},
  GoogleLocations: {screen: GoogleLocationsScreen,
    navigationOptions: {
      header: null,
    }},
  Results: {screen: ResultsScreen,
    navigationOptions: {
    }},
});

export default Search;