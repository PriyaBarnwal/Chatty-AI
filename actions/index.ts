"use server"
import '../envConfig.ts'
import { Message, Faq } from "@/types";
import { AzureOpenAI } from "openai";
import path from "path";
import fs from "fs";
import OpenAI from 'openai/index.js';

const endpoint = process.env.ENDPOINT_URL;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const apiVersion = process.env.API_VERSION;
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment});

function loadFaqData(): Faq[] {
  try {
    const filePath = path.join(process.cwd(), "data/faqs.json");
    const content = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed.faqs)) throw new Error("Invalid FAQ format");
    return parsed.faqs;
  } catch (err) {
    console.error("Error loading FAQ data:", err);
    return [];
  }
}

const faqData = loadFaqData();

export async function chatCompletion(messages: Message[]) {
  try {
    const lastMsg = messages[messages.length - 1]
    if (!lastMsg || !lastMsg.content) {
      throw new Error("No message content provided");
    }
    console.log("checking if question exists in our json file", lastMsg.content)
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
      messages: [{'role': 'system', 'content': 'You are a helpful assistant.'}, ...faqFedMessages, ...messages] as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
      temperature: 0.7,
      model: deployment || "",
      max_tokens: 500
    })
    const reply = response?.choices?.[0]?.message?.content;
    if (!reply) {
      throw new Error("No content in OpenAI response");
    }
    console.log("Response from OpenAI:", reply);
    return reply;
  } catch (error) {
    console.error("Error in chatCompletion:", error);
    return "Sorry, I couldn't process your request at the moment. Please try again later.";
  }
}