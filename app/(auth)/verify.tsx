import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import { verifyAccount, resendOtp } from "@/lib/helper"; // giả sử bạn có hàm resendOtp

const VerifyOTP = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const submit = async () => {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return Alert.alert("Error", "Please enter a valid email.");
    }

    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      return Alert.alert("Error", "Please enter a valid 6-digit OTP.");
    }

    setIsSubmitting(true);
    try {
      await verifyAccount({
        data: { email, otp },
        onSuccess: () => {
          Alert.alert("Success", "Your email has been verified!");
          router.replace("/");
        },
      });
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to verify OTP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return Alert.alert("Error", "Please enter a valid email to resend OTP.");
    }

    setIsResending(true);
    try {
      await resendOtp({
        data: { email },
        onSuccess: () => {
          Alert.alert("Success", "OTP has been resent to your email.");
        },
      });
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          error.message ||
          "Failed to resend OTP."
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <View className="bg-white p-5 mt-5 rounded-lg gap-5">
      <Text className="text-center text-lg font-bold">Verify Your Email</Text>

      {/* Input email */}
      <TextInput
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholder="Enter your email"
        className="border p-3 rounded text-center text-base"
        autoCapitalize="none"
      />

      {/* Resend OTP */}
      <TouchableOpacity
        onPress={handleResend}
        disabled={isResending || !/^\S+@\S+\.\S+$/.test(email)}
        className="self-end"
      >
        {isResending ? (
          <ActivityIndicator size="small" color="#007bff" />
        ) : (
          <Text
            className={`text-primary font-bold ${!/^\S+@\S+\.\S+$/.test(email) ? "opacity-50" : ""}`}
          >
            Resend OTP
          </Text>
        )}
      </TouchableOpacity>

      <TextInput
        value={otp}
        onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, ""))} // chỉ cho nhập số
        keyboardType="number-pad"
        maxLength={6}
        placeholder="Enter OTP"
        className="border p-3 rounded text-center text-xl tracking-widest"
      />

      <CustomButton title="Verify" isLoading={isSubmitting} onPress={submit} />

      <View className="flex justify-center mt-5 flex-row gap-2">
        <Text className="base-regular text-gray-100">
          Already have an account?
        </Text>
        <Link href="/sign-in" className="base-bold text-primary">
          Sign In
        </Link>
      </View>
    </View>
  );
};

export default VerifyOTP;
