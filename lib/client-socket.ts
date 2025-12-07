import { Socket } from "socket.io-client";

import { getSocketClient, SocketNamespace } from "./socket";

let clientSocket: Socket | null = null;

export const getClientSocket = async (): Promise<Socket | null> => {
  if (clientSocket) return clientSocket;

  clientSocket = await getSocketClient(SocketNamespace.CLIENT);
  return clientSocket;
};
