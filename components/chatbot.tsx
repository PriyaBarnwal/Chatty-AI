"use client";
import { FormEvent, useState } from "react";
import { RiChatSmile2Fill } from "react-icons/ri"
import BotMessage from "./ui/botMessage";
import UserMessage from "./ui/userMessage";
import InputUI from "./ui/inputUI";
import { chatCompletion } from "@/actions";
import TypingIndicator from "./ui/typing";

export type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};
export default function Chatbot() {
  const [showChatbot, setShowChatbot] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello, I am Chatty! How can I assist you today?" }
  ])
  const [loading, setLoading] = useState<boolean>(false)

  const handleSend = async(e: FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return; // Prevent sending empty messages
    const newMessage: Message = { role: "user", content: inputValue }
    setLoading(true)

    try {
      const chatMessages: Message[] = messages.slice(1)
      setMessages((prevMessages)=> [...prevMessages, newMessage])
      setInputValue("")
      const res = await chatCompletion([ ...chatMessages, newMessage ])
      console.log("***", res)
      setLoading(false) 
      setMessages((prevMessages)=> [...prevMessages, { role: "assistant", content: res as string }])
    } catch (error) {
      console.error("Error sending message:", error);
      setLoading(false);
      return;
    }
  }

  return (
    <div>
        <RiChatSmile2Fill size={42} className="fixed right-12 bottom-[calc(1rem)] hover:cursor-pointer" onClick={() => setShowChatbot(!showChatbot)}/>
        {showChatbot && (
        <div className="fixed right-12 bottom-[calc(4.5rem)] p-3 shadow-sm shadow-white border rounded-md w-105 h-150   bg-gray-900">
            <div className="flex flex-col items-center">
                <h2 className="text-xl font-bold mt-1">Chatty</h2>
                <p className="text-xs">( powered by OpenAI )</p>
            </div>
            <div className="flex flex-col h-[79%] overflow-y-auto mt-4 p-2">
              {messages?.map((message, index) => {
                if (message.role === "assistant") {
                  return <BotMessage key={index} message={message.content} />
                } else
                if (message.role === "user") {
                  return <UserMessage key={index} message={message.content} />
                }
                return null
              })}
              {loading && <TypingIndicator />}
            </div>
            <InputUI
                inputValue={inputValue}
                setInputValue={setInputValue}
                handleSend={handleSend}
            />
          </div>)}
    </div>)
}