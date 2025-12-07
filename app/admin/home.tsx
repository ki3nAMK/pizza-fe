// app/(admin)/home.tsx
import React from "react";

import { ScrollView, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

const StatCard = ({ icon, label, value, color }: any) => (
  <View className={`${color} p-5 rounded-2xl shadow-sm`}>
    <View className="flex-row items-center justify-between">
      {icon}
      <Text className="text-3xl font-bold">{value}</Text>
    </View>
    <Text className="text-sm text-gray-600 mt-2">{label}</Text>
  </View>
);

export default function AdminHome() {
  return (
    <ScrollView className="flex-1 bg-gray-50 p-5">
      <Text className="text-2xl font-bold mb-6">Tổng quan hệ thống</Text>

      <View className="flex-row flex-wrap gap-4 mb-6">
        <StatCard
          icon={<Ionicons name="people-outline" size={28} color="#8b5cf6" />}
          label="Tổng người dùng"
          value={128}
          color="bg-purple-100"
        />
        <StatCard
          icon={<Ionicons name="car-sport-outline" size={28} color="#10b981" />}
          label="Shipper hoạt động"
          value={24}
          color="bg-emerald-100"
        />
        <StatCard
          icon={<Ionicons name="cube-outline" size={28} color="#3b82f6" />}
          label="Sản phẩm"
          value={89}
          color="bg-blue-100"
        />
        <StatCard
          icon={<Ionicons name="cash-outline" size={28} color="#f59e0b" />}
          label="Doanh thu hôm nay"
          value="12.4M"
          color="bg-amber-100"
        />
      </View>

      <View className="bg-white p-5 rounded-2xl">
        <Text className="text-lg font-bold mb-3">Hoạt động gần đây</Text>
        <Text className="text-gray-600">
          Tạo shipper: shipper3@delivery.com
        </Text>
        <Text className="text-gray-600">Xóa sản phẩm: Giày cũ</Text>
        <Text className="text-gray-600">Cập nhật role: user → admin</Text>
      </View>
    </ScrollView>
  );
}
