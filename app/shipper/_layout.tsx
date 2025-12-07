// app/(admin)/_layout.tsx
import React, { useEffect } from 'react';

import { useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { TouchableOpacity } from 'react-native';

import { useShipperSocket } from '@/hooks/useShipperSocket';
import useAuthStore from '@/store/auth.store';
import { useShipperStore } from '@/store/shipper.store';
import { Ionicons } from '@expo/vector-icons';

const ShipperLayout = () => {
  const router = useRouter();
  const { logout } = useAuthStore();
  const { getCurrentOrder } = useShipperStore();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/sign-in");
    } catch (e) {
      console.log("Logout error:", e);
    }
  };

  useShipperSocket();

  useEffect(() => {
    getCurrentOrder();
  }, []);

  return (
    <Drawer
      screenOptions={({ navigation }) => ({
        drawerStyle: { backgroundColor: "#1f2937", width: 240 },
        drawerLabelStyle: { color: "#e5e7eb", fontWeight: "500" },
        headerStyle: { backgroundColor: "#1f2937" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.toggleDrawer()}
            className="ml-4"
          >
            <Ionicons name="menu-outline" size={24} color="white" />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity onPress={handleLogout} className="mr-4">
            <Ionicons name="log-out-outline" size={24} color="white" />
          </TouchableOpacity>
        ),
      })}
    >
      <Drawer.Screen
        name="home"
        options={{
          drawerLabel: "Tổng quan",
          title: "Dashboard",
          drawerIcon: ({ color }: any) => (
            <Ionicons name="home-outline" size={20} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="orders"
        options={{
          title: "Đơn hàng",
          drawerIcon: ({ color }) => (
            <Ionicons name="receipt-outline" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="current-order"
        options={{
          title: "Đơn hàng hiện tại",
          drawerIcon: ({ color }) => (
            <Ionicons name="receipt-outline" size={24} color={color} />
          ),
        }}
      />
    </Drawer>
  );
};

export default ShipperLayout;
