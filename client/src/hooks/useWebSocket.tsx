import { useEffect, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { io, type Socket } from "socket.io-client";
import {
  setIsStreaming,
  setConnectionStatus,
  setIsProcessing,
} from "../redux/slices/botSlice";

const useWebSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const dispatch = useDispatch();

  const sendMessage = useCallback(
    (message: string) => {
      console.log("call received here");
      dispatch(setIsProcessing(true));
      if (socketRef.current) {
        socketRef.current?.emit("user_message", { query: message });
      }
    },
    [dispatch]
  );

  useEffect(() => {
    console.log("log from useWebSockethook");
    const newSocket = io("http://localhost:5000/chat");
    socketRef.current = newSocket;

    newSocket.on("connect", () => {
      dispatch(setConnectionStatus("Connected to WebSocket server"));
    });

    newSocket.on("stream_starting", (data) => {
      console.log(data);
      dispatch(setIsStreaming(true));
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
      dispatch(setConnectionStatus("Disconnected from server"));
    });

    newSocket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      dispatch(setConnectionStatus("Failed to connect to server"));
    });

    return () => {
      newSocket.close();
    };
  }, []);

  return { socket: socketRef.current, sendMessage };
};

export default useWebSocket;
