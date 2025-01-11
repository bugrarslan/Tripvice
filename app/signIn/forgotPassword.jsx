import React, { useRef, useState } from "react";
import {
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

const forgotPassword = () => {
  const router = useRouter();
  const emailRef = useRef("");
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!emailRef.current) {
      return;
    }
    setLoading(true);
    const res = await sendForgotPasswordMail(emailRef.current);
    if (res?.success) {
      setLoading(false);
      console.log(res.data);
      router.push({
        pathname: "/signIn/confirmOTP",
        params: { email: emailRef.current },
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScreenWrapper backgroundColor="white">
        <View style={styles.container}>
          <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <StatusBar style="dark" />
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              keyboardShouldPersistTaps="handled"
              bounces={false} // for iOS
              overScrollMode="never" // for Android
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
                  Lütfen şifrenizi sıfırlamak için e-posta adresinizi giriniz.
                </Text>
                <Input
                  icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
                  placeholder={t("signIn.emailInput")}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={(value) => (emailRef.current = value)}
                />
                <Button
                  title={t("signIn.signInButtonText")}
                  onPress={onSubmit}
                  loading={loading}
                />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
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
