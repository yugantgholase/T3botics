import React, { useRef } from "react";
import { VscRobot } from "react-icons/vsc";
import DotsLoader from "./DotsLoader";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setConversation,
  setIsStreaming,
  setResponseStream,
  setIsProcessing,
} from "../../redux/slices/botSlice";
import { type Socket } from "socket.io-client";

interface BotTypingProps {
  socket: Socket | null;
}

const BotTyping = React.memo((props: BotTypingProps) => {
  const isStreaming = useSelector((state: RootState) => state.bot.isStreaming);
  const responseStream = useSelector(
    (state: RootState) => state.bot.responseStream
  );
  const dispatch = useDispatch();
  const streamBufferRef = useRef<string>(responseStream);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  console.log("re-rendered Improved Bot Typing");

  useEffect(() => {
    if (isStreaming) {
      intervalRef.current = setInterval(() => {
        dispatch(setResponseStream(streamBufferRef.current));
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isStreaming, dispatch]);

  useEffect(() => {
    const handleBotResponse = (message: { data: string }) => {
      streamBufferRef.current += message.data;
    };

    const handleBotResponseDone = (data: any) => {
      console.log(data);
      if (intervalRef.current) clearInterval(intervalRef.current);
      dispatch(
        setConversation({
          message: streamBufferRef.current.trim(),
          writer: "bot",
        })
      );
      dispatch(setResponseStream(""));
      streamBufferRef.current = "";
      dispatch(setIsStreaming(false));
      dispatch(setIsProcessing(false));
    };

    props.socket?.on("bot_response", handleBotResponse);
    props.socket?.on("bot_response_done", handleBotResponseDone);

    // Cleanup function to remove the event listener
    return () => {
      props.socket?.off("bot_response", handleBotResponse);
      props.socket?.off("bot_response_done", handleBotResponseDone);
    };
  }, [dispatch,props.socket]);
  return (
    <div className="flex gap-2 items-start max-w-[90%] sm:max-w-[80%] ml-4 mt-5 p-1">
      <VscRobot className="rounded-full text-4xl border-2 text-blue-300 flex-shrink-0" />
      <p
        className={`bg-slate-700 rounded-md text-sm sm:text-base break-words 
                text-left ${isStreaming ? "p-3" : "p-2"}`}
      >
        {isStreaming ? (
          responseStream
        ) : (
          <span>
            <DotsLoader />
          </span>
        )}
      </p>
    </div>
  );
});

export default BotTyping;