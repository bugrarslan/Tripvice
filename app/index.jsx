import { StyleSheet, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import Loading from "../components/Loading";

const index = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Loading size={"large"}/>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  },
});
