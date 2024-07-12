"use client";

import React from "react";
import Image from "next/image";

import { chain, addDatabaseTable } from '@/app/utils/ai';
import send from "@/public/images/send.svg"
import styles from "./page.module.css";

function readFile() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  const reader = new FileReader();
  reader.onload = function(event) {
      const content = event.target.result;
      document.getElementById('fileContent').textContent = content;
  };

  reader.onerror = function(event) {
      console.error("Error reading file:", event.target.error);
  };

  if (file) {
      reader.readAsText(file);
  }
}

export default function Home() {
  let effectCount = 0;

    //
    const runConversation = async () => {
      const userInput = document.getElementById("user-input");
      const question = userInput.value;
      userInput.value = "";
  
      const chatbotConversation = document.getElementById(
        "chatbot-conversation-container"
      );
  
      // add human message
      const newHumanSpeechBubble = document.createElement("div");
      newHumanSpeechBubble.classList.add("speech", "speech-human");
      chatbotConversation.appendChild(newHumanSpeechBubble);
      newHumanSpeechBubble.textContent = question;
      chatbotConversation.scrollTop = chatbotConversation.scrollHeight;
  
      const input = { question };
      const { result } = await chain.invoke(input);
  
      // add AI message
      const newAiSpeechBubble = document.createElement("div");
      newAiSpeechBubble.classList.add("speech", "speech-ai");
      chatbotConversation.appendChild(newAiSpeechBubble);
      newAiSpeechBubble.textContent = result;
      chatbotConversation.scrollTop = chatbotConversation.scrollHeight;
    };

  React.useEffect(() => {
    effectCount++
    // Add an event listener to the DOM
    document.addEventListener("submit", (e) => {
      e.preventDefault();
      document.getElementById("user-input").innerHTML = " "

      runConversation()
    });

    // Add an event listener to the DOM when doc is fully loaded
    document.addEventListener("DOMContentLoaded", (e) => {
      addDatabaseTable()
    });
  }, [])

  // const handleSubmit = async (e) => {
  //   e.preventDefault()
  //   console.log(e)
  // }

  return (
    <main className={styles.main}>
        <section className={styles.chatbotContainer}>
            <div className={styles.chatbotHeader}>
                <h1 className={styles.heading}>Chat Assist</h1>
                <p className={styles.subHeading}>Gym Buddy</p>
            </div>
            <div className={styles.chatbotConversationContainer} id="chatbot-conversation-container">
            </div>
            <form id="form" className={styles.chatbotInputContainer}>
                <input name="input" className={styles.input} type="text" id="user-input" placeholder="Start typing..." required />
                <button id="submit-btn" className={styles.submitBtn + " " + styles.button}>
                        <Image
                            src={send}  
                            className={styles.sendBtnIcon}
                            alt='send button image'
                            width={50}
                            height={30}
                        />
                </button>
            </form>
        </section>
    </main>
  );
}
