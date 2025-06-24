"use server"
import '../envConfig.ts'
import { Message, Faq } from "@/types";
import { AzureOpenAI } from "openai";
import path from "path";
import fs from "fs";

const endpoint = process.env.ENDPOINT_URL;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const apiVersion = process.env.API_VERSION;
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment});

const faqs = fs.readFileSync(path.join(process.cwd(), 'data/faqs.json'), 'utf-8');
const faqData = JSON.parse(faqs).faqs;

export async function chatCompletion(messages: Message[]) {
  try {
    const lastMsg = messages[messages.length - 1]
    if (!lastMsg || !lastMsg.content) {
      throw new Error("No message content provided");
    }
    console.log("checking in question exists in our json file", lastMsg.content)
    const faq = faqData.find((faq: Faq) => faq.question.toLowerCase().includes(lastMsg.content.toLowerCase()))

    if(faq) {
      console.log("Found FAQ answer:", faq.answer);
      return faq.answer;
    }
    console.log("No FAQ found, proceeding with OpenAI API call");
    // If no FAQ found, proceed with OpenAI API call
    const faqFedMessages = faqData.map((faq: Faq) => ({
      role: "system",
      content: `Question: ${faq.question}\nAnswer: ${faq.answer}`
    }));

    const response = await client.chat.completions.create({
      messages: [{'role': 'system', 'content': 'You are a helpful assistant.'}, ...faqFedMessages, ...messages],
      temperature: 0.7,
      model: deployment || "",
      max_tokens: 500
    })
    if (!response || !response.choices || response.choices.length === 0) {
      throw new Error("No response from OpenAI API");
    }
    if (!response.choices[0].message || !response.choices[0].message.content) {
      throw new Error("No content in OpenAI response");
    }
    console.log("Response from OpenAI:", response.choices[0].message);
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error in chatCompletion:", error);
    return "Sorry, I couldn't process your request at the moment. Please try again later.";
  }
}