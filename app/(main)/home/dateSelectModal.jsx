import { StyleSheet, Text, View, Platform, Alert } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { hp, wp } from "../../../helpers/common";
import { theme } from "../../../constants/theme";
import { Calendar, LocaleConfig } from "react-native-calendars";
import moment from "moment";
import Button from "../../../components/Button";
import Header from "../../../components/Header";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { setTripData } from "../../../contexts/redux/slices/tripSlice";
import CustomAlert from "../../../components/CustomAlert";

// Yerelleştirme ayarları
LocaleConfig.locales["tr"] = {
  monthNames: [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ],
  monthNamesShort: [
    "Oca.",
    "Şub.",
    "Mar.",
    "Nis.",
    "May.",
    "Haz.",
    "Tem.",
    "Ağu.",
    "Eyl.",
    "Eki.",
    "Kas.",
    "Ara.",
  ],
  dayNames: [
    "Pazar",
    "Pazartesi",
    "Salı",
    "Çarşamba",
    "Perşembe",
    "Cuma",
    "Cumartesi",
  ],
  dayNamesShort: ["Paz.", "Pzt.", "Sal.", "Çar.", "Per.", "Cum.", "Cmt."],
  today: "Bugün",
};

LocaleConfig.locales["en"] = LocaleConfig.locales[""]; // Varsayılan İngilizce
LocaleConfig.defaultLocale = "tr";

const dateSelectModal = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 5 : 30;
  const ios = Platform.OS === "ios";
  const tripData = useSelector((state) => state.trip.tripData);
  const dispatch = useDispatch();
  // Dil değişikliği için yerelleştirme ayarı
  LocaleConfig.defaultLocale = i18n.language === "tr" ? "tr" : "en";

  // custom alert
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState({ buttons: [] });
  const [markedDates, setMarkedDates] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const showAlert = (data) => {
    setAlertVisible(true);
    setAlertData(data);
  };

  const closeAlert = () => {
    setAlertVisible(false);
    setAlertData({ buttons: [] });
  };

  const onDayPress = (day) => {
    const date = day.dateString;

    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
      setMarkedDates({
        [date]: {
          startingDay: true,
          endingDay: true,
          color: theme.colors.primary,
        },
      });
    } else {
      const range = getDatesBetween(startDate, date);
      const newMarkedDates = {};
      range.forEach((d, index) => {
        newMarkedDates[d] = {
          startingDay: index === 0,
          endingDay: index === range.length - 1,
          color: theme.colors.primary,
          textColor: "white",
        };
      });
      setEndDate(date);
      setMarkedDates(newMarkedDates);
    }
  };

  // Yardımcı fonksiyon: Tarih aralığını hesaplar
  const getDatesBetween = (start, end) => {
    const range = [];
    let currentDate = moment(start);
    const endDate = moment(end);

    while (currentDate <= endDate) {
      range.push(currentDate.format("YYYY-MM-DD"));
      currentDate = currentDate.add(1, "day");
    }
    return range;
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

    const totalNoOfDays = moment(endDate).diff(moment(startDate), "days") + 1;
    dispatch(
      setTripData({
        ...tripData,
        dateInfo: {
          startDate: startDate,
          endDate: endDate,
          totalNoOfDays: totalNoOfDays,
        },
      })
    );
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
        <Header title={t("dateSelectModal.headerTitle")} showCloseButton />
        {/* content */}
        <View style={styles.content}>
          <Calendar
            markingType={"period"}
            markedDates={markedDates}
            minDate={moment().format("YYYY-MM-DD")}
            onDayPress={onDayPress}
            monthFormat={"MMMM yyyy"}
            // locale={currentLanguage}
            theme={{
              todayTextColor: theme.colors.primary,
              selectedDayBackgroundColor: theme.colors.primary,
              selectedDayTextColor: "white",
              arrowColor: theme.colors.primary,
              textDayFontWeight: theme.fonts.medium,
              textMonthFontWeight: theme.fonts.bold,
              textDayHeaderFontWeight: theme.fonts.medium,
              textDayFontSize: 14,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 12,
            }}
          />
          <Button
            title={t("dateSelectModal.applyButton")}
            onPress={onDateSelectionApply}
          />
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
