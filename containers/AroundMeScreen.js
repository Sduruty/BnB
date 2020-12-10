import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import colors from "../assets/colors";
/* SPM  latitude: 46.9466881,
        longitude: -56.2622848,*/
/* Reacteur  latitude: 48.8564449,
        longitude: 2.4002913,*/



import Lottie from "../components/Lottie";

function AroundMeScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    try {
      const getLocationAndData = async () => {
        let { status } = await Location.requestPermissionsAsync();

        let response;

        if (status === "granted") {
          // get rooms around
          const location = await Location.getCurrentPositionAsync();

          const lat = location.coords.latitude;
          const lng = location.coords.longitude;

          response = await axios.get(
            `https://express-airbnb-api.herokuapp.com/rooms/around?latitude=${lat}&longitude=${lng}`
          );
        } else {
          // get all rooms
          response = await axios.get(
            `https://express-airbnb-api.herokuapp.com/rooms/around`
          );
        }
        const coordsTab = [];
        for (let i = 0; i < response.data.length; i++) {
          coordsTab.push({
            latitude: response.data[i].location[1],
            longitude: response.data[i].location[0],
            id: response.data[i]._id,
          });
        }

        setData(coordsTab);
        setIsLoading(false);
      };

      getLocationAndData();
    } catch (error) {
      alert("An error occurred...Shit happens");
    }
  }, []);

  return isLoading ? (
    <Lottie />
  ) : (
    //Set Position when arriving on map if user denied his position access 
    <MapView
      style={styles.map}
      initialRegion={{//spm
        latitude: 46.9466881,
        longitude: -56.2622848,
        latitudeDelta: 0,
        longitudeDelta: 0,
      }}
      showsUserLocation={true}
    >
      {data.map((item, index) => {
        return (
          <MapView.Marker
            key={index}
            coordinate={{
              latitude: item.latitude,
              longitude: item.longitude,
            }}
            onPress={() => {
              navigation.navigate("Room2", { id: item.id });
            }}
          />
        );
      })}
    </MapView>
  );
}

export default AroundMeScreen;

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
});
