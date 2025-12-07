import "./globals.css";

import React, { useEffect } from "react";

import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";

import useAuthStore from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { useShipperStore } from "@/store/shipper.store";
import * as Sentry from "@sentry/react-native";
import Toast from "react-native-toast-message";
import { useClientSocket } from "@/hooks/useClientSocket";

export enum Role {
  ADMIN = "ADMIN",
  CLIENT = "CLIENT",
  SHIPPER = "SHIPPER",
}

Sentry.init({
  dsn: "https://94edd17ee98a307f2d85d750574c454a@o4506876178464768.ingest.us.sentry.io/4509588544094208",

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Configure Session Replay
  replaysSessionSampleRate: 1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

export default Sentry.wrap(function RootLayout() {
  const { isLoading, fetchAuthenticatedUser, user } = useAuthStore();
  const { fetchAllOrder } = useCartStore();
  const { fetchPendingOrders } = useShipperStore();

  const [fontsLoaded, error] = useFonts({
    "QuickSand-Bold": require("../assets/fonts/Quicksand-Bold.ttf"),
    "QuickSand-Medium": require("../assets/fonts/Quicksand-Medium.ttf"),
    "QuickSand-Regular": require("../assets/fonts/Quicksand-Regular.ttf"),
    "QuickSand-SemiBold": require("../assets/fonts/Quicksand-SemiBold.ttf"),
    "QuickSand-Light": require("../assets/fonts/Quicksand-Light.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  useEffect(() => {
    fetchAuthenticatedUser().then(() => {
      if (user?.role === Role.SHIPPER) {
        fetchPendingOrders();
      }
    });

    fetchAllOrder();
  }, []);

  useClientSocket();

  if (!fontsLoaded || isLoading) return null;

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <Toast />
    </>
  );
});

// Sentry.showFeedbackWidget();
