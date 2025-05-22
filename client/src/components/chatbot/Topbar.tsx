import { VscChromeMinimize, VscChromeRestore, VscClose } from "react-icons/vsc";

const iconColor = "#ffffff";
const iconClassNames = "text-2xl  leading-1"

const Topbar = () => {
  return (
    <div className=" flex justify-between bg-purple-500 p-2 ">
      <div>
        <h3 className=" text-lg font-normal">T3botics</h3>
      </div>
      <div className="flex items-center gap-x-5  mr-2">
        <button className="">
          <VscChromeMinimize fill={iconColor} className={iconClassNames} />
        </button>
        <button className="">
          <VscChromeRestore fill={iconColor} className={iconClassNames} />
        </button>
        <button className="">
          <VscClose fill={iconColor} className={iconClassNames} />
        </button>
      </div>
    </div>
  )
}

export default Topbar
