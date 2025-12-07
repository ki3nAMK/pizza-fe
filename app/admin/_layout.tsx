// app/(admin)/_layout.tsx
import React from "react";

import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { TouchableOpacity } from "react-native";

import useAuthStore from "@/store/auth.store";
import { Ionicons } from "@expo/vector-icons"; // Sử dụng Ionicons

const AdminLayout = () => {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/sign-in");
    } catch (e) {
      console.log("Logout error:", e);
    }
  };

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
        name="users"
        options={{
          drawerLabel: "Người dùng",
          title: "Quản lý người dùng",
          drawerIcon: ({ color }: any) => (
            <Ionicons name="people-outline" size={20} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="products"
        options={{
          drawerLabel: "Sản phẩm",
          title: "Quản lý sản phẩm",
          drawerIcon: ({ color }: any) => (
            <Ionicons name="cube-outline" size={20} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="setting"
        options={{
          drawerLabel: "Cài đặt",
          title: "Cài đặt bảo mật",
          drawerIcon: ({ color }: any) => (
            <Ionicons name="cube-outline" size={20} color={color} />
          ),
        }}
      />
    </Drawer>
  );
};

export default AdminLayout;
