import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { theme } from "../constants/theme";
import * as Linking from "expo-linking";
import {ensureHttps, hp} from "../helpers/common";
 
const FlightInfoCard = ({ flightDetails, t }) => {
  return (
    <View
      style={{
        backgroundColor: theme.colors.containerColor,
        padding: 10,
        borderRadius: theme.radius.xxl,
        borderCurve: "continuous",
        gap: 5,
      }}
    >
      <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
        <Text style={{ fontWeight: theme.fonts.extraBold,  fontSize: hp(2) }}>
          ✈️ {t("flightInfoCard.flight")}
        </Text>
        <Pressable
          style={{
            backgroundColor: theme.colors.primary,
            padding: hp(1),
            width: 100,
            borderRadius: theme.radius.lg,
          }}
          onPress={() => {
            Linking.openURL(ensureHttps(flightDetails[0]?.Booking_URL));
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontWeight: theme.fonts.medium,
            }}
          >
            {t("flightInfoCard.bookButton")}
          </Text>
        </Pressable>
      </View>

      <Text
        style={{
          fontWeight: theme.fonts.medium,
          fontSize: hp(1.8),
        }}
      >
        {t("flightInfoCard.flight")}: {flightDetails[0]?.Flight_name}
      </Text>

      <Text
        style={{
          fontWeight: theme.fonts.medium,
          fontSize: hp(1.8),
        }}
      >
        {t("flightInfoCard.price")}: {flightDetails[0]?.Flight_price} {t("flightInfoCard.currency")}
      </Text>
    </View>
  );
};

export default FlightInfoCard;

const styles = StyleSheet.create({});
