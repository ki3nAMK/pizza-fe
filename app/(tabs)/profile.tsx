import React from "react";

import { useRouter } from "expo-router";
// app/(tabs)/profile.tsx
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { images } from "@/constants";
import useAuthStore from "@/store/auth.store";
import { MaterialIcons } from "@expo/vector-icons";
import { useCartStore } from "@/store/cart.store";

const Profile = () => {
  const { user, logout } = useAuthStore();
  const { fetchAllOrder } = useCartStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/sign-in");
    } catch (e) {
      console.log("Logout error:", e);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-3 pb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={28} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-dark-100">Profile</Text>
          <TouchableOpacity>
            <MaterialIcons name="search" size={28} color="black" />
          </TouchableOpacity>
        </View>

        {/* Avatar Section */}
        <View className="items-center mt-6 mb-8">
          <View className="relative">
            <Image
              source={images.avatar}
              className="w-28 h-28 rounded-full"
              resizeMode="cover"
            />
            <TouchableOpacity className="absolute bottom-0 right-0 bg-primary rounded-full p-2">
              <Image
                source={images.pencil}
                className="w-5 h-5"
                tintColor="white"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Info List */}
        <View className="px-5 space-y-4">
          {/* Full Name */}
          <View className="flex-row items-center gap-4 bg-gray-50 rounded-2xl px-4 py-3">
            <View className="bg-primary/10 rounded-full p-2">
              <Image
                source={images.user}
                className="w-5 h-5"
                tintColor="#FE8C00"
              />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-gray-500">Full Name</Text>
              <Text className="text-base font-medium text-dark-100">
                {user?.name || "Adrian Hajdin"}
              </Text>
            </View>
          </View>

          {/* Email */}
          <View className="flex-row items-center gap-4 bg-gray-50 rounded-2xl px-4 py-3">
            <View className="bg-primary/10 rounded-full p-2">
              <Image
                source={images.envelope}
                className="w-5 h-5"
                tintColor="#FE8C00"
              />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-gray-500">Email</Text>
              <Text className="text-base font-medium text-dark-100">
                {user?.email || "adrian@jsmastery.com"}
              </Text>
            </View>
          </View>

          {/* Phone */}
          <View className="flex-row items-center gap-4 bg-gray-50 rounded-2xl px-4 py-3">
            <View className="bg-primary/10 rounded-full p-2">
              <Image
                source={images.phone}
                className="w-5 h-5"
                tintColor="#FE8C00"
              />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-gray-500">Phone number</Text>
              <Text className="text-base font-medium text-dark-100">
                +1 555 123 4567
              </Text>
            </View>
          </View>

          {/* Address - Home */}
          <View className="flex-row items-center gap-4 bg-gray-50 rounded-2xl px-4 py-3">
            <View className="bg-primary/10 rounded-full p-2">
              <Image
                source={images.location}
                className="w-5 h-5"
                tintColor="#FE8C00"
              />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-gray-500">Address 1 - (Home)</Text>
              <Text className="text-base font-medium text-dark-100">
                123 Main Street, Springfield, IL 62704
              </Text>
            </View>
          </View>

          {/* Address - Work */}
          <View className="flex-row items-center gap-4 bg-gray-50 rounded-2xl px-4 py-3">
            <View className="bg-primary/10 rounded-full p-2">
              <Image
                source={images.location}
                className="w-5 h-5"
                tintColor="#FE8C00"
              />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-gray-500">Address 2 - (Work)</Text>
              <Text className="text-base font-medium text-dark-100">
                221B Rose Street, Foodville, FL 12345
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="px-5 mt-8 space-y-3">
          <TouchableOpacity className="bg-primary/10 rounded-full py-3.5 items-center mb-2">
            <Text className="text-primary font-bold">Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-primary/10 rounded-full py-3.5 items-center mb-2"
            onPress={async () => {
              await fetchAllOrder();
              router.replace("/search/delivery");
            }}
          >
            <Text className="text-primary font-bold">My order</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogout}
            className="border border-red-500 rounded-full py-3.5 flex-row items-center justify-center gap-2"
          >
            <Image
              source={images.logout}
              className="w-5 h-5"
              tintColor="#EF4444"
            />
            <Text className="text-red-500 font-bold">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
