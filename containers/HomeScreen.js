import React, { useState, useEffect } from "react";
import {
  ImageBackground,
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import colors from "../assets/colors";

// Components
import PriceTag from "../components/PriceTag";
import Infos from "../components/Infos";
import Lottie from "../components/Lottie";

function HomeScreen({ navigation }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `https://express-airbnb-api.herokuapp.com/rooms`
      );
      setData(response.data);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView>
      <StatusBar
        barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"}
      />

      {isLoading ? (
        <Lottie />
      ) : (
        <FlatList
          data={data}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                style={
                  index === data.length - 1
                    ? styles.container
                    : [styles.container, styles.border]
                }
                activeOpacity={0.7}
                onPress={() => {
                  navigation.navigate("Room1", { id: item._id });
                }}
              >
                <ImageBackground
                  source={{ uri: item.photos[0].url }}
                  style={styles.bgImage}
                >
                  <PriceTag price={item.price} />
                </ImageBackground>

                <Infos
                  title={item.title}
                  ratingValue={item.ratingValue}
                  reviews={item.reviews}
                  photo={item.user.account.photo.url}
                />
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => item._id}
          style={styles.flatList}
        />
      )}
    </SafeAreaView>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  flatList: { backgroundColor: colors.backgroundColor },
  container: {
    height: 300,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  border: {
    borderBottomColor: colors.lightPink,
    borderBottomWidth: 1.5,
  },
  bgImage: {
    flex: 1,
    justifyContent: "flex-end",
  },
  icon: {
    marginRight: 5,
  },
});
