import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { FiSend, FiUser } from "react-icons/fi";
import { BsRobot, BsLightningCharge, BsStars } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";


function JobAI() {
  const [chatHistory, setChatHistory] = useState([]);
  const [question, setQuestion] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const API_KEY = import.meta.env.VITE_WOW;

  const chatContainerRef = useRef(null);

  const quickQuestions = [
    "How can I improve my resume for tech jobs?",
    "What are common interview questions for software engineering roles?",
    "How to negotiate a better salary?",
    "What skills are in demand for remote jobs?",
    "Tips for career change to data science",
  ];

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, generatingAnswer]);

  const generateAnswer = async (e) => {
    e?.preventDefault();
    if (!question.trim()) return;

    setGeneratingAnswer(true);
    const currentQuestion = question;
    setQuestion("");

    setChatHistory((prev) => [
      ...prev,
      { type: "question", content: currentQuestion },
    ]);

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
        {
          contents: [{ parts: [{ text: currentQuestion }] }],
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const aiResponse =
        response.data.candidates[0]?.content?.parts[0]?.text ||
        "Sorry, I couldn't generate a response.";

      setChatHistory((prev) => [
        ...prev,
        { type: "answer", content: aiResponse },
      ]);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      setChatHistory((prev) => [
        ...prev,
        {
          type: "answer",
          content: "Sorry - Something went wrong. Please try again!",
        },
      ]);
    }

    setGeneratingAnswer(false);
  };

  const handleQuickQuestion = (q) => {
    setQuestion(q);
    setTimeout(() => generateAnswer(), 100);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pt-5 pb-20">
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Sidebar */}
          <aside className="hidden lg:block lg:w-1/4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sticky top-5">
              <div className="flex items-center space-x-3 mb-5">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-500 dark:text-blue-400">
                  <BsRobot className="text-xl" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">JobAI Assistant</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Your career copilot
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                  Quick Actions
                </h3>
                {[
                  {
                    icon: "📝",
                    text: "Resume Review",
                    query: "Review my resume for a software engineer position",
                  },
                  {
                    icon: "💬",
                    text: "Interview Prep",
                    query: "Prepare me for a backend developer interview",
                  },
                  {
                    icon: "📊",
                    text: "Job Trends",
                    query:
                      "What are the highest paying jobs in tech right now?",
                  },
                  {
                    icon: "🔄",
                    text: "Career Change",
                    query:
                      "How to transition from web development to mobile app development?",
                  },
                ].map((item, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleQuickQuestion(item.query)}
                    className="w-full text-left p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors flex items-center"
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    <span>{item.text}</span>
                  </motion.button>
                ))}
              </div>

              <div className="mt-6 p-3 bg-blue-50 dark:bg-gray-700 rounded-lg text-center">
                <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <BsStars className="mr-1" />
                  Pro Tip: Ask about specific companies or roles
                </p>
              </div>
            </div>
          </aside>

          {/* Main Chat Area */}
          <section className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Chat Header */}
              <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
                <h1 className="text-xl font-bold flex items-center">
                  <span className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-500 dark:text-blue-400 mr-3">
                    <BsRobot />
                  </span>
                  Job Assistant
                </h1>
                <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm flex items-center">
                  <BsLightningCharge className="mr-1" />
                  Powered by Gemini
                </div>
              </div>

              {/* Chat Messages */}
              <div
                ref={chatContainerRef}
                className="h-[calc(100vh-280px)] overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900/50"
              >
                {chatHistory.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center p-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="max-w-2xl w-full rounded-xl p-6 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full w-max mx-auto mb-5 text-blue-500 dark:text-blue-400">
                        <BsRobot className="text-3xl" />
                      </div>
                      <h2 className="text-2xl font-bold text-center mb-3 text-gray-800 dark:text-white">
                        How can I help with your career today?
                      </h2>
                      <p className="text-center mb-6 text-gray-600 dark:text-gray-300">
                        Ask me about resume tips, interview prep, salary
                        negotiation, or career changes.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                        {quickQuestions.map((q, i) => (
                          <motion.button
                            key={i}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => handleQuickQuestion(q)}
                            className="p-3 text-left rounded-lg bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 transition-colors"
                          >
                            <div className="font-medium text-gray-800 dark:text-gray-200">
                              {q.split("?")[0]}
                            </div>
                            <div className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                              Click to ask
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                ) : (
                  <AnimatePresence>
                    <div className="space-y-4">
                      {chatHistory.map((chat, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${
                            chat.type === "question"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-3xl rounded-2xl p-4 ${
                              chat.type === "question"
                                ? "bg-blue-500 text-white rounded-br-none dark:bg-blue-600"
                                : "bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-bl-none"
                            }`}
                          >
                            <div className="flex items-start">
                              {chat.type === "answer" && (
                                <div className="p-1.5 mr-2 mt-0.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-500 dark:text-blue-400">
                                  <BsRobot />
                                </div>
                              )}
                              {chat.type === "question" && (
                                <div className="p-1.5 mr-2 mt-0.5 bg-white/20 rounded-lg">
                                  <FiUser className="text-blue-200" />
                                </div>
                              )}
                              <div
                                className={`prose prose-sm max-w-none ${
                                  chat.type === "answer"
                                    ? "dark:prose-invert"
                                    : ""
                                }`}
                              >
                                <ReactMarkdown>{chat.content}</ReactMarkdown>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      {generatingAnswer && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex justify-start"
                        >
                          <div className="max-w-3xl rounded-2xl rounded-bl-none p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-lg">
                            <div className="flex items-center space-x-3">
                              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-500 dark:text-blue-400">
                                <BsRobot />
                              </div>
                              <div className="flex space-x-1">
                                <div
                                  className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                                  style={{ animationDelay: "0ms" }}
                                />
                                <div
                                  className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                                  style={{ animationDelay: "150ms" }}
                                />
                                <div
                                  className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                                  style={{ animationDelay: "300ms" }}
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </AnimatePresence>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
                <form onSubmit={generateAnswer}>
                  <div className="relative">
                    <textarea
                      required
                      className="w-full rounded-xl pl-4 pr-12 py-3 focus:ring-2 resize-none bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Ask JobAI anything about careers, jobs, or interviews..."
                      rows="2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          generateAnswer(e);
                        }
                      }}
                    />
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      disabled={generatingAnswer || !question.trim()}
                      className={`absolute right-3 bottom-3 p-2 rounded-full ${
                        generatingAnswer || !question.trim()
                          ? "text-gray-400 bg-gray-200 dark:bg-gray-600"
                          : "text-white bg-blue-500 hover:bg-blue-600 shadow-md"
                      }`}
                    >
                      <FiSend className="w-5 h-5" />
                    </motion.button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3 justify-center">
                    {quickQuestions.slice(0, 3).map((q, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => handleQuickQuestion(q)}
                        className="text-xs px-3 py-1.5 rounded-full bg-blue-100 dark:bg-gray-700 hover:bg-blue-200 dark:hover:bg-gray-600 text-blue-700 dark:text-gray-300 transition-colors"
                      >
                        {q.split("?")[0].substring(0, 20)}...
                      </motion.button>
                    ))}
                  </div>
                </form>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default JobAI;
