import { FormEvent } from "react";
import { BsSendFill } from "react-icons/bs";

export default function InputUI({
  inputValue,
  setInputValue,
  handleSend,
}: {
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSend: (e: FormEvent) => void;
}) {
  return (
    <form onSubmit={handleSend} className="flex items-center p-2 bg-gray-800 rounded-lg">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && inputValue.trim()) {
            handleSend(e);
          }
        }}
        placeholder="Type your message..."
        className="flex-grow bg-gray-700 text-white p-2 rounded-lg focus:outline-none"
      />
      <button
        type="submit"
        className="ml-2 text-blue-500 hover:text-blue-400"
      >
        <BsSendFill size={24} />
      </button>
    </form>
  );
}