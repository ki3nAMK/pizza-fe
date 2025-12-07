import React, { useMemo, useState } from "react";

import { useLocalSearchParams, useRouter } from "expo-router";
import { find, isEmpty, isNil, map } from "lodash";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import FeatherIcon from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome5";

import ModalOrderDetail from "@/components/ModalOrderDetail";
import { useCartStore } from "@/store/cart.store";
import { Feather } from "@expo/vector-icons";

export default function DeliveryDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { orders } = useCartStore();

  const activeOrder = useMemo(() => {
    if (isEmpty(orders) || isNil(orders)) return null;

    const order = find(orders, (item) => item.id === id);

    if (isNil(order)) return null;

    const coordinates = map(order.paths, (coord) => ({
      latitude: coord.lat,
      longitude: coord.lon,
    }));

    const center = {
      latitude:
        coordinates.reduce((acc, c) => (acc += c.latitude), 0) /
        coordinates.length,
      longitude:
        coordinates.reduce((acc, c) => (acc += c.longitude), 0) /
        coordinates.length,
    };

    return {
      ...order,
      coordinates: map(order.paths, (coord) => ({
        latitude: coord.lat,
        longitude: coord.lon,
      })),
      center: center,
    };
  }, [orders, id]);

  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  if (isNil(activeOrder)) {
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
    <View style={{ flex: 1 }}>
      <SafeAreaView>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              router.replace("/profile");
            }}
            style={[styles.btn, styles.btnClose]}
          >
            <FeatherIcon color="#000" name="x" size={19} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: activeOrder.center.latitude - 0.015, // 0.015 accounts for the bottom sheet height (372px)
          longitude: activeOrder.center.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* Origin */}
        <Marker coordinate={activeOrder.coordinates[0]}>
          <View style={styles.marker}>
            <FontAwesome name="shopping-basket" color="#fff" size={15} />
          </View>
        </Marker>

        {/* Destination */}
        <Marker
          coordinate={
            activeOrder.coordinates[activeOrder.coordinates.length - 1]
          }
        >
          <View style={styles.marker}>
            <FontAwesome name="home" color="#fff" size={15} />
          </View>
        </Marker>

        {/* Driver */}
        <Marker
          coordinate={{
            latitude: activeOrder.deliveryCoord.lat,
            longitude: activeOrder.deliveryCoord.lon,
          }}
        >
          <View style={styles.marker}>
            <FontAwesome name="car" color="#fff" size={15} />
          </View>
        </Marker>

        <Polyline
          coordinates={activeOrder.coordinates}
          strokeColor="#000"
          strokeWidth={3}
        />
      </MapView>

      <SafeAreaView style={styles.sheet}>
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Order is coming soon</Text>

          <Text style={styles.sheetSubtitle}>
            Arrives in
            <Text style={{ fontWeight: "600", color: "#000" }}>
              {` ${Math.ceil((activeOrder.distance / 20) * 60)} minutes`} (
              {activeOrder.distance} km)
            </Text>
          </Text>
        </View>

        <View style={styles.sheetSection}>
          <View style={{ marginRight: "auto" }}>
            <Text style={styles.sectionTitle}>Driver</Text>

            <Text style={styles.sectionSubtitle}>John D.</Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}
          >
            <View style={styles.btnSm}>
              <Text style={styles.btnSmText}>Add tip</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}
            style={styles.btnSm}
          >
            <FeatherIcon color="#000" name="phone" size={19} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}
            style={styles.btnSm}
          >
            <FeatherIcon color="#000" name="send" size={19} />
          </TouchableOpacity>
        </View>

        <View style={styles.sheetSection}>
          <View style={{ marginRight: "auto" }}>
            <Text style={styles.sectionTitle}>Restaurant</Text>

            <Text style={styles.sectionSubtitle}>
              Old Fashion Burger Restaurant
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}
          >
            <View style={styles.btnSm}>
              <Text style={styles.btnSmText}>Add tip</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}
            style={styles.btnSm}
          >
            <FeatherIcon color="#000" name="phone" size={19} />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionFooter}>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <View style={styles.btnPrimary}>
              <Text style={styles.btnPrimaryText}>View Order Details</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              router.replace("/profile");
            }}
          >
            <View style={styles.btnEmpty}>
              <Text style={styles.btnEmptyText}>Cancel</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ModalOrderDetail
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        orderItems={isNil(activeOrder) ? undefined : activeOrder.items}
      />
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
