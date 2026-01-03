'use client';

import { Client, type IFrame } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient: Client | null = null;
const WS_URL = `${process.env.NEXT_PUBLIC_API_URL}/ws`;

export function getStompClient(): Client {
  if (stompClient) return stompClient;

  stompClient = new Client({
    webSocketFactory: () => (new SockJS(WS_URL) as unknown as WebSocket),
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    onConnect: () => console.log("WebSocket connected"),
    onDisconnect: () => console.log("WebSocket disconnected"),
    onStompError: (frame: IFrame) => {
      console.error("STOMP error:", frame.headers["message"], frame.body);
    },
  });

  stompClient.activate();
  return stompClient;
}

export function waitForConnection(client: Client): Promise<void> {
  return new Promise((resolve) => {
    if (client.connected) return resolve();

    const prevOnConnect = client.onConnect;
    client.onConnect = (frame: IFrame) => {
      if (prevOnConnect) prevOnConnect(frame);
      resolve();
      client.onConnect = prevOnConnect ?? (() => {});
    };
  });
}

export async function disconnectStompClient(): Promise<void> {
  if (!stompClient) return;
  await stompClient.deactivate();
  stompClient = null;
}

