import React from 'react';
import { StyleSheet, View } from 'react-native';
import Map from '../Components/map.js';
import Search from '../Components/search.js';

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "stretch",
    alignContent: "stretch",
    height: "100%",
  }
});

class SearchScreen extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = { 
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Search navigation={this.props.navigation}/>
        <Map />
      </View>
    );
  }

}

export default SearchScreen;