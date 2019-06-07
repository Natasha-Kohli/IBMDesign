import React from 'react';
import { StyleSheet, View, FlatList, TextInput } from 'react-native';
import { ListItem } from 'react-native-elements';
import '../global.js';
import getDirections from 'react-native-google-maps-directions'

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

class ResultsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "From: " + global.briefLocation,
      headerStyle: {
        backgroundColor: '#000000',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      }
    };
  };

  constructor(props) {
    super(props);
    this.state = { 
      data: global.data,
      status: null
    };
    this._onLongPress = this._onLongPress.bind(this);
  }

  keyExtractor = (item, index) => index.toString()

  _op = () => {
    const { goBack } = this.props.navigation;
    goBack();
  }

  _onLongPress = (lat, lon) => {
    const data = {
      source: {
       latitude: global.startCoords.lat,
       longitude: global.startCoords.lng,
     },
     destination: {
       latitude: lat,
       longitude: lon
     },
     params: [
       {
         key: "travelmode",
         value: "walking"        // may be "walking", "bicycling" or "transit" as well
       },
       {
         key: "dir_action",
         value: "navigate"       // this instantly initializes navigation using the given travel mode
       }
     ]
    }


    console.log("selected list time");

    getDirections(data);
  }

  


  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%"
        }}
      >
      </View>
    );
  };

  renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  renderItem = ({ item }) => (
    <ListItem
      titleStyle={{ color: 'white', fontWeight: 'bold' }}
      subtitleStyle={{ color: 'white' }}
      title={item.name + ",\nWait " + String(item.minute_offset) + " minutes" }
      subtitle={String(Math.pow(item.rating, -1)) + "\% fewer departures. " }
      linearGradientProps={{
        colors: ['#AE0B6E', '#e00f78'],
        start: [1, 0],
        end: [0.2, 0], 
      }}
      onLongPress={() => this._onLongPress(item.lat, item.lon)}
      onPress={this._op}
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
        ItemSeparatorComponent={this.renderSeparator}
        ListFooterComponent={this.renderFooter}
      />
      </View>
    )
  }
}

export default ResultsScreen;