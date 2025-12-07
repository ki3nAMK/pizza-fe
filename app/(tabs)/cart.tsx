import React, { useState } from "react";

import cn from "clsx";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { get } from "lodash";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CartItem from "@/components/CartItem";
import CustomButton from "@/components/CustomButton";
import CustomHeader from "@/components/CustomHeader";
import { useCartStore } from "@/store/cart.store";
import { PaymentInfoStripeProps } from "@/type";
import { Feather } from "@expo/vector-icons";

const PaymentInfoStripe = ({
  label,
  value,
  labelStyle,
  valueStyle,
}: PaymentInfoStripeProps) => (
  <View className="flex-between flex-row my-1">
    <Text className={cn("paragraph-medium text-gray-200", labelStyle)}>
      {label}
    </Text>
    <Text className={cn("paragraph-bold text-dark-100", valueStyle)}>
      {value}
    </Text>
  </View>
);

const Cart = () => {
  const {
    items,
    getTotalItems,
    getTotalPrice,
    createOrder: handleCreateOrder,
  } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const handleOrderNow = async () => {
    setIsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Location Required",
          "Bạn phải cho phép truy cập vị trí để đặt món."
        );
        setIsLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      const { latitude, longitude } = location.coords;

      await createOrder({ latitude, longitude });
    } catch (err) {
      console.log("Location error:", err);
      Alert.alert("Error", get(err, "message", "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  const createOrder = async ({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }) => {
    try {
      const body = {
        items: items.map((item) => ({
          menuId: item.id,
          quantity: item.quantity,
        })),
        latitude,
        longitude,
      };

      await handleCreateOrder(body, () => {
        Alert.alert("Success", "Order placed successfully!");

        router.replace("/");
      });
    } catch (err) {
      Alert.alert("Error", get(err, "message", "Unknown error"));
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList
        data={items}
        renderItem={({ item }) => <CartItem item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerClassName="pb-28 px-5 pt-5"
        ListHeaderComponent={() => <CustomHeader title="Your Cart" />}
        ListEmptyComponent={() => (
          <View className="flex-1 justify-center items-center px-5">
            {/* Icon hoặc hình minh họa */}
            <View className="bg-gray-200 p-8 rounded-full mb-6">
              <Feather name="shopping-cart" size={50} color="#9ca3af" />
            </View>

            {/* Tiêu đề */}
            <Text className="text-2xl font-bold text-gray-800 mb-2">
              Your Cart is Empty
            </Text>

            {/* Mô tả */}
            <Text className="text-center text-gray-500 mb-6">
              Looks like you haven’t added any items to your cart yet. Start
              browsing and add your favorite meals!
            </Text>

            {/* Nút quay lại / browse */}
            <TouchableOpacity
              onPress={() => router.replace("/search")}
              className="bg-green-500 px-6 py-3 rounded-lg"
            >
              <Text className="text-white font-semibold text-base">
                Browse Restaurants
              </Text>
            </TouchableOpacity>
          </View>
        )}
        ListFooterComponent={() =>
          totalItems > 0 && (
            <View className="gap-5">
              <View className="mt-6 border border-gray-200 p-5 rounded-2xl">
                <Text className="h3-bold text-dark-100 mb-5">
                  Payment Summary
                </Text>

                <PaymentInfoStripe
                  label={`Total Items (${totalItems})`}
                  value={`$${totalPrice.toFixed(2)}`}
                />
                <PaymentInfoStripe label={`Delivery Fee`} value={`$5.00`} />
                <PaymentInfoStripe
                  label={`Discount`}
                  value={`- $0.50`}
                  valueStyle="!text-success"
                />
                <View className="border-t border-gray-300 my-2" />
                <PaymentInfoStripe
                  label={`Total`}
                  value={`$${(totalPrice + 5 - 0.5).toFixed(2)}`}
                  labelStyle="base-bold !text-dark-100"
                  valueStyle="base-bold !text-dark-100 !text-right"
                />
              </View>

              <CustomButton title="Order Now" onPress={handleOrderNow} />
            </View>
          )
        }
      />
    </SafeAreaView>
  );
};

export default Cart;
