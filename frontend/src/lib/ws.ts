import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let client: Client | null = null;

export function getStompClient(): Client {
  if (client && client.connected) {
    return client;
  }

  const socket = new SockJS('http://localhost:8080/ws');
  client = new Client({
    webSocketFactory: () => socket as any,
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    onConnect: () => {
      console.log('WebSocket connected');
    },
    onDisconnect: () => {
      console.log('WebSocket disconnected');
    },
    onStompError: (frame) => {
      console.error('STOMP error:', frame);
    },
  });

  client.activate();
  return client;
}

export function waitForConnection(client: Client): Promise<void> {
  return new Promise((resolve) => {
    if (client.connected) {
      resolve();
      return;
    }
    const originalOnConnect = client.onConnect;
    client.onConnect = (frame) => {
      if (originalOnConnect) originalOnConnect(frame);
      resolve();
    };
  });
}

export function disconnectStompClient() {
  if (client) {
    client.deactivate();
    client = null;
  }
}