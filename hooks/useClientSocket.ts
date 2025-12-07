import { useEffect } from "react";
import { Alert } from "react-native";
import { Socket } from "socket.io-client";

import { getClientSocket } from "@/lib/client-socket";

export const useClientSocket = () => {
  useEffect(() => {
    let isMounted = true;
    let socket: Socket | null = null;

    const init = async () => {
      socket = await getClientSocket();
      if (!socket || !isMounted) return;

      console.log("🔌 CLIENT SOCKET CONNECTED");

      const handleNewOrderFindShipper = async () => {
        console.log("📦 newOrderFindShipper !!!");
        Alert.alert(
          "Đã tìm được shipper 🚚",
          "Đơn hàng của bạn đang được nhận bởi shipper gần nhất."
        );
      };

      const handleShipperLocationUpdate = async ({ location }: any) => {
        console.log("🚚 shipperUpdateLocation !!!", location);

        Alert.alert(
          "Shipper đang di chuyển",
          `Vị trí mới: \nLat: ${location.lat}\nLon: ${location.lon}`
        );
      };

      socket.on("newOrderFindShipper", handleNewOrderFindShipper);
      socket.on("shipperUpdateLocation", handleShipperLocationUpdate);

      socket.connect();
    };

    init();

    return () => {
      isMounted = false;
      if (socket) {
        socket.off("newOrderFindShipper");
        socket.off("shipperUpdateLocation");
      }
    };
  }, []);
};
