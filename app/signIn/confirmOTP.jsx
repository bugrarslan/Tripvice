import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router';
import { verifyOTP } from '../../services/userService';

const confirmOTP = () => {
  const { email } = useLocalSearchParams();
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);
  const router = useRouter();

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
    if (otp.length !== 6) {
      Alert.alert("Hata", "Lütfen 6 haneli bir OTP kodu girin.");
      return;
    }

    try {
      const response = await verifyOTP(email, otp);

      if (response.success) {
        Alert.alert("Başarılı", "OTP doğrulandı.");
        router.replace({ pathname: "/signIn/changePassword", params: { email } });
      } else {
        Alert.alert("Hata", response.msg || "OTP doğrulama başarısız.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Hata", "Bir sorun oluştu. Lütfen tekrar deneyin.");
    }
  };

  const handleResendOtp = async () => {
    try {
      setResendDisabled(true);
      setCountdown(60);

      const response = await sendForgotPasswordMail(email);

      if (response.success) {
        Alert.alert("Başarılı", "Yeni OTP kodu gönderildi.");
      } else {
        Alert.alert("Hata", "OTP tekrar gönderilemedi. Lütfen tekrar deneyin.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Hata", "Bir sorun oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OTP Doğrulama</Text>
      <Text style={styles.subtitle}>Lütfen {email} adresine gönderilen OTP kodunu girin.</Text>
      <TextInput
        style={styles.input}
        placeholder="6 Haneli OTP"
        keyboardType="numeric"
        maxLength={6}
        value={otp}
        onChangeText={setOtp}
      />
      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Doğrula</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.resendButton, resendDisabled && styles.disabled]}
        onPress={handleResendOtp}
        disabled={resendDisabled}
      >
        <Text style={styles.resendButtonText}>Tekrar Gönder</Text>
      </TouchableOpacity>
      <Text style={styles.countdown}>
        {resendDisabled ? `Tekrar gönder: ${countdown}s` : ""}
      </Text>
    </View>
  );
}

export default confirmOTP
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