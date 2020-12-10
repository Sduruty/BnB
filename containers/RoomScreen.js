import React, { useState, useEffect } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import axios from "axios";
import colors from "../assets/colors";
import MapView from "react-native-maps";
import SwiperFlatList from "react-native-swiper-flatlist";

// Components
import Infos from "../components/Infos";
import PriceTag from "../components/PriceTag";
import ShowText from "../components/ShowText";
import Lottie from "../components/Lottie";
// Dimensions
const windowHeight = Dimensions.get("window").height;

function RoomScreen({ route }) {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [displayAllText, setDisplayAllText] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `https://express-airbnb-api.herokuapp.com/rooms/${route.params.id}`
      );
      setData(response.data);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return isLoading ? (
    <Lottie />
  ) : (
    <ScrollView style={styles.scrollView}>
      <View style={styles.relative}>
        <SwiperFlatList
          showPagination={true}
          data={data.photos}
          index={0}
          renderItem={({ item }) => {
            return (
              <View style={styles.bgImage}>
                <Image
                  source={{
                    uri: item.url,
                  }}
                  style={styles.bgImage}
                  resizeMode="cover"
                ></Image>
              </View>
            );
          }}
        ></SwiperFlatList>

        <View style={styles.absolute}>
          <PriceTag price={data.price} />
        </View>
      </View>

      <View style={styles.margin}>
        <Infos
          title={data.title}
          photo={data.user.account.photo.url}
          reviews={data.reviews}
        />
      </View>

      <Text
        numberOfLines={displayAllText === false ? 3 : null}
        style={styles.description}
      >
        {data.description}
      </Text>

      <TouchableOpacity
        style={styles.description}
        onPress={() => {
          setDisplayAllText(!displayAllText);
        }}
      >
        <ShowText
          icon={!displayAllText ? "down" : "up"}
          text={!displayAllText ? "more" : "less"}
        />
      </TouchableOpacity>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: data.location[1],
          longitude: data.location[0],
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        <MapView.Marker
          coordinate={{
            latitude: data.location[1],
            longitude: data.location[0],
          }}
          title={data.title}
        />
      </MapView>
    </ScrollView>
  );
}

export default RoomScreen;

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: colors.backgroundColor,
  },
  bgImage: {
    height: windowHeight / 3,
    width,
    backgroundColor: colors.pink,
  },
  relative: {
    position: "relative",
  },
  absolute: {
    position: "absolute",
    bottom: 0,
  },
  description: {
    marginHorizontal: 20,
    lineHeight: 20,
    marginBottom: 10,
  },
  margin: {
    marginHorizontal: 20,
  },
  map: {
    height: 300,
    width: "100%",
  },
});
