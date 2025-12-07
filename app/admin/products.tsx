// app/(admin)/products.tsx
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

interface Product {
  id: string;
  name: string;
  price: number;
}

const mockProducts: Product[] = [
  { id: "1", name: "Áo thun cotton", price: 199000 },
  { id: "2", name: "Giày thể thao Pro", price: 1299000 },
  { id: "3", name: "Tai nghe Bluetooth X1", price: 899000 },
];

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [form, setForm] = useState({ name: "", price: "" });

  const createProduct = () => {
    const { name, price } = form;
    const priceNum = parseFloat(price);
    if (!name || isNaN(priceNum) || priceNum <= 0) {
      return Alert.alert("Lỗi", "Tên và giá không hợp lệ");
    }
    const newProduct: Product = {
      id: Date.now().toString(),
      name,
      price: priceNum,
    };
    setProducts((prev) => [...prev, newProduct]);
    setForm({ name: "", price: "" });
    Alert.alert("Thành công", "Tạo sản phẩm thành công");
  };

  const deleteProduct = (id: string) => {
    Alert.alert("Xác nhận", "Xóa sản phẩm này?", [
      { text: "Hủy" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: () => {
          setProducts((prev) => prev.filter((p) => p.id !== id));
          Alert.alert("Đã xóa", "Sản phẩm đã bị xóa");
        },
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-5">
      <View className="flex-row items-center gap-2 mb-6">
        <Ionicons name="cube-outline" size={24} color="#6b7280" />
        <Text className="text-2xl font-bold">Quản lý sản phẩm</Text>
      </View>

      {/* Danh sách sản phẩm */}
      <View className="bg-white rounded-2xl p-5 mb-6">
        {products.map((product) => (
          <View
            key={product.id}
            className="flex-row justify-between items-center py-4 border-b border-gray-100 last:border-0"
          >
            <View>
              <Text className="font-medium">{product.name}</Text>
              <Text className="text-sm text-green-600">
                {product.price.toLocaleString("vi-VN")} ₫
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => deleteProduct(product.id)}
              className="bg-red-600 px-3 py-1 rounded"
            >
              <Text className="text-white text-xs">Xóa</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Tạo sản phẩm */}
      <View className="bg-white rounded-2xl p-5">
        <View className="flex-row items-center gap-2 mb-3">
          <Ionicons name="add-circle-outline" size={20} color="#f59e0b" />
          <Text className="text-lg font-bold">Tạo sản phẩm mới</Text>
        </View>
        <CustomInput
          placeholder="Tên sản phẩm"
          value={form.name}
          onChangeText={(t) => setForm((p) => ({ ...p, name: t }))}
          label="Tên sản phẩm"
        />
        <CustomInput
          placeholder="Giá (VNĐ)"
          value={form.price}
          onChangeText={(t) => setForm((p) => ({ ...p, price: t }))}
          label="Giá"
          keyboardType="numeric"
        />
        <CustomButton title="Tạo sản phẩm" onPress={createProduct} />
      </View>
    </ScrollView>
  );
}
