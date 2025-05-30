import React, { useState } from "react";
import { IoIosSend } from "react-icons/io";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { useDispatch } from "react-redux";
import { setConversation } from "../../redux/slices/botSlice";

const className = 'w-[80%] outline-0 p-1 text-normal px-2 resize-none bg-gray-700 h-[60px] rounded-md';

interface InputBoxProps {
    sendMessage: (message: string) => void;
}

const InputBox: React.FC<InputBoxProps> = ({ sendMessage }) => {
    const [input, setInput] = useState('');
    const isProcessing = useSelector((state: RootState) => state.bot.isProcessing);
    const dispatch = useDispatch();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            sendMessage(input.trim());
            dispatch(setConversation({message: input.trim(), writer: 'user'}))
            setInput('');
        }
    };

    return (
        <form className="mt-7 mb-3 flex justify-center gap-x-1" onSubmit={handleSubmit}>
            <textarea
                className={className}
                placeholder="Ask anything related to T3k."
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className='px-2 inline cursor-pointer disabled:text-red-500' disabled={isProcessing}>
                <IoIosSend className="rounded-full" fontSize={30} />
            </button>
        </form>
    );
};

export default InputBox;