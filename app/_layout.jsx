import { Stack, useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { getUserData } from "../services/userService";
import { I18nextProvider } from "react-i18next";
import i18n from "../services/i18nService";
import "react-native-get-random-values";
import { Provider, useDispatch } from "react-redux";
import store from "../contexts/redux/store";
import { setAuth, clearAuth } from "../contexts/redux/slices/authSlice";

const _layout = () => {
  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <MainLayout />
      </I18nextProvider>
    </Provider>
  );
};

const MainLayout = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        dispatch(setAuth(session?.user));
        updateUserData(session?.user);
        router.replace("/(main)/home");
      } else {
        dispatch(clearAuth());
        router.replace("/welcome");
      }
    });
  }, []);

  const updateUserData = async (user) => {
    let res = await getUserData(user?.id);
    if (res?.success) {
      dispatch(setAuth({ ...res.data }));
    }
  };

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="signIn" />
      <Stack.Screen name="signUp" />
      <Stack.Screen name="(main)" />
    </Stack>
  );
};

export default _layout;
