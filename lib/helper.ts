import authService from "@/services/auth.service";
import useAuthStore from "@/store/auth.store";
import { User } from "@/type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export const saveToken = async (accessToken: string, refreshToken: string) => {
  try {
    await AsyncStorage.setItem("accessToken", accessToken);
    await AsyncStorage.setItem("refreshToken", refreshToken);
  } catch (e) {
    console.log("Failed to save token", e);
  }
};

export const getAccessToken = async () => {
  return await AsyncStorage.getItem("accessToken");
};

export const getRefreshToken = async () => {
  return await AsyncStorage.getItem("refreshToken");
};

export const removeTokens = async () => {
  await AsyncStorage.removeItem("accessToken");
  await AsyncStorage.removeItem("refreshToken");
};

export const signInWithServer = async ({
  username,
  password,
  onSuccess,
}: {
  username: string;
  password: string;
  onSuccess: (user: User) => void;
}) => {
  const { setUser, setIsAuthenticated } = useAuthStore.getState(); // lấy store

  try {
    const res = await authService.login({ username, password });

    await saveToken(res.accessToken, res.refreshToken);

    const user = await authService.getMe();

    if (user) {
      setUser(user);
      setIsAuthenticated(true);
    }

    onSuccess(user);

    return res;
  } catch (e: any) {
    throw new Error(e.message);
  }
};

export const signUpWithServer = async ({
  data,
  onSuccess,
}: {
  data: { email: string; name: string; password: string };
  onSuccess: () => void;
}) => {
  const { email, name, password } = data;

  try {
    const res = await authService.register({ email, name, password });

    onSuccess();
    return res;
  } catch (e: any) {
    throw new Error(e.message);
  }
};

export const verifyAccount = async ({
  data,
  onSuccess,
}: {
  data: { email: string; otp: string };
  onSuccess: () => void;
}) => {
  const { email, otp } = data;

  try {
    const res = await authService.verifyEmail({ email, otp });

    onSuccess();
    return res;
  } catch (e: any) {
    throw new Error(e.message);
  }
};

export const resendOtp = async ({
  data,
  onSuccess,
}: {
  data: { email: string };
  onSuccess: () => void;
}) => {
  const { email } = data;

  try {
    const res = await authService.resendEmail({ email });

    onSuccess();
    return res;
  } catch (e: any) {
    Alert.alert(
      "Error",
      e.response?.data?.message || e.message || "Failed to resend OTP."
    );
  }
};
