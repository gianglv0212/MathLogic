import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Colors from "@/constants/colors";

interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  accent?: string;
}

export function StatCard({ label, value, sublabel, accent = Colors.light.tint }: StatCardProps) {
  return (
    <View style={styles.card}>
      <Text style={[styles.value, { color: accent }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      {sublabel && <Text style={styles.sublabel}>{sublabel}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  value: {
    fontSize: 28,
    fontWeight: "800",
    fontFamily: "Inter_700Bold",
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
  sublabel: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
    textAlign: "center",
  },
});
