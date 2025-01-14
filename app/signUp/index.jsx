import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import React, { useRef, useState } from "react";
import { useRouter } from "expo-router";
import { hp, wp } from "../../helpers/common";
import ScreenWrapper from "../../components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import { theme } from "../../constants/theme";
import BackButton from "../../components/BackButton";
import Input from "../../components/Input";
import Icon from "../../assets/icons";
import Button from "../../components/Button";
import { supabase } from "../../lib/supabase";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import CustomAlert from "../../components/CustomAlert";

const index = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const emailRef = useRef("");
  const nameRef = useRef("");
  const passwordRef = useRef("");
  const passwordConfirmRef = useRef("");
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

  const onSubmit = async () => {
    if (!emailRef.current || !passwordRef.current || !nameRef.current) {
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

    if (passwordRef.current !== passwordConfirmRef.current) {
      showAlert({
        type: "passwordsNotMatch",
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

    let name = nameRef.current.trim();
    let email = emailRef.current.trim();
    let password = passwordRef.current.trim();

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            email,
          },
        },
      });

      if (data.user && !data?.user?.email_verified) {
        setLoading(false);
        console.log(data.user);
        router.push({ pathname: "/signUp/confirmSignUp", params: { email } });
      }
      if (error) {
        console.log(error);
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
            <BackButton router={router} />

            {/* welcome */}
            <View>
              <Text style={styles.welcomeText}>{t("signUp.welcomeText1")}</Text>
              <Text style={styles.welcomeText}>{t("signUp.welcomeText2")}</Text>
            </View>

            {/* form */}

            <View style={styles.form}>
              <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>
                {t("signUp.formText")}
              </Text>
              <Input
                icon={<Icon name="user" size={26} strokeWidth={1.6} />}
                placeholder={t("signUp.nameInput")}
                autoCapitalize="none"
                onChangeText={(value) => (nameRef.current = value)}
              />
              <Input
                icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
                placeholder={t("signUp.emailInput")}
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

              {/* button */}
              <Button
                title={t("signUp.signUpButtonText")}
                onPress={onSubmit}
                loading={loading}
              />
            </View>

            {/* footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                {t("signUp.signUpFooterText")}
              </Text>
              <Pressable onPress={() => router.push("signIn")}>
                <Text
                  style={[
                    styles.footerText,
                    {
                      color: theme.colors.secondary,
                      fontWeight: theme.fonts.semibold,
                    },
                  ]}
                >
                  {t("signUp.signUpFooterButtonText")}
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

export default index;

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
