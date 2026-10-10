import React, { useState } from 'react';
import { Send, Sparkles, User, Bot, BookOpen, PenTool, Mic, RotateCcw } from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    sender: 'assistant',
    text: "Hello! I'm Arik's AI IELTS Study Assistant. How can I help you accelerate your IELTS journey today? You can ask me to evaluate an essay paragraph, explain tricky reading question types (like True/False/Not Given), provide Band 8+ vocabulary, or simulate Speaking Part 2 cues.",
    time: 'Just now'
  }
];

export const StudyChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const samplePrompts = [
    'How do I distinguish between "False" and "Not Given" in IELTS Reading?',
    'Give me Band 8 vocabulary for an essay on Environmental Protection',
    'What are the 4 scoring criteria for IELTS Writing Task 2?',
    'Give me a Speaking Part 2 cue card on a memorable journey'
  ];

  const handleSend = (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      time: 'Now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      let reply = '';
      const lower = userText.toLowerCase();

      if (lower.includes('false') || lower.includes('not given')) {
        reply = `Here is Arik's golden rule for True / False / Not Given:\n\n• **TRUE**: The passage clearly confirms the fact (exact meaning or synonymous paraphrase).\n• **FALSE**: The passage directly contradicts or says the opposite of the statement.\n• **NOT GIVEN**: The passage mentions the topic, but neither confirms nor contradicts the specific relationship claimed in the question. Never use outside real-world knowledge!`;
      } else if (lower.includes('vocab') || lower.includes('environment')) {
        reply = `Here are 5 Band 8+ lexical resource power terms for Environmental topics:\n\n1. **Precipitous decline** - Rapid, steep decrease (e.g., 'a precipitous decline in biodiversity').\n2. **Mitigate repercussions** - Lessen negative consequences.\n3. **Anthropogenic emissions** - Pollution resulting from human influence.\n4. **Infrastructural inertia** - Reluctance or delay in updating existing fossil energy grids.\n5. **Sustainable stewardship** - Responsible planning and management of finite natural resources.`;
      } else if (lower.includes('criteria') || lower.includes('writing')) {
        reply = `IELTS Writing Task 2 is assessed equally across 4 key criteria (25% each):\n\n1. **Task Achievement / Response**: Addressing all parts of prompt with a clear position throughout.\n2. **Coherence & Cohesion**: Logical organization, clear paragraphing, varied linking devices without overuse.\n3. **Lexical Resource**: Wide range of academic vocabulary, natural collocations, precision, rare errors.\n4. **Grammatical Range & Accuracy**: Complex sentence structures (conditionals, relative clauses, passives) with high accuracy.`;
      } else if (lower.includes('speaking') || lower.includes('cue card')) {
        reply = `Here is a practice Speaking Part 2 topic:\n\n**Describe a memorable journey you took by public transport.**\nYou should say:\n• Where you went and when\n• What kind of public transport you used\n• Who accompanied you\nAnd explain why this journey was particularly memorable to you.\n\n*Tip from Arik:* Spend your 1 minute prep writing bullet points for descriptive adjectives and transition words!`;
      } else {
        reply = `That is a fantastic IELTS question. Consistent targeted practice with authentic tests and active vocabulary review is the proven pathway to achieving your target band score. Feel free to ask more specific questions about reading techniques, writing structure, or vocabulary collocations!`;
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: reply,
        time: 'Just now'
      };

      setMessages((prev) => [...prev, botMsg]);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="pb-4 border-b border-[#E7E3D9] mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#084F7D] text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-snug">
              Ask Arik • AI IELTS Study Assistant
            </h1>
            <p className="text-xs text-slate-500">
              Instant academic writing feedback, speaking prompts, and exam tips
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages(INITIAL_MESSAGES)}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 p-2 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Suggested prompts */}
      {messages.length === 1 && (
        <div className="mb-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Suggested Queries:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {samplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="text-left text-xs p-3 rounded-xl border border-[#E7E3D9] bg-white hover:border-[#084F7D] hover:bg-[#FAF9F5] text-slate-700 transition-all font-medium"
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-[#084F7D] text-white'
                  : 'bg-[#FEF7EE] text-[#FC9F23] border border-[#FC9F23]/30'
              }`}
            >
              {msg.sender === 'user' ? (
                <User className="w-4 h-4" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
            </div>

            <div
              className={`max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-2xs ${
                msg.sender === 'user'
                  ? 'bg-[#084F7D] text-white rounded-tr-none'
                  : 'bg-white border border-[#E7E3D9] text-slate-800 rounded-tl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#FEF7EE] text-[#FC9F23] border border-[#FC9F23]/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white border border-[#E7E3D9] rounded-2xl rounded-tl-none p-4 text-xs text-slate-400">
              Arik is analyzing your question...
            </div>
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="pt-4 mt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex items-center gap-2 bg-white rounded-2xl border border-[#E7E3D9] p-2 shadow-2xs focus-within:border-[#084F7D] focus-within:ring-2 focus-within:ring-[#084F7D]/20 transition-all"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about IELTS preparation, grammar, or exam strategies..."
            className="flex-1 px-3 py-2 text-sm bg-transparent border-0 focus:outline-none text-slate-900"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-[#084F7D] hover:bg-[#063D62] text-white disabled:opacity-40 transition-colors shadow-2xs shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
