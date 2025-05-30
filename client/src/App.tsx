import './App.css'
import Chatbot from './components/chatbot'

const className = 'bg-stone-800 w-screen h-screen text-white relative border border-amber-200 overflow-hidden';

function App() {

  return (
    <div className={className}>
      <Chatbot />
    </div>
  )
}

export default App