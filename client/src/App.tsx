import "./App.css";
import Chatbot from "./components/chatbot";

const className =
  "bg-stone-800 w-screen h-screen text-white relative overflow-hidden";

function App() {
  return (
    <div className={className} id="app">
      <Chatbot />
    </div>
  );
}

export default App;