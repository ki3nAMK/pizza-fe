import React from 'react';

import {
  Redirect,
  Slot,
} from 'expo-router';
import { isNil } from 'lodash';
import {
  Dimensions,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';

import { images } from '@/constants';
import useAuthStore from '@/store/auth.store';

export enum Role {
  ADMIN = "ADMIN",
  CLIENT = "CLIENT",
  SHIPPER = "SHIPPER",
}

export default function AuthLayout() {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && !isNil(user)) {
    return (
      <Redirect
        href={
          user.role === Role.ADMIN
            ? "/admin/home"
            : user.role === Role.SHIPPER
              ? "/shipper/home"
              : "/"
        }
      />
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        className="bg-white h-full"
        keyboardShouldPersistTaps="handled"
      >
        <View
          className="w-full relative"
          style={{ height: Dimensions.get("screen").height / 2.25 }}
        >
          <ImageBackground
            source={images.loginGraphic}
            className="size-full rounded-b-lg"
            resizeMode="stretch"
          />
          <Image
            source={images.logo}
            className="self-center size-48 absolute -bottom-16 z-10"
          />
        </View>
        <Slot />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
