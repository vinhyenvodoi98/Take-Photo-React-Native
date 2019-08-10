import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import * as Permissions from "expo-permissions";
import * as FileSystem from "expo-file-system";
import { Camera } from "expo-camera";

import GalleryScreen from "./GalleryScreen";

export default class Home extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    newPhotos: false,
    showGallery: false
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }

  async componentDidMount() {
    var isExits = await FileSystem.getInfoAsync(FileSystem.documentDirectory + "photos");
    if (isExits.exists === false) {
      FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "photos").catch((e) => {
        console.log(e, "Directory exists");
      });
    }
  }

  takePicture = () => {
    if (this.camera) {
      this.camera.takePictureAsync({ onPictureSaved: this.onPictureSaved });
    }
  };

  onPictureSaved = async (photo) => {
    await FileSystem.moveAsync({
      from: photo.uri,
      to: `${FileSystem.documentDirectory}photos/${Date.now()}.jpg`
    });
    this.setState({ newPhotos: true });
  };

  toggleView = () => this.setState({ showGallery: !this.state.showGallery, newPhotos: false });

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else if (this.state.showGallery === true) {
      return <GalleryScreen onPress={this.toggleView.bind(this)} />;
    } else if (this.state.showGallery === false) {
      return (
        <View style={{ flex: 1 }}>
          <Camera
            ref={(ref) => {
              this.camera = ref;
            }}
            style={{ flex: 1 }}
            type={this.state.type}>
            <View
              style={{
                flex: 1,
                backgroundColor: "transparent",
                flexDirection: "column"
              }}>
              <View style={{ flex: 5 }} />

              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-evenly"
                  // alignSelf: 'flex-end'
                }}>
                <View>
                  <TouchableOpacity
                    style={{
                      flex: 1
                    }}
                    onPress={() => {
                      this.setState({
                        type:
                          this.state.type === Camera.Constants.Type.back
                            ? Camera.Constants.Type.front
                            : Camera.Constants.Type.back
                      });
                    }}>
                    <Text style={{ fontSize: 18, marginBottom: 10, color: "white" }}> FLIP </Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <TouchableOpacity
                    style={{
                      flex: 1
                    }}
                    onPress={() => {
                      this.takePicture();
                    }}>
                    <Text style={{ fontSize: 18, marginBottom: 10, color: "white" }}> SNAP </Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <TouchableOpacity
                    style={{
                      flex: 1
                    }}
                    onPress={this.toggleView}>
                    <Text style={{ fontSize: 18, marginBottom: 10, color: "white" }}>GALLERY</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Camera>
        </View>
      );
    }
  }
}
