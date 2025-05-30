import React from "react";
import { FaUser } from "react-icons/fa6";

type UserMessageProps = {
  message: string;
};

const UserMessage = React.memo((props: UserMessageProps) => {
  console.log(`Re-render UserMessage messsage : ${props.message} `);
  return (
    <div className="flex flex-row-reverse gap-2 items-center max-w-[80%] mt-5 p-1 ml-auto mr-4">
      <FaUser className=" rounded-full text-3xl border-2 text-blue-300" />
      <p className="bg-slate-700 p-2 rounded-md">{props.message}</p>
    </div>
  );
});

export default UserMessage;
