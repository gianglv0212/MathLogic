import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

import Colors from "@/constants/colors";

interface StarRatingProps {
  count: number;
  max?: number;
  size?: number;
  color?: string;
}

export function StarRating({ count, max = 3, size = 20, color = Colors.light.star }: StarRatingProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: max }).map((_, i) => (
        <Ionicons
          key={i}
          name={i < count ? "star" : "star-outline"}
          size={size}
          color={i < count ? color : Colors.light.border}
          style={styles.star}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  star: {
    marginHorizontal: 1,
  },
});
