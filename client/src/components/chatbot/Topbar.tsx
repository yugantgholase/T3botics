import {
  VscChromeMinimize,
  VscChromeRestore,
  VscChromeMaximize,
} from "react-icons/vsc";
import { setWindowSize, type WindowSize } from "../../redux/slices/botSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

const iconColor = "#ffffff";
const iconClassNames = "text-2xl leading-1";

const Topbar = () => {
  const dispatch = useDispatch();
  const connectionStatus = useSelector(
    (state: RootState) => state.bot.connectionStatus
  );

  const handleWindowSizeChange = (newSize: WindowSize) => {
    dispatch(setWindowSize(newSize));
  };

  return (
    <div className="flex justify-between items-center bg-purple-500 p-2">
      <h3 className="text-lg font-normal text-white flex gap-1.5 items-baseline">
        <p>T3botics</p>
        <span
          className={`h-2 w-2 rounded-[50%] ${
            connectionStatus === "Connecting"
              ? "bg-orange-500"
              : connectionStatus === "Connected" ? "bg-green-500" : "bg-red-500"
          }`}
        ></span>
      </h3>
      <div className="flex items-center gap-x-3 mr-2">
        <button onClick={() => handleWindowSizeChange("minimized")}>
          <VscChromeMinimize fill={iconColor} className={iconClassNames} />
        </button>
        <button onClick={() => handleWindowSizeChange("maximized")}>
          <VscChromeMaximize fill={iconColor} className={iconClassNames} />
        </button>
        <button onClick={() => handleWindowSizeChange("normal")}>
          <VscChromeRestore fill={iconColor} className={iconClassNames} />
        </button>
      </div>
    </div>
  );
};

export default Topbar;
