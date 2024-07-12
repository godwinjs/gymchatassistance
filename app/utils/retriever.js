import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
// import { OpenAIEmbeddings } from "@langchain/openai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { createClient } from "@supabase/supabase-js";

const googleAIApiKey = process.env.GOOGLEAI_API_KEY;
const sbApiKey = process.env.SUPABASE_API_KEY;
const sbUrl = process.env.SUPABASE_PROJECT_URL;

console.log(process.env.GOOGLEAI_API_KEY)

if (!sbApiKey || !sbUrl || !googleAIApiKey) {
  console.log("Supabase/OpenAI environment variables not set. Please set them in the .env file")
  // throw new Error(
  //   "Supabase/OpenAI environment variables not set. Please set them in the .env file"
  // );
}

const embeddings = new GoogleGenerativeAIEmbeddings({ apiKey: googleAIApiKey });


const supabaseClient = createClient(sbUrl, sbApiKey);

const vectorStore = new SupabaseVectorStore(embeddings, {
  client: supabaseClient,
  tableName: "documents",
  queryName: "match_documents",
});

const retriever = vectorStore.asRetriever();

export { retriever };
