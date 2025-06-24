import { PiUserCircle } from "react-icons/pi"

export default function UserMessage({ message }: { message: string }) {
  return (
    <div className="flex items-start justify-end mb-4">
      <div className="bg-gray-800 text-blue-200 text-sm p-2 rounded-lg max-w-xs text-wrap break-all">
        {message}
      </div>
      <PiUserCircle size={20} className="text-gray-500 m-1 ml-2" />
    </div>
  );
}