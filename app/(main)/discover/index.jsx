import { StyleSheet, View } from "react-native";
import React from "react";
import ScreenWrapper from "../../../components/ScreenWrapper";
import Button from "../../../components/Button";
import { supabase } from "../../../lib/supabase";
import { StatusBar } from "expo-status-bar";
import { wp } from "../../../helpers/common";
import { useTranslation } from "react-i18next";

const index = () => {
  const { t } = useTranslation();

  return (
    <ScreenWrapper backgroundColor={"white"}>
      <View style={styles.container}>
        <StatusBar style="dark" />
        <Button
          title={t("discover.signOut")}
          onPress={() => supabase.auth.signOut()}
        />
      </View>
    </ScreenWrapper>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: wp(5),
  },
});
