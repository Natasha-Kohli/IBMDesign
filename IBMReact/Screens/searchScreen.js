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
      displayMarkers: false
    };
  }

  handleSearch = (val) => {
    this.setState({
      displayMarkers: val
    })
  }

  render() {
    return (
      <View style={styles.container}>
        {console.log(this.state)}
        <Search navigation={this.props.navigation} displayMarkers={this.state.displayMarkers} handleSearch={this.handleSearch}/>
        <Map displayMarkers={this.state.displayMarkers}/>
      </View>
    );
  }

}

export default SearchScreen;