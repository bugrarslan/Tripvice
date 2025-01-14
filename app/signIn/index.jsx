import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
} from "react-native";
import React, { useRef, useState } from "react";
import { useRouter } from "expo-router";
import { hp, wp } from "../../helpers/common";
import ScreenWrapper from "../../components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import BackButton from "../../components/BackButton";
import { theme } from "../../constants/theme";
import Input from "../../components/Input";
import Icon from "../../assets/icons";
import Button from "../../components/Button";
import { supabase } from "../../lib/supabase";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import CustomAlert from "../../components/CustomAlert";

const signIn = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const emailRef = useRef("");
  const passwordRef = useRef("");

  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  // custom alert
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState({buttons: []});

  const showAlert = (data) => {
    setAlertVisible(true);
    setAlertData(data);
  };

  const closeAlert = () => {
    setAlertVisible(false);
    setAlertData({buttons: []});
  };

  const onSubmit = async () => {
    if (!emailRef.current || !passwordRef.current) {
      showAlert({
        type: "fillAllFields",
        title: t("alert.warning"),
        content: t("alert.fillAllFields"),
        buttons: [
          {
            text: t("alert.ok"),
            onPress: () => closeAlert(),
          },
        ],
      });
      return;
    }

    let email = emailRef.current.trim();
    let password = passwordRef.current.trim();

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      showAlert({
        type: "error",
        title: t("alert.error"),
        content: error.message === "Invalid login credentials" ? t("alert.invalidLoginCredentials") : t("alert.errorOccurred"),
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

            {/* welcome */}
            <View>
              <Text style={styles.welcomeText}>{t("signIn.welcomeText1")}</Text>
              <Text style={styles.welcomeText}>{t("signIn.welcomeText2")}</Text>
            </View>

            {/* form */}
            <View style={styles.form}>
              <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
                {t("signIn.formText")}
              </Text>
              <Input
                icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
                placeholder={t("signIn.emailInput")}
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={(value) => (emailRef.current = value)}
              />
              <Input
                icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
                showPasswordToggle={
                  <Pressable
                    onPress={() => setSecureTextEntry(!secureTextEntry)}
                  >
                    <Ionicons name="eye" size={26} color="black" />
                  </Pressable>
                }
                placeholder={t("signIn.passwordInput")}
                secureTextEntry={secureTextEntry}
                onChangeText={(value) => (passwordRef.current = value)}
              />
              <Pressable onPress={() => router.push("/signIn/forgotPassword")}>
                <Text style={styles.forgotPassword}>
                  {t("signIn.forgotPasswordText")}
                </Text>
              </Pressable>

              {/* button */}

              <Button
                title={t("signIn.signInButtonText")}
                onPress={onSubmit}
                loading={loading}
              />
            </View>

            {/* footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                {t("signIn.signInFooterText")}
              </Text>
              <Pressable onPress={() => router.push("signUp")}>
                <Text
                  style={[
                    styles.footerText,
                    {
                      color: theme.colors.secondary,
                      fontWeight: theme.fonts.semibold,
                    },
                  ]}
                >
                  {t("signIn.signInFooterButtonText")}
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

export default signIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    gap: 45,
    paddingHorizontal: wp(4),
  },
  welcomeText: {
    fontSize: hp(4),
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
  },
  form: {
    gap: 25,
  },
  forgotPassword: {
    textAlign: "right",
    color: theme.colors.text,
    fontSize: hp(1.6),
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
});
