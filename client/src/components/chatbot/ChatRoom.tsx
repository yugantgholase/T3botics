import React from "react";
import BotResponse from "./BotResponse";
import UserMessage from "./UserMessage";
import BotTyping from "./BotTyping";
import useWebSocket from "../../hooks/useWebSocket";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import InputBox from "./InputBox";

export interface Conversation {
  message: string;
  writer: "bot" | "user";
}

const ChatRoom: React.FC = () => {
  const { socket, sendMessage } = useWebSocket();
  const connectionStatus = useSelector(
    (state: RootState) => state.bot.connectionStatus
  );
  const conversation = useSelector(
    (state: RootState) => state.bot.conversation
  );
  const isProcessing = useSelector(
    (state: RootState) => state.bot.isProcessing
  );

  console.log(
    `re-render ImprovedChatRoom connextionStatus : ${connectionStatus}`
  );

  return (
    <div className="overflow-y-scroll">
      <div className="connection-status flex justify-center mt-3">
        {connectionStatus}
      </div>
      {conversation.map((chat, index) =>
        chat.writer === "bot" ? (
          <BotResponse key={index} message={chat.message} />
        ) : (
          <UserMessage key={index} message={chat.message} />
        )
      )}

      {isProcessing && <BotTyping socket={socket} />}
      <InputBox sendMessage={sendMessage} />
    </div>
  );
};

export default ChatRoom;
