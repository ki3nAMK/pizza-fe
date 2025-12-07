import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useCartStore } from "@/store/cart.store";
import { isEmpty } from "lodash";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import FeatherIcon from "react-native-vector-icons/Feather";

export default function ListOrders() {
  const { orders } = useCartStore();
  const router = useRouter();

  if (isEmpty(orders)) {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        {/* Nút quay lại */}
        <TouchableOpacity
          onPress={() => router.replace("/profile")}
          style={{
            position: "absolute",
            top: 50, // đủ tránh vùng status bar (có thể chỉnh tùy thiết bị)
            left: 20,
            zIndex: 10,
            backgroundColor: "#f3f4f6",
            borderRadius: 999,
            padding: 8,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 3,
          }}
        >
          <Feather name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>

        {/* Nội dung trung tâm */}
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 24,
          }}
        >
          <Feather name="shopping-bag" size={70} color="#9ca3af" />
          <Text
            style={{
              fontSize: 22,
              fontWeight: "700",
              color: "#111827",
              marginTop: 20,
            }}
          >
            No Orders Yet
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#6b7280",
              textAlign: "center",
              marginTop: 6,
              lineHeight: 22,
            }}
          >
            Looks like you haven’t placed any orders yet.{"\n"}
            Start exploring and order your favorite meals!
          </Text>

          <TouchableOpacity
            onPress={() => router.replace("/search")}
            style={{
              marginTop: 24,
              backgroundColor: "#22c55e",
              paddingVertical: 12,
              paddingHorizontal: 28,
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "600",
                fontSize: 16,
              }}
            >
              Browse Restaurants
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Nút quay lại */}
      <TouchableOpacity
        onPress={() => router.replace("/profile")}
        style={{
          position: "absolute",
          top: 50, // đủ tránh vùng status bar (có thể chỉnh tùy thiết bị)
          left: 20,
          zIndex: 10,
          backgroundColor: "#f3f4f6",
          borderRadius: 999,
          padding: 8,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 3,
        }}
      >
        <Feather name="arrow-left" size={24} color="#111827" />
      </TouchableOpacity>

      <View style={{ flex: 1, marginTop: 100 }}>
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/search/delivery/${item.id}`)}
              style={styles.orderCard}
            >
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Order #{item.id.slice(-6)}</Text>
                <Text
                  style={[
                    styles.orderStatus,
                    item.status === "DELIVERING"
                      ? styles.statusDelivering
                      : styles.statusDone,
                  ]}
                >
                  {item.status}
                </Text>
              </View>
              <Text style={styles.orderInfo}>
                {item.items.length} items · Total: ${item.totalPrice.toFixed(2)}
              </Text>
              <Text style={styles.orderInfo}>
                Delivery Fee: ${item.deliveryFee}
              </Text>
              <Text style={styles.orderInfo}>Distance: {item.distance} km</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = (StyleSheet as any).create({
  map: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  marker: {
    width: 30,
    height: 30,
    backgroundColor: "#000",
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
  },
  /** Header */
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  headerActions: {
    alignItems: "flex-end",
  },
  /** Button */
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    backgroundColor: "#efefef",
    borderColor: "#efefef",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  btnClose: {
    width: 40,
    height: 40,
    paddingHorizontal: 0,
  },
  btnText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "bold",
    color: "#000",
    letterSpacing: 0.45,
  },
  btnSm: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    backgroundColor: "#efefef",
    borderColor: "#efefef",
    marginLeft: 4,
  },
  btnSmText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
    color: "#000",
  },
  btnPrimary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    backgroundColor: "#F82E08",
    borderColor: "#F82E08",
  },
  btnPrimaryText: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "700",
    color: "#fff",
  },
  btnEmpty: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "transparent",
    marginTop: 4,
  },
  btnEmptyText: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "700",
    color: "#1D1D1D",
  },
  /** Sheet */
  sheet: {
    flex: 1,
    maxHeight: 372,
    marginTop: "auto",
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  sheetHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#e8e8e8",
  },
  sheetTitle: {
    fontSize: 23,
    fontWeight: "700",
    color: "#1d1d1d",
    marginBottom: 4,
  },
  sheetSubtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#6d6d6d",
  },
  sheetSection: {
    flexDirection: "row",
    alignItems: "center",
    justifySelf: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#e8e8e8",
  } as any,
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1d1d1d",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#6a6a6a",
  },
  sectionFooter: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
});
