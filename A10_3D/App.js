import Expo from "expo"
import React from "react"
import { StyleSheet, Text, View, Animated, PanResponder } from "react-native"

import * as THREE from "three"
import ExpoTHREE from "expo-three"
import { Accelerometer } from 'expo'

export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      pan: new Animated.ValueXY(),
      accelerometerData: {},
    }
  }

  _subscribe = () => {
    this._subscription = Accelerometer.addListener(accelerometerData => {
      this.setState({ accelerometerData })
      // let { x, y, z } = this.state.accelerometerData
      // console.log(x)
    })
  }

  componentDidMount() {
    this._subscribe()
  }

  componentWillMount() {
    this._val = { x: 0, y: 0 }
    this.state.pan.addListener(value => (this._val = value))

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gesture) => true,
      onPanResponderGrant: (e, gesture) => {
        this.state.pan.setOffset({
          x: this._val.x,
          y: this._val.y
        })
        this.state.pan.setValue({ x: 0, y: 0 })
      },
      onPanResponderMove: Animated.event([
        null,
        { dx: this.state.pan.x, dy: this.state.pan.y }
      ])
    })
  }

  render() {    
    const panStyle = {
      transform: this.state.pan.getTranslateTransform()
    }
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "black",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Animated.View
          {...this.panResponder.panHandlers}
          style={[panStyle, { width: 200, height: 200 }]}
        >
          <Expo.GLView
            style={{ flex: 1 }}
            onContextCreate={this._onGLContextCreate}
          />
        </Animated.View>
      </View>
    )
  }

  _onGLContextCreate = async gl => {

    const scene = new THREE.Scene()

    const light = new THREE.PointLight( 0xff0000, 1, 100 )
    light.position.set( 50, 50, 50 )		
    scene.add(light)

    const camera = new THREE.PerspectiveCamera(
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      1000
    )

    const renderer = ExpoTHREE.createRenderer({ gl })
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight)

    const geometry = new THREE.BoxGeometry( 1, 1, 1 )
    const material = new THREE.MeshBasicMaterial({
      color: 0xafeeee,
      map: await ExpoTHREE.createTextureAsync({
        asset: Expo.Asset.fromModule(require("./img/panorama.png"))
      })
    })
    const sphere = new THREE.Mesh(geometry, material)
    sphere.castShadow = true
    
    scene.add(sphere)
    
    camera.position.z = 2

    const render = () => {
      requestAnimationFrame(render)
      let { y, x } = this.state.accelerometerData

      sphere.rotation.y = x * -1
      sphere.rotation.x = y 

      renderer.render(scene, camera)

      gl.endFrameEXP()
    }
    render()
  }
}