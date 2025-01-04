import { StyleSheet, Text, View, Platform, Alert } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { hp, wp } from "../../../helpers/common";
import { theme } from "../../../constants/theme";
import CalendarPicker from "react-native-calendar-picker";
import moment from "moment";
import Button from "../../../components/Button";
import Header from "../../../components/Header";
import {useTranslation} from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { setTripData } from "../../../contexts/redux/slices/tripSlice"
import CustomAlert from "../../../components/CustomAlert";

const dateSelectModal = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 5 : 30;
  const ios = Platform.OS === "ios";
  const tripData = useSelector((state) => state.trip.tripData);
  const dispatch = useDispatch();

  // custom alert
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState({buttons:[]});

  const showAlert = (data) => {
    setAlertVisible(true);
    setAlertData(data);
  };

  const closeAlert = () => {
    setAlertVisible(false);
    setAlertData({buttons:[]});
  };

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const onDateChange = (date, type) => {
    if (type === "START_DATE") {
      setStartDate(moment(date));
      setEndDate(null);
    } else {
      setEndDate(moment(date));
    }
  };

  const onDateSelectionApply = () => {
    if (!startDate || !endDate) {
      showAlert({
        type: "error",
        title: t("alert.warning"),
        content: t("alert.selectDates"),
        buttons: [
          {
            text: t("alert.ok"),
            onPress: () => closeAlert(),
          },
        ],
      });
      return;
    }
    const totalNoOfDays = endDate.diff(startDate, "days") + 1;
    dispatch(setTripData({
      ...tripData,
      dateInfo: {
        startDate: startDate,
        endDate: endDate,
        totalNoOfDays: totalNoOfDays,
      },
    }));
    router.back();
  };

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
        <Header title={t("dateSelectModal.headerTitle")} showCloseButton/>
        {/* content */}
        <View style={styles.content}>
          <CalendarPicker
            onDateChange={onDateChange}
            showDayStragglers
            allowRangeSelection
            minDate={new Date()}
            maxRangeDuration={6}
            selectedRangeStyle={{ backgroundColor: "black" }}
            selectedDayTextStyle={{ color: "white" }}
            textStyle={{ fontWeight: theme.fonts.medium }}
          />
          <Button title={t("dateSelectModal.applyButton")} onPress={onDateSelectionApply} />
        </View>
      </View>
      <CustomAlert
        visible={isAlertVisible}
        onClose={closeAlert}
        title={alertData?.title}
        message={alertData?.content}
        buttons={alertData?.buttons}
      />
    </View>
  );
};

export default dateSelectModal;

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
  content: { flex: 1, marginTop: hp(2), gap: hp(2) },
});