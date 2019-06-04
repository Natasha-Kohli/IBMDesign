import {createStackNavigator, createAppContainer} from 'react-navigation';
import GoogleLocationsScreen from './Screens/googleLocationsScreen.js';
import ResultsScreen from './Screens/resultsScreen.js';
import SearchScreen from './Screens/searchScreen.js';

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