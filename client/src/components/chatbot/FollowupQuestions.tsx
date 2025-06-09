import { useDispatch } from "react-redux";
import { setConversation } from "../../redux/slices/botSlice";

interface FolllowupProps {
  questions: Array<string>;
  sendMessage: (message: string) => void;
}

const FollowupQestions = (props: FolllowupProps) => {
  const dispatch = useDispatch();
  console.log("follow up questions are", props.questions);
  const onQuestionClick = (question: string) => {
    dispatch(
      setConversation({
        message: question,
        writer: "user",
      })
    );
    props.sendMessage(question);
  };
  return (
    <div className="ml-16 mt-1 max-w-[calc(90%-48px)] sm:max-w-[calc(80%-48px)]">
      <p className=" mt-3">Possible follow-up questions</p>
      <div className=" inline-flex flex-col  bg-slate-700 p-1.5 gap-y-2 mt-2 rounded-md rounded-tl-none">
        {props.questions.map((question, index) => (
          <button
            type="button"
            className={`inline cursor-pointer text-sm sm:text-base hover:font-bold transition-all duration-200 ease-in break-words text-left p-[12px] ${
              index == props.questions.length - 1
                ? ""
                : " border-b-[#4C586D]  border-b"
            }`}
            onClick={() => onQuestionClick(question)}
            key={index}
          >
            <span className="flex gap-2">
              <span>{index + 1}. </span>
              <span>{question}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FollowupQestions;
