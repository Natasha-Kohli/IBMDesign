import React from 'react';
import { StyleSheet, View, FlatList, SearchBar } from 'react-native';
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
      title: "Departing From: " + global.briefLocation
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

  // renderHeader = () => {
  //   return <SearchBar placeholder="Type Here..." lightTheme round />;
  // };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%"
        }}
      />
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
        // ListHeaderComponent={this.renderHeader}
        ItemSeparatorComponent={this.renderSeparator}
        ListFooterComponent={this.renderFooter}
      />
      </View>
    )
  }
}

export default ResultsScreen;