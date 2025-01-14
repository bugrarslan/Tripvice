import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { sendForgotPasswordMail, verifyOTP } from "../../services/userService";
import ScreenWrapper from "../../components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import BackButton from "../../components/BackButton";
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Icon from "../../assets/icons";
import { useTranslation } from "react-i18next";
import CustomAlert from "../../components/CustomAlert";

const confirmSignUp = () => {
  const { email } = useLocalSearchParams();
  const otpRef = useRef("");
  const [countdown, setCountdown] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();

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

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    } else {
      setResendDisabled(false);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerify = async () => {
    setLoading(true);

    if (otpRef.current.length !== 6) {
      showAlert({
        type: "inValid",
        title: t("alert.warning"),
        content: t("alert.emptyOTP"),
        buttons: [
          {
            text: t("alert.ok"),
            onPress: () => closeAlert(),
          },
        ],
      });
      setLoading(false);
      return;
    }

    try {
      const response = await verifyOTP(email, otpRef.current);
      if (response.success) {
        setLoading(false);
      } else {
        setLoading(false);
        showAlert({
          type: "error",
          title: t("alert.error"),
          content: t("alert.wrongOTP"),
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

  const handleResendOtp = async () => {
    try {
      const response = await sendForgotPasswordMail(email);

      if (response.success) {
        setResendDisabled(true);
        setCountdown(60);
        showAlert({
          type: "success",
          title: t("alert.success"),
          content: t("alert.resendOTP"),
          buttons: [
            {
              text: t("alert.ok"),
              onPress: () => closeAlert(),
            },
          ],
        });
        return;
      } else {
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
            <BackButton router={router} />
            <View style={styles.form}>
              <Text
                style={{
                  fontSize: hp(1.5),
                  color: theme.colors.text,
                  textAlign: "center",
                }}
              >
                {t("confirmSignUp.text1")} {email} {t("confirmSignUp.text2")}
              </Text>
              <Input
                icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
                placeholder={t("confirmSignUp.placeholder")}
                keyboardType="numeric"
                autoCapitalize="none"
                maxLength={6}
                onChangeText={(value) => (otpRef.current = value)}
              />
              <Button
                title={t("confirmSignUp.button")}
                onPress={handleVerify}
                loading={loading}
              />
            </View>

            {/* footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                {t("confirmSignUp.footerText")}
              </Text>
              <Pressable onPress={handleResendOtp} disabled={resendDisabled}>
                <Text
                  style={[
                    styles.footerText,
                    resendDisabled
                      ? { color: theme.colors.secondary }
                      : { color: theme.colors.primaryDark },
                    {
                      fontWeight: theme.fonts.semibold,
                    },
                  ]}
                >
                  {t("confirmSignUp.footerButton")}{" "}
                  {resendDisabled ? `(${countdown})` : ""}
                </Text>
              </Pressable>
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

export default confirmSignUp;

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
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  footerText: {
    color: theme.colors.text,
    textAlign: "center",
    fontSize: hp(1.6),
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 18,
    backgroundColor: "#fff",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  resendButton: {
    marginTop: 10,
  },
  resendButtonText: {
    color: "#007bff",
    fontSize: 16,
  },
  disabled: {
    opacity: 0.5,
  },
  countdown: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
  },
});
