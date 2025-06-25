"use client";
import { FormEvent, useState, useRef, useEffect } from "react";
import { RiChatSmile2Fill } from "react-icons/ri"
import BotMessage from "./ui/botMessage";
import UserMessage from "./ui/userMessage";
import InputUI from "./ui/inputUI";
import { chatCompletion } from "@/actions";
import TypingIndicator from "./ui/typing";
import { Message } from "@/types";


export default function Chatbot() {
  const chatbotRef = useRef<HTMLDivElement>(null)
  
  const [showChatbot, setShowChatbot] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello, I am Chatty! How can I assist you today?" }
  ])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if(chatbotRef.current) {
      chatbotRef.current.scrollTo({
        top: chatbotRef.current.scrollHeight,
        behavior: "smooth"
      })
    }
  }, [ messages, loading])

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
        <RiChatSmile2Fill size={42} className="fixed right-4 md:right-12 bottom-[calc(1rem)] hover:cursor-pointer" onClick={() => setShowChatbot(!showChatbot)}/>
        {showChatbot && (
        <div className="w-[320px] h-[600px] md:w-[400px] md:h-[650px] fixed right-4 md:right-12 bottom-[calc(4.5rem)] p-3 shadow-sm shadow-white border rounded-md bg-gray-900">
            <div className="flex flex-col items-center border-b border-white pb-1">
                <h2 className="text-xl font-bold">Chatty</h2>
                <p className="text-xs mb-1">( powered by OpenAI )</p>
            </div>
            <div ref={chatbotRef} className="flex flex-col h-[79%] overflow-y-auto mt-4 p-2">
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