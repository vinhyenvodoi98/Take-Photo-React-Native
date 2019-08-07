import React, { Component } from 'react';
import { View } from 'react-native';
import Home from './view/Home.js';

export default class HelloWorldApp extends Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Home />
      </View>
    );
  }
}
