import ChatRoom from "./ChatRoom";
import Topbar from "./Topbar";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

function Chatbot() {
  const windowSize = useSelector((state: RootState) => state.bot.windowSize);

  let className =
    "flex flex-col absolute bg-blue shadow-lg transition-all duration-300 ";
  if (windowSize === "minimized") {
    className += "bottom-3 right-5 w-[300px] h-[40px]";
  } else if (windowSize === "maximized") {
    className += "top-0 left-0 w-screen h-screen";
  } else {
    className += "w-[550px] max-w-2/6 max-h-[525px] bottom-3 right-5 border";
  }

  return (
    <div className={className}>
      <Topbar />
      <div className={`overflow-y-scroll ${windowSize === "minimized" ? "hidden" : ""}`}>
        <ChatRoom />
      </div>
    </div>
  );
}

export default Chatbot;
