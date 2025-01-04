import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import ScreenWrapper from "../../../components/ScreenWrapper";
import { useRouter } from "expo-router";
import Button from "../../../components/Button";
import { hp, wp } from "../../../helpers/common";
import { StatusBar } from "expo-status-bar";
import TripPreviewButton from "../../../components/TripPreviewButton";
import moment from "moment";
import Header from "../../../components/Header";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import CustomAlert from "../../../components/CustomAlert";

const createTrip = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const tripData = useSelector((state) => state.trip.tripData);

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

  const onSubmitDestination = () => {
    router.push("/(main)/home/destinationSelectModal");
  };
  const onSubmitCompanion = () => {
    router.push("/(main)/home/companionSelectModal");
  };
  const onSubmitDate = () => {
    router.push("/(main)/home/dateSelectModal");
  };
  const onSubmitBudget = () => {
    router.push("/(main)/home/budgetSelectModal");
  };
  const handleCreate = () => {
    if (
      tripData?.locationInfo &&
      tripData?.companionInfo &&
      tripData?.dateInfo &&
      tripData?.budgetInfo
    ) {
      router.push("/(main)/home/loading");
    } else {
      showAlert({
        type: "error",
        title: t("alert.warning"),
        content: t("alert.fillAllDetails"),
        buttons: [
          {
            text: t("alert.ok"),
            onPress: () => {
              closeAlert();
            },
          },
        ],
      });
    }
  };

  return (
    <ScreenWrapper backgroundColor={"white"}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <Header
          title={t("createTrip.headerTitle")}
          showBackButton
          isResetContext
        />
        <View style={styles.content}>
          <TripPreviewButton
            title={t("createTrip.destination")}
            content={tripData?.locationInfo?.name}
            onPress={onSubmitDestination}
            icon={"location-sharp"}
          />
          <TripPreviewButton
            title={t("createTrip.companion")}
            content={tripData?.companionInfo?.title}
            onPress={onSubmitCompanion}
            icon={"people-sharp"}
          />
          <TripPreviewButton
            title={t("createTrip.days")}
            content={
              tripData?.dateInfo?.totalNoOfDays &&
              moment(tripData?.dateInfo?.startDate).format("DD MMM") +
                " - " +
                moment(tripData?.dateInfo?.endDate).format("DD MMM") +
                " (" +
                tripData?.dateInfo?.totalNoOfDays +
                " days)"
            }
            onPress={onSubmitDate}
            icon={"calendar-sharp"}
          />
          <TripPreviewButton
            title={t("createTrip.budget")}
            content={tripData?.budgetInfo?.title}
            onPress={onSubmitBudget}
            icon={"cash-sharp"}
          />
          <Button title={t("createTrip.createButton")} onPress={handleCreate} />
        </View>
      </View>
      <CustomAlert
        visible={isAlertVisible}
        onClose={closeAlert}
        title={alertData?.title}
        message={alertData?.content}
        buttons={alertData?.buttons}
      />
    </ScreenWrapper>
  );
};

export default createTrip;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingHorizontal: wp(4),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  content: { flex: 1, marginTop: hp(2), gap: hp(2) },
});
