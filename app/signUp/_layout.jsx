<<<<<<< HEAD
import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
=======
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
>>>>>>> c549b83c1bb6dc5584f94eb715c8f812b61c30d0

const _layout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="confirmSignUp" />
    </Stack>
<<<<<<< HEAD
  );
};

export default _layout;

const styles = StyleSheet.create({});
=======
  )
}

export default _layout

const styles = StyleSheet.create({})
>>>>>>> c549b83c1bb6dc5584f94eb715c8f812b61c30d0
