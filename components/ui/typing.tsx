import { TbRobot } from "react-icons/tb";

const TypingIndicator = () => {
  return (
    <div className="flex items-start mb-4">
      <TbRobot size={20} className="text-gray-500 m-1" />
      <div className="flex items-center space-x-1 rounded-full px-3 pt-3 pb-1 w-fit shadow-sm">
        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce [animation-delay:0s]" />
        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce [animation-delay:0.15s]" />
        <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce [animation-delay:0.3s]" />
      </div>
    </div>
  )
};

export default TypingIndicator;