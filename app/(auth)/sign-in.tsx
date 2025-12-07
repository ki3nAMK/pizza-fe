import React, { useState } from "react";

import { Link, useRouter } from "expo-router";
import { Alert, Text, View } from "react-native";
import JSEncrypt from "jsencrypt";

import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { signInWithServer } from "@/lib/helper";
import * as Sentry from "@sentry/react-native";
import systemService from "@/services/system.service";

export enum Role {
  ADMIN = "ADMIN",
  CLIENT = "CLIENT",
  SHIPPER = "SHIPPER",
}

function encryptPassword(password: string, systemPublicKey: string): string {
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(systemPublicKey);

  const encrypted = encryptor.encrypt(password);
  if (!encrypted) throw new Error("Encryption failed");
  return encrypted;
}

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const router = useRouter();

  const submit = async () => {
    const { email, password } = form;

    if (!email || !password)
      return Alert.alert(
        "Error",
        "Please enter valid email address & password."
      );

    setIsSubmitting(true);

    try {
      const { publicKey } = await systemService.getPublickey();

      await signInWithServer({
        username: email,
        password: encryptPassword(password, publicKey),
        onSuccess: (user) => {
          router.replace(
            user.role === Role.ADMIN
              ? "/admin/home"
              : user.role === Role.SHIPPER
                ? "/shipper/home"
                : "/"
          );
        },
      });
    } catch (error: any) {
      Alert.alert("Error", error.message);
      Sentry.captureEvent(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="gap-10 bg-white rounded-lg p-5 mt-5">
      <CustomInput
        placeholder="Enter your email"
        value={form.email}
        onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
        label="Email"
        keyboardType="email-address"
      />
      <CustomInput
        placeholder="Enter your password"
        value={form.password}
        onChangeText={(text) =>
          setForm((prev) => ({ ...prev, password: text }))
        }
        label="Password"
        secureTextEntry={true}
      />

      <CustomButton title="Sign In" isLoading={isSubmitting} onPress={submit} />

      <View className="flex justify-center mt-5 flex-row gap-2">
        <Text className="base-regular text-gray-100">
          Don't have an account?
        </Text>
        <Link href="/sign-up" className="base-bold text-primary">
          Sign Up
        </Link>
      </View>

      <View className="flex justify-center mt-5 flex-row gap-2">
        <Text className="base-regular text-gray-100">
          Already have an account but not verified?
        </Text>
        <Link href="/verify" className="base-bold text-primary">
          Verify
        </Link>
      </View>
    </View>
  );
};

export default SignIn;
