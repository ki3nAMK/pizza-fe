// app/(shipper)/home.tsx
import React from 'react';

import {
  ScrollView,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

const StatCard = ({ icon, label, value, color }: any) => (
  <View className={`${color} p-5 rounded-2xl shadow-sm`}>
    <View className="flex-row items-center justify-between">
      {icon}
      <Text className="text-3xl font-bold">{value}</Text>
    </View>
    <Text className="text-sm text-gray-600 mt-2">{label}</Text>
  </View>
);

export default function ShipperHome() {
  return (
    <ScrollView className="flex-1 bg-gray-50 p-5">
      <Text className="text-2xl font-bold mb-6">Tổng quan hôm nay</Text>

      {/* KPI Dashboard */}
      <View className="flex-row flex-wrap gap-4 mb-6">
        <StatCard
          icon={<Ionicons name="cube-outline" size={28} color="#3b82f6" />}
          label="Đơn đã giao"
          value={12}
          color="bg-blue-100"
        />
        <StatCard
          icon={<Ionicons name="bicycle-outline" size={28} color="#10b981" />}
          label="Đơn đang giao"
          value={2}
          color="bg-emerald-100"
        />
        <StatCard
          icon={<Ionicons name="cash-outline" size={28} color="#f59e0b" />}
          label="Thu nhập hôm nay"
          value="534K"
          color="bg-amber-100"
        />
        <StatCard
          icon={<Ionicons name="map-outline" size={28} color="#8b5cf6" />}
          label="Quãng đường"
          value="27.3 km"
          color="bg-purple-100"
        />
      </View>

      {/* Recent Activities */}
      <View className="bg-white p-5 rounded-2xl">
        <Text className="text-lg font-bold mb-3">Hoạt động gần đây</Text>
        <Text className="text-gray-600">📦 Nhận đơn #A123 tại Quận 7</Text>
        <Text className="text-gray-600">
          🏪 Đã lấy hàng tại: Highlands Coffee
        </Text>
        <Text className="text-gray-600">🚚 Đã giao đơn #A122 tại Quận 4</Text>
        <Text className="text-gray-600">
          🔁 Chuyển sang trạng thái "Sẵn sàng nhận đơn"
        </Text>
        <Text className="text-gray-600">
          💰 Nhận bonus 15K cho giờ cao điểm
        </Text>
      </View>
    </ScrollView>
  );
}
