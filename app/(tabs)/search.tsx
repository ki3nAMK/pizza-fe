import CartButton from "@/components/CartButton";
import MenuCard from "@/components/MenuCard";
import { MenuItem } from "@/type";
import cn from "clsx";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Filter from "@/components/Filter";
import SearchBar from "@/components/SearchBar";
import useFoodStore from "@/store/food.store";
import React from "react";

const Search = () => {
  const {
    menus,
    categories,
    loading,
    setFilters,
    fetchMenus,
    fetchCategories,
  } = useFoodStore();

  const { category, query } = useLocalSearchParams<{
    category: string;
    query: string;
  }>();

  useEffect(() => {
    setFilters({ category, query });

    fetchMenus({ category: category || undefined, query: query || undefined });
  }, [category, query]);

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList
        data={menus}
        renderItem={({ item, index }) => {
          const isFirstRightColItem = index % 2 === 0;

          return (
            <View
              className={cn(
                "flex-1 max-w-[48%]",
                !isFirstRightColItem ? "mt-10" : "mt-0"
              )}
            >
              <MenuCard item={item as MenuItem} />
            </View>
          );
        }}
        keyExtractor={(item, index) => item.id || index.toString()}
        numColumns={2}
        columnWrapperClassName="gap-7"
        contentContainerClassName="gap-7 px-5 pb-32"
        ListHeaderComponent={() => (
          <View className="my-5 gap-5">
            <View className="flex-between flex-row w-full">
              <View className="flex-start">
                <Text className="small-bold uppercase text-primary">
                  Search
                </Text>
                <View className="flex-start flex-row gap-x-1 mt-0.5">
                  <Text className="paragraph-semibold text-dark-100">
                    Find your favorite food
                  </Text>
                </View>
              </View>

              <CartButton />
            </View>

            <SearchBar />

            <Filter categories={categories!} />
          </View>
        )}
        ListEmptyComponent={() => !loading && <Text>No results</Text>}
      />
    </SafeAreaView>
  );
};

export default Search;
