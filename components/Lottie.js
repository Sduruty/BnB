import React, { useEffect } from "react";
import { PickerIOSComponent, StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";
import colors from "../assets/colors";

const Lottie = () => {
  useEffect(() => {
    animation.play();
  }, []);

  return (
    <View style={styles.animationContainer}>
      <LottieView
        ref={(animation) => {
          this.animation = animation;
        }}
        style={{
          height: 200,
          backgroundColor: colors.lottieBack,
        }}
        source={require("../assets/13961-airbnb-logo-animation.json")}
      />
    </View>
  );
};

export default Lottie;

const styles = StyleSheet.create({
  animationContainer: {
    backgroundColor: colors.lottieBack,

    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
});
