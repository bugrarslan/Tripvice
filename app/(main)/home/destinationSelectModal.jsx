import {StyleSheet, Text, View, Platform} from "react-native";
import React from "react";
import {useRouter} from "expo-router";
import {StatusBar} from "expo-status-bar";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {hp, wp} from "../../../helpers/common";
import {theme} from "../../../constants/theme";
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import Header from "../../../components/Header";
import {useTranslation} from "react-i18next";
import {useSelector, useDispatch} from "react-redux";
import {setTripData} from "../../../contexts/redux/slices/tripSlice"
import { googlePlacesApiKey } from "../../../constants";

const destinationSelectModal = () => {
  const router = useRouter();
  const {top} = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 5 : 30;
  const ios = Platform.OS === "ios";
  const {t, i18n} = useTranslation();
  const tripData = useSelector((state) => state.trip.tripData);
  const dispatch = useDispatch();


  return (
    <View
      style={[
        ios ? {paddingTop: wp(5)} : {paddingTop},
        {flex: 1, backgroundColor: "white"},
      ]}
    >
      <View style={styles.container}>
        <StatusBar style="auto"/>
        {/* header */}
        <Header title={t("destinationSelectModal.headerTitle")} showCloseButton={true}/>

        {/* content */}
        <View style={{flex: 1, backgroundColor: "white"}}>
          <GooglePlacesAutocomplete
            placeholder={t("destinationSelectModal.placeholder")}
            fetchDetails={true}
            onFail={(error) => console.error(error)}
            onPress={(data, details = null) => {
              dispatch(setTripData({
                ...tripData,
                locationInfo: {
                  name: data.description,
                  coordinates: details?.geometry?.location,
                  photoRef: details?.photos[0]?.photo_reference,
                  url: details?.url,
                },
              }));
              router.back();
            }}
            isRowScrollable
            query={{
              key: googlePlacesApiKey,
              language: (i18n.language === "tr" ? "tr" : "en"),
            }}
            styles={{
              textInputContainer: {
                borderRadius: theme.radius.xl,
                borderCurve: "continuous",
                justifyContent: "center",
                backgroundColor: theme.colors.containerColor,
              },
              textInput: {
                fontWeight: theme.fonts.bold,
                fontSize: hp(2.5),
                color: "black",
                borderRadius: theme.radius.xl,
                backgroundColor: theme.colors.containerColor,
                height: hp(8),
              },
              row: {
                backgroundColor: theme.colors.containerColor,
                borderRadius: theme.radius.xl,
                borderCurve: "continuous",
                marginVertical: 5,
              },
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default destinationSelectModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
    gap: 10,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
});
