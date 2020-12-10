import React from "react";
import { StyleSheet, Text, View } from "react-native";
import colors from "../assets/colors";

// Icons
import { FontAwesome } from "@expo/vector-icons";

function ShowText({ icon, text }) {
  return (
    <View style={styles.line}>
      <Text style={styles.text}>Show {text}</Text>
      {icon === "down" ? (
        <FontAwesome name="caret-down" size={20} color={colors.pink} />
      ) : (
        <FontAwesome name="caret-up" size={20} color={colors.LighterPink} />
      )}
    </View>
  );
}

export default ShowText;

const styles = StyleSheet.create({
  line: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  text: {
    marginRight: 6,
    color: colors.grey,
  },
});
