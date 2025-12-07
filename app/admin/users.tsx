// app/(admin)/users.tsx
import React, { useState } from 'react';

import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInput';
import { Ionicons } from '@expo/vector-icons'; // Sử dụng Ionicons

interface User {
  id: string;
  email: string;
  role: "admin" | "user" | "shipper";
}

const mockUsers: User[] = [
  { id: "1", email: "admin@example.com", role: "admin" },
  { id: "2", email: "john@example.com", role: "user" },
  { id: "3", email: "shipper1@delivery.com", role: "shipper" },
  { id: "4", email: "anna@example.com", role: "user" },
  { id: "5", email: "shipper2@delivery.com", role: "shipper" },
];

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [form, setForm] = useState({ email: "", password: "" });

  const updateRole = (id: string, role: "admin" | "user") => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    Alert.alert("Thành công", `Đã cập nhật role thành ${role}`);
  };

  const deleteShipper = (id: string) => {
    Alert.alert("Xác nhận", "Xóa shipper này?", [
      { text: "Hủy" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: () => {
          setUsers((prev) => prev.filter((u) => u.id !== id));
          Alert.alert("Đã xóa", "Shipper đã bị xóa");
        },
      },
    ]);
  };

  const createShipper = () => {
    const { email, password } = form;
    if (!email || !password || !email.includes("@")) {
      return Alert.alert("Lỗi", "Email hoặc mật khẩu không hợp lệ");
    }
    const newShipper: User = {
      id: Date.now().toString(),
      email,
      role: "shipper",
    };
    setUsers((prev) => [...prev, newShipper]);
    setForm({ email: "", password: "" });
    Alert.alert("Thành công", "Tạo shipper thành công");
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-5">
      <View className="flex-row items-center gap-2 mb-6">
        <Ionicons name="people-outline" size={24} color="#6b7280" />
        <Text className="text-2xl font-bold">Quản lý người dùng</Text>
      </View>

      {/* Danh sách người dùng */}
      <View className="bg-white rounded-2xl p-5 mb-6">
        {users.map((user) => (
          <View
            key={user.id}
            className="flex-row justify-between items-center py-4 border-b border-gray-100 last:border-0"
          >
            <View>
              <Text className="font-medium">{user.email}</Text>
              <Text
                className={`text-xs font-bold ${
                  user.role === "admin"
                    ? "text-purple-600"
                    : user.role === "shipper"
                      ? "text-emerald-600"
                      : "text-gray-500"
                }`}
              >
                {user.role.toUpperCase()}
              </Text>
            </View>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => updateRole(user.id, "admin")}
                className="bg-purple-600 px-3 py-1 rounded"
              >
                <Text className="text-white text-xs">Admin</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => updateRole(user.id, "user")}
                className="bg-blue-600 px-3 py-1 rounded"
              >
                <Text className="text-white text-xs">User</Text>
              </TouchableOpacity>
              {user.role === "shipper" && (
                <TouchableOpacity
                  onPress={() => deleteShipper(user.id)}
                  className="bg-red-600 px-3 py-1 rounded"
                >
                  <Text className="text-white text-xs">Xóa</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </View>

      {/* Tạo shipper */}
      <View className="bg-white rounded-2xl p-5">
        <View className="flex-row items-center gap-2 mb-3">
          <Ionicons name="car-sport-outline" size={20} color="#10b981" />
          <Text className="text-lg font-bold">Tạo tài khoản shipper</Text>
        </View>
        <CustomInput
          placeholder="email@shipper.com"
          value={form.email}
          onChangeText={(t) => setForm((p) => ({ ...p, email: t }))}
          label="Email"
          keyboardType="email-address"
        />
        <CustomInput
          placeholder="Mật khẩu"
          value={form.password}
          onChangeText={(t) => setForm((p) => ({ ...p, password: t }))}
          label="Mật khẩu"
          secureTextEntry
        />
        <CustomButton title="Tạo Shipper" onPress={createShipper} />
      </View>
    </ScrollView>
  );
}
