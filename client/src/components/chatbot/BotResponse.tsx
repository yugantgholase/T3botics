import React from "react";
import { VscRobot } from "react-icons/vsc";

type BotMessageProps = {
  message: string;
};

const BotResponse = React.memo((props: BotMessageProps) => {
  console.log(`Re-render BotMessage messsage : ${props.message} `);
  return (
    <div className="flex gap-2 items-start max-w-[90%] sm:max-w-[80%] ml-4 mt-5 p-1">
      <VscRobot className="rounded-full text-4xl border-2 text-blue-300 flex-shrink-0" />
      <p className="bg-slate-700 p-3 rounded-md text-sm sm:text-base break-words">
        {props.message}
      </p>
    </div>
  );
});

export default BotResponse;
