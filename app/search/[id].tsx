// app/(tabs)/search/[id].tsx
import { MenuItem } from "@/type";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Fragment, useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import useFoodStore from "@/store/food.store";
import CartButton from "@/components/CartButton";
import { useCartStore } from "@/store/cart.store";
import { toppings, sides } from "@/constants";
import React from "react";
import burgerOne from "@/assets/images/burger-one.png";
import burgerTwo from "@/assets/images/burger-two.png";
import buritto from "@/assets/images/buritto.png";
import pizzaOne from "@/assets/images/pizza-one.png";

const Detail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { menus } = useFoodStore();
  const { addItem: addToCart } = useCartStore();
  const [item, setItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const insets = useSafeAreaInsets();

  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [selectedSides, setSelectedSides] = useState<string[]>([]);

  useEffect(() => {
    if (id && menus.length > 0) {
      const found = menus.find((m) => m.id === id);
      setItem(found || null);
    }
  }, [id, menus]);

  if (!item) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text className="text-lg text-gray-500">Loading...</Text>
      </SafeAreaView>
    );
  }

  const handleAddToCart = () => {
    addToCart(item as any, quantity);
    router.push("/cart");
  };

  const toggleTopping = (name: string) => {
    setSelectedToppings((prev) =>
      prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name]
    );
  };

  const toggleSide = (name: string) => {
    setSelectedSides((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100 + insets.bottom,
        }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-3 pb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={28} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-dark-100">
            Product Detail
          </Text>
          <CartButton />
        </View>

        {/* Image */}
        <View className="items-center mb-6">
          <Image
            source={{
              uri: item.image_url || "https://via.placeholder.com/300",
            }}
            className="w-64 h-64 rounded-2xl"
            resizeMode="cover"
          />
        </View>

        {/* Content */}
        <View className="px-5">
          <Text className="text-2xl font-bold text-dark-100 mb-1">
            {item.name}
          </Text>

          {/* Rating */}
          <View className="flex-row items-center gap-2 mb-3">
            <View className="flex-row items-center">
              {[...Array(5)].map((_, i) => (
                <MaterialIcons
                  key={i}
                  name={
                    i < Math.floor(item.rating || 4.5) ? "star" : "star-border"
                  }
                  size={18}
                  color="#FFD700"
                />
              ))}
            </View>
            <Text className="text-sm text-gray-600">
              {item.rating || 4.9}/5
            </Text>
          </View>

          <Text className="text-3xl font-bold text-primary mb-4">
            ${item.price.toFixed(2)}
          </Text>

          {/* Calories & Protein */}
          <View className="flex-row gap-6 mb-6">
            <View>
              <Text className="text-sm text-gray-500">Calories</Text>
              <Text className="text-lg font-semibold">
                {item.calories || 365} Cal
              </Text>
            </View>
            <View>
              <Text className="text-sm text-gray-500">Protein</Text>
              <Text className="text-lg font-semibold">
                {item.protein || 35}g
              </Text>
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-sm text-gray-500 mb-1">Bun Type</Text>
            <Text className="text-base font-medium">Whole Wheat</Text>
          </View>

          <View className="mb-6">
            <Text className="text-sm text-gray-500 mb-1">Store</Text>
            <Text className="text-base font-medium">
              {item.store.name} - {item.store.address}
            </Text>
          </View>

          {/* Delivery Info */}
          <View className="flex-row items-center justify-between bg-green-50 rounded-xl p-4 mb-6">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="local-shipping" size={20} color="#10B981" />
              <Text className="text-sm font-medium text-green-700">
                Free Delivery
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="access-time" size={16} color="#6B7280" />
              <Text className="text-sm text-gray-600">20 - 30 mins</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <MaterialIcons name="star" size={16} color="#FBBF24" />
              <Text className="text-sm font-medium">4.5</Text>
            </View>
          </View>

          <Text className="text-base text-gray-700 leading-6 mb-6">
            {item.description ||
              `The ${item.name} is a classic fast food burger that packs a punch of flavor in every bite. Made with a juicy beef patty cooked to perfection, it's topped with melted American cheese, crispy lettuce, tomato, & crunchy pickles. Loaded with cheese and pepperoni slices.`}
          </Text>

          {/* TOPPINGS – GIỐNG HÌNH THAM KHẢO */}
          <Text className="text-lg font-bold mb-3">Toppings</Text>
          <View className="flex-row flex-wrap gap-3 mb-6">
            {toppings.map((topping) => {
              const isSelected = selectedToppings.includes(topping.name);
              return (
                <TouchableOpacity
                  key={topping.name}
                  onPress={() => toggleTopping(topping.name)}
                  className={`
                                        flex-row items-center gap-2 px-3 py-2 rounded-full border
                                        ${
                                          isSelected
                                            ? "bg-primary border-primary"
                                            : "bg-white border-gray-300"
                                        }
                                    `}
                >
                  <View className="w-8 h-8 justify-center items-center">
                    <Image
                      source={topping.image}
                      className="w-8 h-8"
                      resizeMode="contain"
                    />
                  </View>
                  <Text
                    className={`
                                            text-sm font-medium
                                            ${isSelected ? "text-white" : "text-gray-700"}
                                        `}
                  >
                    {topping.name}
                  </Text>
                  <Text className="text-xs text-red-500 font-bold ml-1">+</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* SIDE OPTIONS – GIỐNG HÌNH THAM KHẢO */}
          <Text className="text-lg font-bold mb-3">Side options</Text>
          <View className="flex-row flex-wrap gap-3 mb-8">
            {sides.map((side) => {
              const isSelected = selectedSides.includes(side.name);
              return (
                <TouchableOpacity
                  key={side.name}
                  onPress={() => toggleSide(side.name)}
                  className={`
                                        w-24 h-24 items-center justify-center rounded-2xl border-2 p-2
                                        ${
                                          isSelected
                                            ? "border-primary bg-primary/5"
                                            : "border-gray-200 bg-white"
                                        }
                                    `}
                >
                  <View className="w-16 h-16 mb-1 justify-center items-center">
                    <Image
                      source={side.image}
                      className="w-14 h-14"
                      resizeMode="contain"
                    />
                  </View>
                  <Text
                    className={`
                                            text-xs font-medium text-center
                                            ${isSelected ? "text-primary" : "text-gray-700"}
                                        `}
                  >
                    {side.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* BOTTOM BAR */}
      <View
        className="bg-white border-t border-gray-200 px-5 py-3 flex-row items-center justify-between"
        style={{ paddingBottom: insets.bottom + 10 }}
      >
        <View className="flex-row items-center bg-gray-100 rounded-full h-12">
          <TouchableOpacity
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4"
          >
            <Text className="text-xl font-bold text-gray-700">-</Text>
          </TouchableOpacity>
          <Text className="px-5 text-lg font-bold text-dark-100">
            {quantity}
          </Text>
          <TouchableOpacity
            onPress={() => setQuantity(quantity + 1)}
            className="px-4"
          >
            <Text className="text-xl font-bold text-primary">+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleAddToCart}
          className="bg-primary rounded-full px-6 py-3 flex-row items-center gap-2"
        >
          <MaterialIcons name="shopping-cart" size={20} color="white" />
          <Text className="text-white font-bold">Add to cart</Text>
          <Text className="text-white font-bold">
            (${(item.price * quantity).toFixed(2)})
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Detail;
