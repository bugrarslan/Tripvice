import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { updateUserPassword } from "../../services/userService";
import CustomAlert from "../../components/CustomAlert";
import { useTranslation } from "react-i18next";
import ScreenWrapper from "../../components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import Input from "../../components/Input";
import Icon from "../../assets/icons";
import { Ionicons } from "@expo/vector-icons";
import Button from "../../components/Button";

const changePassword = () => {
  const { email } = useLocalSearchParams();
  const passwordRef = useRef("");
  const passwordConfirmRef = useRef("");
  const router = useRouter();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  // custom alert
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState({ buttons: [] });

  const showAlert = (data) => {
    setAlertVisible(true);
    setAlertData(data);
  };

  const closeAlert = () => {
    setAlertVisible(false);
    setAlertData({ buttons: [] });
  };

  const handleChangePassword = async () => {
    if (passwordRef.current.length < 8) {
      showAlert({
        type: "warning",
        title: t("alert.warning"),
        content: t("alert.passwordLength"),
        buttons: [
          {
            text: t("alert.ok"),
            onPress: () => closeAlert(),
          },
        ],
      });
      return;
    }

    if (passwordRef.current !== passwordConfirmRef.current) {
      showAlert({
        type: "warning",
        title: t("alert.warning"),
        content: t("alert.passwordsNotMatch"),
        buttons: [
          {
            text: t("alert.ok"),
            onPress: () => closeAlert(),
          },
        ],
      });
      return;
    }

    try {
      setLoading(true);
      const response = await updateUserPassword(passwordRef.current);

      if (response.success) {
        setLoading(false);
        showAlert({
          type: "success",
          title: t("alert.success"),
          content: t("changePassword.passwordChanged"),
          buttons: [
            {
              text: t("alert.ok"),
              onPress: () => {
                closeAlert();
                router.replace("/");
              },
            },
          ],
        });
        router.replace("/");
      } else {
        setLoading(false);
        showAlert({
          type: "error",
          title: t("alert.error"),
          content: t("alert.errorOccurred"),
          buttons: [
            {
              text: t("alert.ok"),
              onPress: () => closeAlert(),
            },
          ],
        });
        return;
      }
    } catch (error) {
      setLoading(false);
      showAlert({
        type: "error",
        title: t("alert.error"),
        content: t("alert.errorOccurred"),
        buttons: [
          {
            text: t("alert.ok"),
            onPress: () => closeAlert(),
          },
        ],
      });
      return;
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScreenWrapper backgroundColor={"white"}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <StatusBar style="dark" />
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            bounces={false}
            overScrollMode="never"
          >
            <View style={styles.form}>
              <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
                {email} {t("changePassword.text")}
              </Text>

              <Input
                icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
                showPasswordToggle={
                  <Pressable
                    onPress={() => setSecureTextEntry(!secureTextEntry)}
                  >
                    <Ionicons name="eye" size={26} color="black" />
                  </Pressable>
                }
                placeholder={t("signUp.passwordInput")}
                secureTextEntry={secureTextEntry}
                onChangeText={(value) => (passwordRef.current = value)}
              />
              <Input
                icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
                placeholder={t("signUp.confirmPasswordInput")}
                secureTextEntry={secureTextEntry}
                onChangeText={(value) => (passwordConfirmRef.current = value)}
              />

              <Button
                title={t("changePassword.button")}
                onPress={handleChangePassword}
                loading={loading}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        {/* custom alert */}
        <CustomAlert
          visible={isAlertVisible}
          onClose={closeAlert}
          title={alertData?.title}
          message={alertData?.content}
          buttons={alertData?.buttons}
        />
      </ScreenWrapper>
    </TouchableWithoutFeedback>
  );
};

export default changePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    gap: 45,
    paddingHorizontal: wp(4),
  },
  form: {
    gap: 25,
  },
});
