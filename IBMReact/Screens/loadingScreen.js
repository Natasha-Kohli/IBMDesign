import React from 'react';
import { Alert, StyleSheet, View, TextInput, Text, Button, TimePickerAndroid, DatePickerAndroid, Modal, TouchableOpacity } from 'react-native';
import { MapView } from 'expo';
import moment from 'moment';
import "../global.js"

import {
  Animated,
  Image,
  Easing,
} from "react-native";


const truckStyle = {
  transform: [{ scale: this.animatedValue }]
};

const scaleText = {
  transform: [{ scale: this.animatedValue2 }]
};

class LoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(0.5);
    this.animatedValue2 = new Animated.Value(0);
  }


  componentDidMount() {
    Animated.spring(this.animatedValue, {
      toValue: 1,
      friction: 4,
      delay: 2500,
     useNativeDriver: true,
    }).start();

    Animated.timing(this.animatedValue2, {
      toValue: 1,
      delay: 200,
      duration: 3000,
     useNativeDriver: true,
    }).start();
  }

  render() {
    return (
    <LinearGradient
      colors={[
        "#00FFFF",
        "#17C8FF",
        "#329BFF",
        "#4C64FF",
        "#6536FF",
        "#8000FF"
      ]}
      style={styles.container}
    >
      <Animated.View style={[styles.ring, truckStyle]}>
        <Animated.Image
          source={require("./Screens/pancakes_1.jpg")}
          style={[
            {
              resizeMode: "contain",
              width: 200,
              height: 200
            }
          ]}
        />
      </Animated.View>

      <Animated.View
        style={[
          {
            position: "absolute",
            bottom: 20,
            width: width / 2,
            height: 4,
            backgroundColor: "#fff",
            borderRadius: 2
          },
          scaleText
        ]}
      />
    </LinearGradient>
  );
  }
}


export default LoadingScreen;