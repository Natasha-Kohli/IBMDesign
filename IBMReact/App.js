import React from 'react';
import { StyleSheet, View, TextInput, Button, TimePickerAndroid, FlatList } from 'react-native';
import { MapView } from 'expo';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import { List, ListItem } from 'react-native-elements'

import './global.js'

const styles = StyleSheet.create({
  mapFlex: {
    display: "flex",
    height: "100%"
  },
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
    // marginTop: 30,
    borderColor: "black",
    borderRadius: 5,
    backgroundColor: "white"
  
  }
});

var mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.business",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#181818"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1b1b1b"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ff00ff"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#ff00ff"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#ff00ff"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8a8a8a"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ff00ff"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3c3c3c"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#ff00ff"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ff00ff"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#ff00ff"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ff00ff"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3d3d3d"
      }
    ]
  }
]


var region = {
  latitude: 40.7128,
  longitude: -74.0060,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

var serverURL = 'https://feeds.citibikenyc.com/stations/stations.json'

class SearchScreen extends React.Component {
  static navigationOptions = {
    title: 'Catch-A-Ride',
  };
  
  constructor(props) {
    super(props);
    this.state = { 
      isLoading: true,
      markers: [],
      displayMarkers: false,
      timeHour: 12,
      timeMinute: 0,
      startText: "Search Pickup Location"
    };
  }


  _onPressGo = () => {
    this.setState({ 
      displayMarkers: true
    })
    const {navigate} = this.props.navigation;
    navigate('Results')
  }

  _onPressTime = () => {
    let newTime = TimePickerAndroid.open({hour: 12, minute: 0, is24Hour: false});
    if (newTime.action == TimePickerAndroid.timeSetAction) {
      this.setState({
        timeHour: newTime.hour,
        timeMinute: newTime.minute
      });
    }
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
            latitude: marker.latitude,
            longitude: marker.longitude
          };

          const metadata = `Status: ${marker.statusValue}`;

          return (
            <MapView.Marker
              key={index}
              coordinate={coords}
              title={marker.stationName}
              description={metadata}
            />
          );
        });
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    fetch(serverURL)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ 
          isLoading: false,
          markers: responseJson.stationBeanList, 
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const { search } = this.state;
    const {navigate} = this.props.navigation;
    const { params } = this.props.navigation.state;
  
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
            {/* <TextInput style={styles.calloutSearch}
              placeholder={"Destination"}
              placeholderTextColor={"black"}
            />  */}
          </View>
          <Button
            onPress={this._onPressTime}
            title="Time"
            color="#FF1493"
            accessibilityLabel="Pick a time"
          />
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
            global.startLocation = data.description
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
              backgroundColor: 'rgba(255,192,203,0)',
              borderTopWidth: 0,
              borderBottomWidth:0
            },
            textInput: {
              marginLeft: 0,
              marginRight: 0,
              height: 38,
              color: '#331524',
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
  constructor(props) {
    super(props);
    this.state = { 
      data: [
        {
          name: 'Amy Farha',
          avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
          subtitle: 'Vice President'
        },
        {
          name: 'Chris Jackson',
          avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
          subtitle: 'Vice Chairman'
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
      <FlatList
        keyExtractor={this.keyExtractor}
        data={this.state.data}
        renderItem={this.renderItem}
      />
    )
  }
}
 
const MainNavigator = createStackNavigator({
  Search: {screen: SearchScreen,
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
 
const App = createAppContainer(MainNavigator);

export default App;


