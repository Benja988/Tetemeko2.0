'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Mic, Send } from 'lucide-react'

const suggestedQuestions = [
  "How do I listen to your radio stations?",
  "Where are your studios located?",
  "How can I advertise with you?",
  "Can I request a song?"
]

export default function CustomerCareChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'bot' }>>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleSendMessage = () => {
    if (!inputValue.trim()) return
    
    const userMessage = { text: inputValue, sender: 'user' as const }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)
    
    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { 
          text: getBotResponse(inputValue), 
          sender: 'bot' 
        }
      ])
      setIsTyping(false)
    }, 1000 + Math.random() * 2000)
  }

  const getBotResponse = (question: string) => {
    const lowerQuestion = question.toLowerCase()
    
    if (lowerQuestion.includes('listen') || lowerQuestion.includes('radio')) {
      return "You can listen to our stations through our website, mobile app, or by tuning in to the FM frequencies in your area. Would you like me to send you the links?"
    } else if (lowerQuestion.includes('location') || lowerQuestion.includes('studio')) {
      return "Our main studio is located in Nairobi, with regional studios in Kisumu and Mombasa. You can find our exact addresses on the Contact page."
    } else if (lowerQuestion.includes('advertise')) {
      return "We offer various advertising packages! Please email sales@tetemekomediagroup.org with your requirements and our team will get back to you with options."
    } else if (lowerQuestion.includes('song')) {
      return "Yes! You can request songs by calling your favorite station's hotline or by using the request feature in our mobile app."
    } else {
      return "Thank you for your question! I've forwarded it to our support team who will respond via email within 24 hours. Is there anything else I can help with?"
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat button */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-xl transition-colors flex items-center justify-center"
        aria-label="Customer support chat"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25 }}
            className="absolute bottom-20 right-0 w-80 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col"
            style={{ height: '500px' }}
          >
            {/* Chat header */}
            <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <h3 className="font-semibold">Customer Support</h3>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {/* Chat messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-full mb-4">
                    <MessageCircle size={24} />
                  </div>
                  <h4 className="font-medium text-gray-800 mb-2">How can we help you today?</h4>
                  <p className="text-sm text-gray-500 mb-6">
                    Ask a question or choose from these common topics:
                  </p>
                  <div className="grid grid-cols-1 gap-2 w-full">
                    {suggestedQuestions.map((question, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setInputValue(question)}
                        className="text-left text-sm bg-white border border-gray-200 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                      >
                        {question}
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs rounded-xl p-3 ${message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200'}`}
                      >
                        {message.text}
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white border border-gray-200 rounded-xl p-3 flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Chat input */}
            <div className="border-t border-gray-200 p-3 bg-white">
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-500 hover:text-blue-600 rounded-full">
                  <Mic size={18} />
                </button>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className={`p-2 rounded-full ${inputValue.trim() ? 'text-blue-600 hover:bg-blue-50' : 'text-gray-400'}`}
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">
                Our AI assistant is available 24/7
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}