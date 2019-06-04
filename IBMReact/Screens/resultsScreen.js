import React from 'react';
import { Alert, StyleSheet, View, TextInput, Text, Button, TimePickerAndroid, FlatList } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import { List, ListItem } from 'react-native-elements'

import '../global.js';
import Map from '../Components/map.js';
import Search from '../Components/search.js';

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

export default ResultsScreen;