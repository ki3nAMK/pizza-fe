import { isEmpty, isNil } from "lodash";
import { io, Socket } from "socket.io-client";

import AsyncStorage from "@react-native-async-storage/async-storage";

export enum SocketNamespace {
  SHIPPER = "shipper",
  CLIENT = "client",
}

export const socketInstances: Record<SocketNamespace, Socket> = {} as any;

export const getSocketClient = async (
  namespace: SocketNamespace,
  query: any = {}
): Promise<Socket | null> => {
  const token = await AsyncStorage.getItem("accessToken");

  if (isNil(token) || isEmpty(token)) {
    return null;
  }

  if (socketInstances[namespace]) {
    return socketInstances[namespace];
  }

  const socket = io(`${process.env.EXPO_PUBLIC_SOCKET_URL}${namespace}`, {
    autoConnect: false,
    transports: ["websocket"],
    withCredentials: true,
    timeout: 5000,
    query: {
      token,
      ...query,
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 10,
  });

  socketInstances[namespace] = socket;

  return socket;
};
