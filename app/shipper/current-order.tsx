import React, {
  useEffect,
  useState,
} from 'react';

import { useRouter } from 'expo-router';
import { isNil } from 'lodash';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, {
  Marker,
  Polyline,
} from 'react-native-maps';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';

import ModalOrderDetail from '@/components/ModalOrderDetail';
import { useShipperStore } from '@/store/shipper.store';
import { Feather } from '@expo/vector-icons';

export default function CurrentOrder() {
  const { currentOrder, getCurrentOrder, completeOrder } = useShipperStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    getCurrentOrder().finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <SafeAreaView>
        <Text>Loading...</Text>
      </SafeAreaView>
    );

  if (!currentOrder) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Feather name="shopping-bag" size={70} color="#9ca3af" />
        <Text style={{ fontSize: 22, fontWeight: "700", marginTop: 20 }}>
          No Current Orders
        </Text>
        <TouchableOpacity
          onPress={() => router.replace("/shipper/home")}
          style={{
            marginTop: 24,
            backgroundColor: "#22c55e",
            padding: 12,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const coordinates = currentOrder.paths.map((p) => ({
    latitude: p.lat,
    longitude: p.lon,
  }));
  const center = {
    latitude:
      coordinates.reduce((acc, c) => acc + c.latitude, 0) / coordinates.length,
    longitude:
      coordinates.reduce((acc, c) => acc + c.longitude, 0) / coordinates.length,
  };

  const handleComplete = async () => {
    try {
      await completeOrder();
      Alert.alert("Success", "Đơn hàng đã hoàn tất!");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Không thể hoàn tất đơn.");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={{
          latitude: center.latitude - 0.015,
          longitude: center.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker coordinate={coordinates[0]}>
          <View style={styles.marker}>
            <FontAwesome name="shopping-basket" size={15} color="#fff" />
          </View>
        </Marker>
        <Marker coordinate={coordinates[coordinates.length - 1]}>
          <View style={styles.marker}>
            <FontAwesome name="home" size={15} color="#fff" />
          </View>
        </Marker>
        <Marker
          coordinate={{
            latitude: currentOrder.deliveryCoord.lat,
            longitude: currentOrder.deliveryCoord.lon,
          }}
        >
          <View style={styles.marker}>
            <FontAwesome name="car" size={15} color="#fff" />
          </View>
        </Marker>
        <Polyline
          coordinates={coordinates}
          strokeColor="#000"
          strokeWidth={3}
        />
      </MapView>

      <SafeAreaView style={styles.sheet}>
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Đơn hàng đang giao</Text>
        </View>

        <View style={styles.sheetSection}>
          <View style={{ marginRight: "auto" }}>
            <Text style={styles.sectionTitle}>Người nhận</Text>

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

          <TouchableOpacity style={styles.btnSm}>
            <FeatherIcon color="#000" name="phone" size={19} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnSm}>
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
            onPress={async () => {
              setModalVisible(true);
              await handleComplete();
            }}
          >
            <View style={styles.btnPrimary}>
              <Text style={styles.btnPrimaryText}>Hoàn thành đơn hàng</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ModalOrderDetail
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        orderItems={isNil(currentOrder) ? undefined : currentOrder.items}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  sheetTitle: { fontSize: 20, fontWeight: "700" },
  marker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  // sheet: {
  //   flex: 1,
  //   maxHeight: 372,
  //   marginTop: "auto",
  //   backgroundColor: "#fff",
  //   borderTopLeftRadius: 16,
  //   borderTopRightRadius: 16,
  // },
  sheetHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#e8e8e8",
  },
  // sheetTitle: {
  //   fontSize: 23,
  //   fontWeight: "700",
  //   color: "#1d1d1d",
  //   marginBottom: 4,
  // },
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
});
