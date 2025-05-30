import ChatRoom from "./ChatRoom";
import Topbar from "./Topbar";

const className = 'flex flex-col w-[550px] max-w-2/6 max-h-[525px] bottom-3 right-5 absolute border';

function Chatbot() {
    return (
        <div className={className}>
            <Topbar />
            <ChatRoom />
        </div>
    )
}

export default Chatbot;