import { TbRobot } from "react-icons/tb";

export default function BotMessage({ message }: { message: string }) {
  return (
    <div className="flex items-start mb-4">
      <TbRobot size={20} className="text-gray-500 m-1 mr-2" />
      <div className="bg-gray-800 text-blue-300 text-sm p-2 rounded-lg max-w-xs break-all">
        {message}
      </div>
    </div>
  );
}