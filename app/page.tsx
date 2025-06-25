import Chatbot from "@/components/chatbot";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col p-4 md:p-16 items-center bg-gray-700 text-white">
       <h1 className="text-2xl">Chatty AI</h1>
       <Chatbot />
    </main>
  );
}
