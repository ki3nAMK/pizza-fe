import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import adminService from "@/services/admin.service";

const SettingScreen = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    maxLoginRetry: "",
    loginTimeout: "",
    maxResendOtp: "",
    resendOtpTimeout: "",
    accessTokenExpiresIn: "",
    refreshTokenExpiresIn: "",
  });

  const fetchSettings = async () => {
    try {
      const data = await adminService.getSettings();

      console.log(data);

      setForm({
        maxLoginRetry: data.maxLoginRetry.toString(),
        loginTimeout: data.loginTimeout.toString(),
        maxResendOtp: data.maxResendOtp.toString(),
        resendOtpTimeout: data.resendOtpTimeout.toString(),
        accessTokenExpiresIn: data.accessTokenExpiresIn.toString(),
        refreshTokenExpiresIn: data.refreshTokenExpiresIn.toString(),
      });
    } catch (e) {
      console.log(e);
      Alert.alert("Lỗi", "Không thể tải cài đặt.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        maxLoginRetry: Number(form.maxLoginRetry),
        loginTimeout: Number(form.loginTimeout),
        maxResendOtp: Number(form.maxResendOtp),
        resendOtpTimeout: Number(form.resendOtpTimeout),
        accessTokenExpiresIn: Number(form.accessTokenExpiresIn),
        refreshTokenExpiresIn: Number(form.refreshTokenExpiresIn),
      };

      await adminService.updateSettings(payload);

      Alert.alert("Thành công", "Cập nhật cài đặt thành công!");
    } catch (err: any) {
      console.log(err);
      Alert.alert("Lỗi cập nhật", JSON.stringify(err.response?.data || err));
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-900">
        <ActivityIndicator size="large" color="white" />
        <Text className="text-gray-300 mt-2">Đang tải...</Text>
      </View>
    );
  }

  const renderInput = (
    label: string,
    field: keyof typeof form,
    min?: number
  ) => (
    <View className="mb-4">
      <Text className="text-gray-300 mb-1">{label}</Text>
      <TextInput
        className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white"
        keyboardType="numeric"
        value={form[field]}
        onChangeText={(v) => setForm({ ...form, [field]: v })}
        placeholder={`Nhập ${label}`}
        placeholderTextColor="#6b7280"
      />
      {min && (
        <Text className="text-xs text-gray-500 mt-1">
          Giá trị tối thiểu: {min}
        </Text>
      )}
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-gray-900 p-5">
      <Text className="text-xl font-bold text-white mb-4">Cài đặt bảo mật</Text>

      {renderInput("Số lần đăng nhập tối đa", "maxLoginRetry", 1)}
      {renderInput(
        "Thời gian khóa sau khi vượt số lần đăng nhập (giây)",
        "loginTimeout",
        60
      )}
      {renderInput("Số lần gửi lại OTP tối đa", "maxResendOtp", 1)}
      {renderInput("Thời gian chờ gửi lại OTP (giây)", "resendOtpTimeout", 60)}
      {renderInput("Số ngày hết hạn Access Token", "accessTokenExpiresIn", 1)}
      {renderInput("Số ngày hết hạn Refresh Token", "refreshTokenExpiresIn", 1)}

      <TouchableOpacity
        disabled={saving}
        onPress={handleSave}
        className="bg-blue-600 p-4 rounded-xl mt-4 flex-row items-center justify-center"
      >
        {saving ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <Ionicons name="save-outline" size={20} color="white" />
            <Text className="text-white font-semibold ml-2">Lưu thay đổi</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SettingScreen;
