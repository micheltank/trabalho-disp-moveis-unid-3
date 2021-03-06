import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AlertIOS
} from 'react-native';

import CameraScreen from './src/CameraScreen';

export default class example extends Component {

  constructor(props) {
    super(props);
    this.state = {
      example: undefined
    };
  }

  render() {
    if (this.state.example) {
      const Example = this.state.example;
      return <CameraScreen />;
    }
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>
            Welcome to Camera Kit
          </Text>
          <Text style={{ fontSize: 40 }}>📷</Text>
        </View>


        <View style={styles.container}>
          <TouchableOpacity onPress={() => this.setState({ example: CameraScreen })}>
            <Text style={styles.buttonText}>
              Camera Screen
            </Text>
          </TouchableOpacity>

        </View>

      </View>

    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    paddingTop: 60,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  headerContainer: {
    flexDirection: 'column',
    backgroundColor: '#F5FCFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100
  },
  headerText: {
    color: 'black',
    fontSize: 24
  },
  buttonText: {
    color: 'blue',
    marginBottom: 20,
    fontSize: 20
  }
});

AppRegistry.registerComponent('CameraKit', () => example);