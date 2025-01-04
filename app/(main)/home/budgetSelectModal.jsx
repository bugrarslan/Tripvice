import { StyleSheet, Text, View, Platform, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { hp, wp } from "../../../helpers/common";
import TripButton from "../../../components/TripButton";
import Header from "../../../components/Header";
import {useTranslation} from "react-i18next";
import {SelectBudgetList} from "../../../constants/tripOptions";
import { useSelector, useDispatch } from "react-redux";
import { setTripData } from "../../../contexts/redux/slices/tripSlice"

const budgetSelectModal = () => {
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 5 : 30;
  const ios = Platform.OS === "ios";
  const { t } = useTranslation();
  const tripData = useSelector((state) => state.trip.tripData);
  const dispatch = useDispatch();

  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setSelected(tripData.budgetInfo);
  }, [])

  const translatedBudgetList = SelectBudgetList(t);

  const onItemSelected = (option) => {
    setSelected(option);
    dispatch(setTripData({ ...tripData, budgetInfo: option }));
    setTimeout(() => {
      router.back();
    }, 500);
  }

  return (
    <View
      style={[
        ios ? { paddingTop: wp(5) } : { paddingTop },
        { backgroundColor: "white", flex: 1 },
      ]}
    >
      <View style={styles.container}>
        <StatusBar style="auto" />
        {/* header */}
        <Header title={t("budgetSelectModal.headerTitle")} showCloseButton={true}/>
        {/* content */}
        <View style={styles.content}>
          <FlatList
            style={{ width: "100%" }}
            contentContainerStyle={{ gap: 10 }}
            data={translatedBudgetList}
            renderItem={({ item, index }) => (
              <TripButton
                option={item}
                selected={selected}
                onSelect={onItemSelected}
              />
            )}
          />
        </View>
      </View>
    </View>
  );
};

export default budgetSelectModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: wp(4),
    gap: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  content: {
    flex: 1,
  },
});
