import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { FraudAnalyzer } from "../../../components/FraudAnalyzer";
import { SecurityFeatures } from "../../../components/SecurityFeatures";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UrlAnalysisTool() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <FraudAnalyzer />
          <SecurityFeatures />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  content: {
    flex: 1,
  },
});
