import { useEffect } from 'react';

import * as Location from 'expo-location';
import { Socket } from 'socket.io-client';

import { getShipperSocket } from '@/lib/shipper-socket';
import { useShipperStore } from '@/store/shipper.store';

export const useShipperSocket = () => {
  const { getCurrentOrder } = useShipperStore();

  useEffect(() => {
    let isMounted = true;
    let socket: Socket | null = null;

    const init = async () => {
      socket = await getShipperSocket();
      if (!socket || !isMounted) return;

      const handleRequestUpdate = async ({ message, orderId }: any) => {
        console.log("handleRequestUpdate!!!");

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });
        socket?.emit("shipper-update-location", {
          orderId: orderId,
          location: {
            lat: location.coords.latitude,
            lon: location.coords.longitude,
          },
        });
      };

      const handleLocationUpdate = async ({ location }: any) => {
        console.log("handleLocationUpdate!!!");

        await getCurrentOrder();
      };

      socket.on("requestUpdateLocation", handleRequestUpdate);
      socket.on("shipperUpdateLocation", handleLocationUpdate);

      socket.connect();
    };

    init();

    return () => {
      isMounted = false;
      if (socket) {
        socket.off("requestUpdateLocation");
        socket.off("shipperUpdateLocation");
        // ⚠️ Không disconnect nếu muốn giữ socket giữa các màn hình
      }
    };
  }, []);
};
