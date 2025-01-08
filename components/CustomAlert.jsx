import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { theme } from "../constants/theme";
import { hp, wp } from "../helpers/common";

const CustomAlert = ({ visible, onClose, title, message, buttons }) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonContainer}>
            {buttons &&
              buttons.map((button, index) => (
                <TouchableOpacity
                  key={index}
                  style={index === 0 ? styles.buttonDark : styles.buttonLight}
                  onPress={button.onPress}
                >
                  <Text
                    style={
                      index === 0
                        ? styles.buttonTextDark
                        : styles.buttonTextLight
                    }
                  >
                    {button.text}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  alertContainer: {
    gap: 15,
    backgroundColor: "white",
    padding: wp(5),
    borderRadius: theme.radius.lg,
    width: "80%",
    alignItems: "center",
    shadowColor: theme.colors.dark,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: hp(2),
    fontWeight: theme.fonts.bold,
    color: theme.colors.textDark,
  },
  message: {
    fontSize: hp(1.5),
    color: theme.colors.textDark,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
  buttonDark: {
    backgroundColor: theme.colors.primary,
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(7),
    borderRadius: theme.radius.xl,
  },
  buttonLight: {
    backgroundColor: "white",
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(7),
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  buttonTextDark: {
    color: "white",
    fontWeight: theme.fonts.bold,
  },
  buttonTextLight: {
    color: theme.colors.primary,
    fontWeight: theme.fonts.bold,
  },
});
