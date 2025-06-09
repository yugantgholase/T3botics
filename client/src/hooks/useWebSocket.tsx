import { useEffect, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { io, type Socket } from "socket.io-client";
import {
  setIsStreaming,
  setConnectionStatus,
  setIsProcessing,
  setFollowupQuestions,
} from "../redux/slices/botSlice";

interface QuestionObj {
  questions: Array<string>;
}

const useWebSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const dispatch = useDispatch();

  const sendMessage = useCallback(
    (message: string) => {
      console.log("call received here");
      if (socketRef.current) {
        dispatch(setIsProcessing(true));
        socketRef.current?.emit("user_message", { query: message });
        dispatch(setFollowupQuestions([]));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    console.log("log from useWebSockethook");
    const newSocket = io("http://localhost:5000/chat");
    socketRef.current = newSocket;

    newSocket.on("connect", () => {
      dispatch(setConnectionStatus("Connected"));
    });

    newSocket.on("stream_starting", (data) => {
      console.log(data);
      dispatch(setIsStreaming(true));
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
      dispatch(setConnectionStatus("Disconnected"));
    });

    newSocket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      dispatch(setConnectionStatus("Failed"));
    });

    newSocket.on("followup_questions", (questions: string) => {
      try {
        const questionObj: QuestionObj = JSON.parse(questions);
        console.log("question obj", questionObj);
        dispatch(setFollowupQuestions(questionObj.questions));
      } catch (err) {
        console.log(err);
        dispatch(
          setFollowupQuestions([
            "What are the steps to log in to a SCALANCE device using HTTP ?",
            "What are the factory settings for SCALANCE devices ?",
            "What are the system functions available on SCALANCE XC-200 switches?",
          ])
        );
      }
    });

    return () => {
      newSocket.close();
    };
  }, []);

  return { socket: socketRef.current, sendMessage };
};

export default useWebSocket;
