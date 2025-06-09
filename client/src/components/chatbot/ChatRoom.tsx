import React from "react";
import BotResponse from "./BotResponse";
import UserMessage from "./UserMessage";
import BotTyping from "./BotTyping";
import useWebSocket from "../../hooks/useWebSocket";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import InputBox from "./InputBox";
import FollowupQestions from "./FollowupQestions";

export interface Conversation {
  message: string;
  writer: "bot" | "user";
}

const ChatRoom: React.FC = React.memo(() => {
  const { socket, sendMessage } = useWebSocket();
  const conversation = useSelector(
    (state: RootState) => state.bot.conversation
  );
  const isProcessing = useSelector(
    (state: RootState) => state.bot.isProcessing
  );

  const followupQuestions = useSelector(
    (state: RootState) => state.bot.followupQuestions
  );

  return (
    <div className="">
      {conversation.map((chat, index) =>
        chat.writer === "bot" ? (
          <BotResponse key={index} message={chat.message} />
        ) : (
          <UserMessage key={index} message={chat.message} />
        )
      )}

      {isProcessing && <BotTyping socket={socket} />}

      {followupQuestions.length > 0 && (
        <FollowupQestions
          questions={followupQuestions}
          sendMessage={sendMessage}
        />
      )}
      <InputBox sendMessage={sendMessage} />
    </div>
  );
});

export default ChatRoom;
