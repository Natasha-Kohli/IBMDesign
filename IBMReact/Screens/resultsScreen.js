import React from 'react';
import { StyleSheet, View, FlatList, TextInput } from 'react-native';
import { ListItem } from 'react-native-elements';
import '../global.js';

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
  }

  keyExtractor = (item, index) => index.toString()

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
      title={item.name}
      subtitle={String(item.rating) + "\% fewer departures. " }
      linearGradientProps={{
        colors: ['#AE0B6E', '#e00f78'],
        start: [1, 0],
        end: [0.2, 0],
      }}
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