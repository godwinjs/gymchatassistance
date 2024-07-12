import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

function readFile(fileurl) {
  fetch(fileurl)
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.text();
      })
      .then(text => {
          console.log(text); // Here you can do something with the text content
      })
      .catch(error => {
          console.error('Error fetching the file:', error);
      });
}

export async function addDatabaseTable() {

  console.log(process.env.NODE_ENV)
  console.log("Split text added to database table successfully!")

  try {
    const text = readFile("./gym-faqs.txt");
    console.log(text)
  
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
      separators: ["\n\n", "\n", " ", ""],
    });
  
    const output = await splitter.createDocuments([text]);
    
    const sbApiKey = import.meta.env.VITE_SUPABASE_API_KEY;
    const sbUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
    // const openAIApiKey = import.meta.env.OPENAI_API_KEY;
    const googleAiAPIkey = import.meta.env.VITE_GOOGLEAI_API_KEY;
  
    if (!sbApiKey || !sbUrl || !googleAiAPIkey) {
      throw new Error(
        "Supabase/OpenAI environment variables not set. Please set them in the .env file"
      );
    }
  
    // const embeddings = new OpenAIEmbeddings({ openAIApiKey });
    const embeddingModel = new GoogleGenerativeAIEmbeddings({
      apiKey: googleAiAPIkey,
    });
  
    const supabaseClient = createClient(sbUrl, sbApiKey);
  
    await SupabaseVectorStore.fromDocuments(output, embeddingModel, {
      client: supabaseClient,
      tableName: "documents",
      queryName: "match_documents",
    });
  
    console.log("Success!");
  } catch (err) {
    console.log(err);
  }

}
