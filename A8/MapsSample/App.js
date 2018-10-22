import React from 'react';
import PropTypes from 'prop-types';

import {
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { Marker } from 'react-native-maps';
import MapView from 'react-native-maps';
import isEqual from 'lodash/isEqual';

const GEOLOCATION_OPTIONS = { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 };
const ANCHOR = { x: 0.5, y: 0.5 };

const colorOfmyLocationMapMarker = 'blue';

const propTypes = {
  ...Marker.propTypes,
  // override this prop to make it optional
  coordinate: PropTypes.shape({
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
  }),
  children: PropTypes.node,
  geolocationOptions: PropTypes.shape({
    enableHighAccuracy: PropTypes.bool,
    timeout: PropTypes.number,
    maximumAge: PropTypes.number,
  }),
  heading: PropTypes.number,
  enableHack: PropTypes.bool,
};

const defaultProps = {
  enableHack: false,
  geolocationOptions: GEOLOCATION_OPTIONS,
};

export default class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.mounted = false;
    this.state = {
      myPosition: null,
    };
  }
  componentDidMount() {
    this.mounted = true;
    // If you supply a coordinate prop, we won't try to track location automatically
    // if (this.props.coordinate) return;

    console.log(Platform.OS)
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        .then(granted => {
          console.log(granted)
          if (granted && this.mounted) this.watchLocation();
        });
    } else {
      this.watchLocation();
    }
  }
  watchLocation() {
    console.log('watchLocation')
    // eslint-disable-next-line no-undef
    this.watchID = navigator.geolocation.watchPosition((position) => {
      const myLastPosition = this.state.myPosition;
      const myPosition = position.coords;
      if (!isEqual(myPosition, myLastPosition)) {
        this.setState({ myPosition });
      }
    }, null, this.props.geolocationOptions);
  }
  componentWillUnmount() {
    this.mounted = false;
    // eslint-disable-next-line no-undef
    if (this.watchID) navigator.geolocation.clearWatch(this.watchID);
  }
  render() {
    // let { heading, coordinate } = this.props;
    // if (!coordinate) {
    //   const { myPosition } = this.state;
    //   if (!myPosition) return null;
    //   coordinate = myPosition;
    //   heading = myPosition.heading;
    // }

    // const rotate = (typeof heading === 'number' && heading >= 0) ? `${heading}deg` : null;

    return (
      <View style={{flex: 1}}>
        <Text>HAHAHAH</Text> 
        <MapView
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
        />
      </View>
    );
  }
}

const SIZE = 35;
const HALO_RADIUS = 6;
const ARROW_SIZE = 7;
const ARROW_DISTANCE = 6;
const HALO_SIZE = SIZE + HALO_RADIUS;
const HEADING_BOX_SIZE = HALO_SIZE + ARROW_SIZE + ARROW_DISTANCE;

const styles = StyleSheet.create({
  mapMarker: {
    zIndex: 1000,
  },
  // The container is necessary to protect the markerHalo shadow from clipping
  container: {
    width: HEADING_BOX_SIZE,
    height: HEADING_BOX_SIZE,
  },
  heading: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: HEADING_BOX_SIZE,
    height: HEADING_BOX_SIZE,
    alignItems: 'center',
  },
  headingPointer: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 0,
    borderRightWidth: ARROW_SIZE * 0.75,
    borderBottomWidth: ARROW_SIZE,
    borderLeftWidth: ARROW_SIZE * 0.75,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colorOfmyLocationMapMarker,
    borderLeftColor: 'transparent',
  },
  markerHalo: {
    position: 'absolute',
    backgroundColor: 'white',
    top: 0,
    left: 0,
    width: HALO_SIZE,
    height: HALO_SIZE,
    borderRadius: Math.ceil(HALO_SIZE / 2),
    margin: (HEADING_BOX_SIZE - HALO_SIZE) / 2,
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowRadius: 2,
    shadowOffset: {
      height: 0,
      width: 0,
    },
  },
  marker: {
    justifyContent: 'center',
    backgroundColor: colorOfmyLocationMapMarker,
    width: SIZE,
    height: SIZE,
    borderRadius: Math.ceil(SIZE / 2),
    margin: (HEADING_BOX_SIZE - SIZE) / 2,
  },
});

App.propTypes = propTypes;
App.defaultProps = defaultProps;
