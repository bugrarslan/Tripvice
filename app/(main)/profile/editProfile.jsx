import { Pressable, ScrollView, Text, View, StyleSheet } from "react-native";
import ScreenWrapper from "../../../components/ScreenWrapper";
import Header from "../../../components/Header";
import Icon from "../../../assets/icons";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { theme } from "../../../constants/theme";
import { hp, wp } from "../../../helpers/common";
import { Image } from "expo-image";
import { useSelector, useDispatch } from "react-redux";
import { setAuth } from "../../../contexts/redux/slices/authSlice";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { getUserImageSrc, uploadFile } from "../../../services/imageService";
import { updateUserData } from "../../../services/userService";
import { useTranslation } from "react-i18next";
import CustomAlert from "../../../components/CustomAlert";

const editProfile = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [user, setUser] = useState({
    name: "",
    address: "",
    image: null,
    phoneNumber: "",
    bio: "",
  });
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

  useEffect(() => {
    if (currentUser) {
      setUser({
        name: currentUser.name || "",
        address: currentUser.address || "",
        image: currentUser.image || null,
        phoneNumber: currentUser.phoneNumber || "",
        bio: currentUser.bio || "",
      });
    }
  }, []);

  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setUser({ ...user, image: result.assets[0] });
    }
  };

  const onsubmit = async () => {
    let userData = { ...user };
    let { name, phoneNumber, address, bio, image } = userData;
    if (!name || !phoneNumber || !address || !bio || !image) {
      showAlert({
        type: "error",
        title: t("alert.error"),
        content: t("alert.errorOccurred"),
      });
      return;
    }
    setLoading(true);

    if (typeof image === "object") {
      // TODO: upload image
      let imageRes = await uploadFile("profiles", image?.uri);
      if (imageRes.success) userData.image = imageRes.data;
      else userData.image = null;
    }
    const res = await updateUserData(currentUser?.id, userData);
    setLoading(false);
    if (res.success) {
      dispatch(setAuth({ ...currentUser, ...userData }));
    }
    router.back();
  };

  const imageSource =
    user.image && typeof user.image === "object"
      ? user.image.uri
      : getUserImageSrc(user.image);

  return (
    <ScreenWrapper backgroundColor={"white"}>
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          <Header title={"Edit Profile"} showBackButton />

          {/* form */}
          <View style={styles.form}>
            <View style={styles.avatarContainer}>
              <Image style={styles.avatar} source={imageSource} />
              <Pressable style={styles.cameraIcon} onPress={onPickImage}>
                <Icon name="camera" size={20} strokeWidth={2.5} />
              </Pressable>
            </View>

            <Text
              style={{
                fontSize: hp(1.5),
                color: theme.colors.text,
                fontWeight: theme.fonts.semibold,
              }}
            >
              {t("editProfile.formText")}
            </Text>
            <Input
              icon={<Icon name="user" />}
              placeholder={t("editProfile.nameInput")}
              value={user.name}
              onChangeText={(value) => setUser({ ...user, name: value })}
            />
            <Input
              icon={<Icon name="call" />}
              placeholder={t("editProfile.phoneInput")}
              value={user.phoneNumber}
              onChangeText={(value) => setUser({ ...user, phoneNumber: value })}
            />
            <Input
              icon={<Icon name="location" />}
              placeholder={t("editProfile.addressInput")}
              value={user.address}
              onChangeText={(value) => setUser({ ...user, address: value })}
            />
            <Input
              placeholder={t("editProfile.bioInput")}
              value={user.bio}
              multiline
              containerStyle={styles.bio}
              onChangeText={(value) => setUser({ ...user, bio: value })}
            />

            <Button
              title={t("editProfile.updateButton")}
              loading={loading}
              onPress={onsubmit}
            />
          </View>
        </ScrollView>
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

export default editProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
    paddingBottom: hp(12),
  },
  avatarContainer: {
    height: hp(14),
    width: hp(14),
    alignSelf: "center",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: theme.radius.xxl,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: theme.colors.darkLight,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: -10,
    backgroundColor: "white",
    padding: 8,
    borderRadius: 50,
    shadowColor: theme.colors.textLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7,
  },
  form: {
    gap: hp(2),
    marginTop: 20,
  },
  bio: {
    flexDirection: "row",
    height: hp(15),
    alignItems: "flex-start",
    paddingVertical: 15,
  },
});
