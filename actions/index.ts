"use server"
import '../envConfig.ts'
import { Message } from "@/components/chatbot";
import { AzureOpenAI } from "openai";

export async function chatCompletion(messages: Message[]) {
  const endpoint = process.env.ENDPOINT_URL;
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const apiVersion = process.env.API_VERSION;
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
  console.log("Endpoint:", endpoint, apiKey, apiVersion, deployment);
  const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment});
  const response = await client.chat.completions.create({
    messages: [{'role': 'system', 'content': 'You are a helpful assistant.'}, ...messages],
    temperature: 0.7,
    model: deployment || "",
    max_tokens: 1000
  })
  console.log("Response from OpenAI:", response.choices[0].message);
  return response.choices[0].message.content;
}