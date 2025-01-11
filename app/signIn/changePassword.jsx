import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { updateUserPassword } from "../../services/userService";

const changePassword = () => {
  const { email } = useLocalSearchParams(); // Kullanıcı email'i önceki ekrandan gönderilmeli.
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleChangePassword = async () => {
    if (newPassword.length < 8) {
      Alert.alert("Hata", "Şifreniz en az 8 karakter olmalı.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Hata", "Şifreler eşleşmiyor.");
      return;
    }

    try {
      const response = await updateUserPassword(newPassword);

      if (response.success) {
        Alert.alert("Başarılı", "Şifreniz başarıyla değiştirildi.");
        router.replace("/");
      } else {
        Alert.alert("Hata", response.msg || "Şifre değiştirme başarısız.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Hata", "Bir sorun oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Şifre Değiştir</Text>
      <Text style={styles.subtitle}>
        {email} adresi için yeni bir şifre belirleyin.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Yeni Şifre"
        secureTextEntry={true}
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Yeni Şifreyi Tekrar Girin"
        secureTextEntry={true}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Şifreyi Değiştir</Text>
      </TouchableOpacity>
    </View>
  );
};

export default changePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
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
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
