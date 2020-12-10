import React from "react";
import { StyleSheet, Text, View } from "react-native";
import colors from "../assets/colors";

function PriceTag({ price }) {
  return (
    <View style={styles.priceTag}>
      <Text style={styles.price}>{price} €</Text>
    </View>
  );
}

export default PriceTag;

const styles = StyleSheet.create({
  priceTag: {
    width: 100,
    height: 50,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    marginLeft:5,
    borderRadius: 15,
    borderWidth:2,
    borderColor:colors.lightPink,
  },
  price: {
    color: colors.pink,
    fontSize: 20,
  },
});
