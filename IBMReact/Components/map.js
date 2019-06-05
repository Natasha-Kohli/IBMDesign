import React from 'react';
import { StyleSheet } from 'react-native';
import { MapView } from 'expo';

const styles = StyleSheet.create({
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

class Map extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {  
      isLoading: true,
      markers: [],
      loadedURL: null
    };
  }

  renderMarkers() { 
    if ( !this.props.displayMarkers ) return null;
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
        <MapView
          style={styles.mapFlex}
          provder="google"
          initialRegion={region}
          customMapStyle={mapStyle}
        >
          {this.renderMarkers()}
        </MapView>
    );
  }

}

export default Map;
