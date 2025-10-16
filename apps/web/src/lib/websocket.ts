import { useEffect, useRef, useCallback, useState } from "react";
import { useAuthStore } from "@/lib/store";
import { io, Socket } from "socket.io-client";

export type WebSocketEvent =
  | { type: "task:created"; data: any }
  | { type: "task:updated"; data: any }
  | { type: "comment:new"; data: any }
  | { type: "notification:new"; data: any };

type WebSocketEventHandler = (event: WebSocketEvent) => void;

const WS_URL = import.meta.env.VITE_WS_URL;

export function useWebSocket(onMessage?: WebSocketEventHandler) {
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const socketRef = useRef<Socket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const [isConnected, setIsConnected] = useState(false);

  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  const send = useCallback((event: string, data: any) => {
    if (socketRef.current && socketRef.current.connected) {
      console.log("[WebSocket] Emitting event:", event, data);
      socketRef.current.emit(event, data);
    } else {
      console.warn("[WebSocket] Socket is not connected");
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      return;
    }

    if (socketRef.current) {
      return;
    }

    const socket = io(WS_URL, {
      auth: {
        token: token,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: maxReconnectAttempts,
      transports: ['websocket', 'polling'],
    });

    socket.on("connect", () => {
      reconnectAttemptsRef.current = 0;
      setIsConnected(true);
    });

    socket.on("task:created", (data: any) => {
      onMessageRef.current?.({ type: "task:created", data });
    });

    socket.on("task:updated", (data: any) => {
      onMessageRef.current?.({ type: "task:updated", data });
    });

    socket.on("comment:new", (data: any) => {
      onMessageRef.current?.({ type: "comment:new", data });
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("connect_error", () => {
      reconnectAttemptsRef.current++;

      if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
        socket.disconnect();
      }
    });

    socketRef.current = socket;

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setIsConnected(false);
    };
  }, [isAuthenticated, token]);

  return {
    send,
    isConnected,
  };
}
