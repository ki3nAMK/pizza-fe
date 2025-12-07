import React from 'react';

import { useRouter } from 'expo-router';
import {
  get,
  isEmpty,
} from 'lodash';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useShipperStore } from '@/store/shipper.store';
import { Ionicons } from '@expo/vector-icons';

// === TYPE ===
export interface CartItemType {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderEntity {
  id: string;
  userId: string;
  items: CartItemType[];
  totalPrice: number;
  deliveryFee: number;
  latitude: number;
  longitude: number;
  status: string;
  paths: { lat: number; lon: number }[];
  distance: number;
  deliveryCoord: { lat: number; lon: number };
}

export default function DeliveryList() {
  const { orders: activeOrders } = useShipperStore();

  const router = useRouter();

  if (isEmpty(activeOrders)) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="bicycle-outline" size={70} color="#9ca3af" />
          <Text className="text-2xl font-bold text-gray-900 mt-5">
            No Active Orders
          </Text>
          <Text className="text-base text-gray-500 text-center mt-2 leading-6">
            Bạn hiện không có đơn hàng nào đang được giao.
          </Text>
          <TouchableOpacity
            onPress={() => router.replace("/shipper/home")}
            className="mt-6 bg-green-500 py-3 px-7 rounded-xl"
          >
            <Text className="text-white font-semibold text-base">Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="bg-blue-600 p-5 pb-8 rounded-b-3xl">
        <Text className="text-white text-2xl font-bold text-center">
          Đơn hàng đang giao
        </Text>
        <Text className="text-white/80 text-center mt-1">
          Theo dõi lộ trình giao hàng
        </Text>
      </View>

      <ScrollView className="flex-1 -mt-6 px-4">
        {activeOrders.map((order) => (
          <DeliveryCard key={get(order, "id", "")} order={order} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// === CARD ĐƠN HÀNG ===
const DeliveryCard = ({ order }: { order: OrderEntity }) => {
  const { acceptOrder } = useShipperStore();
  const router = useRouter();
  const estimatedMinutes = Math.ceil((order.distance / 20) * 60); // 20km/h

  const handleAccept = async () => {
    try {
      await acceptOrder(order.id);
      Alert.alert("Success", "Bạn đã nhận đơn hàng thành công!");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Không thể nhận đơn hàng.");
    }
  };

  return (
    <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
      <View className="flex-row justify-between items-start mb-3">
        <Text className="font-bold text-lg">#{order.id}</Text>
        <View
          className={`px-3 py-1 rounded-full ${
            order.status === "CREATED"
              ? "bg-gray-400"
              : order.status === "DELIVERING"
                ? "bg-orange-500"
                : "bg-green-500"
          }`}
        >
          <Text className="text-white text-xs font-medium">
            {order.status === "CREATED"
              ? "Chưa nhận"
              : order.status === "DELIVERING"
                ? "Đang giao"
                : "Hoàn tất"}
          </Text>
        </View>
      </View>

      <View className="space-y-2 mb-3">
        <View className="flex-row items-center gap-2">
          <Ionicons name="restaurant-outline" size={16} color="#f97316" />
          <Text className="flex-1 text-sm">
            {order.items.map((i) => i.name).join(", ")}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Ionicons name="location-outline" size={16} color="#10b981" />
          <Text className="flex-1 text-sm">
            {order.deliveryCoord.lat.toFixed(4)},{" "}
            {order.deliveryCoord.lon.toFixed(4)}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center mb-3">
        <View>
          <Text className="text-lg font-bold text-green-600">
            {(order.totalPrice + order.deliveryFee).toLocaleString("vi-VN")} ₫
          </Text>
          <Text className="text-xs text-gray-500">
            Dự kiến: {estimatedMinutes} phút ({order.distance} km)
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Text className="text-sm font-medium text-blue-600">
            Xem lộ trình
          </Text>
          <Ionicons name="chevron-forward" size={18} color="#3b82f6" />
        </View>
      </View>

      {order.status === "CREATED" && (
        <TouchableOpacity
          onPress={handleAccept}
          className="bg-blue-600 py-3 rounded-xl items-center"
        >
          <Text className="text-white font-semibold text-base">
            Đồng ý nhận đơn
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
