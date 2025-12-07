import { Socket } from 'socket.io-client';

import {
  getSocketClient,
  SocketNamespace,
} from './socket';

let shipperSocket: Socket | null = null;

export const getShipperSocket = async (): Promise<Socket | null> => {
  if (shipperSocket) return shipperSocket;

  shipperSocket = await getSocketClient(SocketNamespace.SHIPPER);
  return shipperSocket;
};
