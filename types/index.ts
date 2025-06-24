export type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};
export type Faq = {
  question: string;
  answer: string;
};