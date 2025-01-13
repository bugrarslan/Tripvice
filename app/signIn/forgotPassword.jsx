import React, { useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import ScreenWrapper from "../../components/ScreenWrapper";
import { hp, wp } from "../../helpers/common";
import { StatusBar } from "expo-status-bar";
import BackButton from "../../components/BackButton";
import { theme } from "../../constants/theme";
import Input from "../../components/Input";
import Icon from "../../assets/icons";
import { useTranslation } from "react-i18next";
import Button from "../../components/Button";
import { sendForgotPasswordMail } from "../../services/userService";
import CustomAlert from "../../components/CustomAlert";

const forgotPassword = () => {
  const router = useRouter();
  const emailRef = useRef("");
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

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

  const onSubmit = async () => {
    if (!emailRef.current) {
      return;
    }
    setLoading(true);
    try {
      const res = await sendForgotPasswordMail(emailRef.current);

      if (res?.success) {
        setLoading(false);
        router.push({
          pathname: "/signIn/confirmOTP",
          params: { email: emailRef.current },
        });
      } else {
        setLoading(false);
        showAlert({
          type: "error",
          title: t("alert.warning"),
          content: t("forgotPassword.wait10sec"),
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
      <ScreenWrapper backgroundColor="white">
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
            <BackButton router={router} />
            <View style={styles.form}>
              <Text
                style={{
                  fontSize: hp(1.5),
                  color: theme.colors.text,
                  textAlign: "center",
                }}
              >
                {t("forgotPassword.text")}
              </Text>
              <Input
                icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
                placeholder={t("signIn.emailInput")}
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={(value) => (emailRef.current = value)}
              />
              <Button
                title={t("forgotPassword.button")}
                onPress={onSubmit}
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

export default forgotPassword;

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
