import { useState, useRef, useEffect } from "react";
import "./ChatBot.css";

export default function ChatBot() {

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi 👋 I am your AI Tutor! Ask me any CS concept." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  /* Auto scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* Send message to backend */
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;

    // show user message immediately
    setMessages(prev => [...prev, { from: "user", text: userText }]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: userText })
      });

      const data = await response.json();

      setMessages(prev => [
        ...prev,
        { from: "bot", text: data.reply }
      ]);

    } catch (error) {
      setMessages(prev => [
        ...prev,
        { from: "bot", text: "⚠️ Cannot reach AI server. Is backend running?" }
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <div className="chat-toggle" onClick={() => setOpen(!open)}>
        🤖
      </div>

      {/* Chat Window */}
      {open && (
        <div className="chatbox">

          <div className="chat-header">
            AI Tutor
            <span className="close-btn" onClick={() => setOpen(false)}>✖</span>
          </div>

          <div className="chat-body">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={msg.from === "bot" ? "bot-msg" : "user-msg"}
              >
                {msg.text}
              </div>
            ))}

            {loading && <div className="bot-msg">Typing...</div>}
            <div ref={bottomRef}></div>
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Ask something like: What is deadlock?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>

        </div>
      )}
    </>
  );
}