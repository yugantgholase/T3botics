import React, { useState } from "react";
import { VscRobot } from "react-icons/vsc";
import { BiSolidLike, BiSolidDislike } from "react-icons/bi";

type BotMessageProps = {
  message: string;
};

type UserFeedback = "Like" | "Dislike" | "";

const BotResponse = React.memo((props: BotMessageProps) => {
  console.log(`Re-render BotMessage messsage : ${props.message} `);
  const [userFeedback, setUserFeedback] = useState<UserFeedback>("");
  return (
    <>
      <div className="flex gap-2 items-start max-w-[90%] sm:max-w-[80%] ml-4 mt-5 p-1">
        <VscRobot className="rounded-full text-4xl border-2 text-blue-300 flex-shrink-0" />
        <p className="bg-slate-700 p-3 rounded-md rounded-tl-none text-sm sm:text-base break-words whitespace-pre-wrap">
          {props.message}
        </p>
      </div>
      <div className="mt-1 ml-16 flex gap-x-2 text-[19px]">
        <button
          className={`${
            userFeedback === "Like" ? "text-purple-500" : "text-[#4C586D]"
          }  `}
          onClick={() => {
            if (userFeedback === "Like") setUserFeedback("");
            else setUserFeedback("Like");
          }}
        >
          <BiSolidLike />
        </button>
        <button
          className={`${
            userFeedback === "Dislike" ? "text-purple-500" : "text-[#4C586D]"
          }  `}
          onClick={() => {
            if (userFeedback === "Dislike") setUserFeedback("");
            else setUserFeedback("Dislike");
          }}
        >
          <BiSolidDislike />
        </button>
      </div>
    </>
  );
});

export default BotResponse;
