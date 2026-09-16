import React, { useState, useRef, useEffect } from "react";
import { useShop } from "../context/ShopContext";
import { Product } from "../types";
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  ShoppingBag, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  RefreshCw
} from "lucide-react";

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  suggestedProducts?: Product[];
  actionType?: "PRE_OWNED" | "CUSTOM_STUDIO" | "VERIFY_LOOKUP";
}

export const AiCustomerAssistant: React.FC = () => {
  const { 
    isAiAssistantOpen, 
    setIsAiAssistantOpen, 
    products, 
    addToCart, 
    setSelectedProduct, 
    setActivePage,
    setIsSellItemModalOpen
  } = useShop();

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-1",
      sender: "ai",
      text: "Vanakkam & Welcome to ANIVA. I am your personal AI Stylist & Concierge. How may I assist you with our luxury apparel, custom print studio, or authenticated pre-owned vault today?",
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isAiAssistantOpen) {
      scrollToBottom();
    }
  }, [messages, isAiAssistantOpen]);

  const handleSend = async (userText?: string) => {
    const textToSend = userText || input;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: "msg-" + Date.now(),
      sender: "user",
      text: textToSend
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!userText) setInput("");
    setLoading(true);

    // Call server AI endpoint or intelligent grounded fallback
    try {
      const res = await fetch("/api/ai/stylist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: textToSend })
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: Message = {
          id: "msg-" + (Date.now() + 1),
          sender: "ai",
          text: data.reply || "Here is what I recommend for your style profile:",
          suggestedProducts: data.productIds ? products.filter(p => data.productIds.includes(p.id)) : undefined
        };
        setMessages((prev) => [...prev, aiMsg]);
        setLoading(false);
        return;
      }
    } catch {
      // Intelligent rule-based grounded luxury concierge fallback
    }

    setTimeout(() => {
      const lower = textToSend.toLowerCase();
      let replyText = "";
      let matchedProds: Product[] = [];
      let action: Message["actionType"] = undefined;

      if (lower.includes("watch") || lower.includes("omega") || lower.includes("rolex") || lower.includes("pre-owned") || lower.includes("grade")) {
        replyText = "Our ANIVA Pre-Owned Vault features 100% physically authenticated timepieces and collector sneakers. Grade S represents pristine like-new condition with full box and warranty papers, while Grade A denotes minor microscopic hairline marks.";
        matchedProds = products.filter(p => p.isPreOwned).slice(0, 2);
        action = "PRE_OWNED";
      } else if (lower.includes("custom") || lower.includes("print") || lower.includes("design") || lower.includes("dtg")) {
        replyText = "In our Custom Print Studio, you can configure custom tees with live 3D print area placement, HD DTG print scaling, and South Indian custom motifs.";
        action = "CUSTOM_STUDIO";
      } else if (lower.includes("t-shirt") || lower.includes("plain") || lower.includes("oversized") || lower.includes("tee")) {
        replyText = "Our t-shirt collections are designed for everyday style and comfort, offering relaxed silhouettes suited for South India and across India.";
        matchedProds = products.filter(p => p.category.includes("T-Shirts")).slice(0, 2);
      } else if (lower.includes("shoe") || lower.includes("sneaker") || lower.includes("jordan")) {
        replyText = "Here are our curated luxury footwear and verified grails, inspected for zero sole separation and 100% genuine provenance:";
        matchedProds = products.filter(p => p.category.includes("Shoes") || p.category.includes("Footwear")).slice(0, 2);
      } else if (lower.includes("ship") || lower.includes("delivery") || lower.includes("south india") || lower.includes("city")) {
        replyText = "We offer 24-to-48 hour express delivery across Chennai, Bengaluru, Hyderabad, Kochi, Coimbatore, and Visakhapatnam via our direct BlueDart Priority Air logistics.";
      } else {
        replyText = "Here are our top trending pieces curated for effortless modern luxury and all-day comfort:";
        matchedProds = products.filter(p => p.isTrending || p.isNewArrival).slice(0, 2);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: "msg-" + (Date.now() + 1),
          sender: "ai",
          text: replyText,
          suggestedProducts: matchedProds.length > 0 ? matchedProds : undefined,
          actionType: action
        }
      ]);
      setLoading(false);
    }, 600);
  };

  const quickPrompts = [
    "Recommend breathable oversized tees for South Indian weather",
    "Show me verified pre-owned Omega & Jordan grails",
    "How does the ANIVA physical authentication inspection work?",
    "Take me to the Custom Print Studio"
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsAiAssistantOpen(!isAiAssistantOpen)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-[#C9A86A] to-[#b89558] text-[#0D0D0D] font-bold p-3.5 sm:px-5 sm:py-3 rounded-full shadow-2xl flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95 border-2 border-[#121212] cursor-pointer"
        aria-label="Open AI Stylist Concierge"
      >
        <Sparkles className="w-5 h-5 animate-pulse" />
        <span className="hidden sm:inline font-mono text-xs uppercase tracking-wider font-bold">
          ANIVA AI Concierge
        </span>
      </button>

      {/* Floating Chat Window Modal */}
      {isAiAssistantOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[92vw] sm:w-96 md:w-[420px] h-[550px] bg-[#121212] border-2 border-[#C9A86A]/60 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[#F8F6F2] animate-fadeIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1A1814] to-[#121212] p-4 border-b border-[#262626] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#C9A86A]/20 border border-[#C9A86A] flex items-center justify-center text-[#C9A86A]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold text-white flex items-center gap-1.5">
                  <span>ANIVA AI Stylist</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </h3>
                <p className="text-2xs font-mono text-[#C9A86A] uppercase tracking-wider">
                  Luxury Fashion & Provenance Guide
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsAiAssistantOpen(false)}
              className="text-neutral-400 hover:text-white p-1.5 rounded-full hover:bg-[#222] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "ai" && (
                  <div className="w-6 h-6 rounded-full bg-[#C9A86A]/20 border border-[#C9A86A]/50 flex items-center justify-center text-[#C9A86A] shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] p-3.5 rounded-2xl space-y-2 leading-relaxed ${
                    m.sender === "user"
                      ? "bg-[#C9A86A] text-[#0D0D0D] font-medium rounded-tr-none"
                      : "bg-[#1A1A1A] border border-[#2A2A2A] text-neutral-200 rounded-tl-none"
                  }`}
                >
                  <p>{m.text}</p>

                  {/* Suggested Products Display */}
                  {m.suggestedProducts && m.suggestedProducts.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-[#333]">
                      {m.suggestedProducts.map((p) => (
                        <div
                          key={p.id}
                          className="bg-[#121212] p-2 rounded-xl border border-[#2A2A2A] flex items-center justify-between gap-2"
                        >
                          <div
                            onClick={() => {
                              setSelectedProduct(p);
                              setIsAiAssistantOpen(false);
                            }}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="w-10 h-10 object-cover rounded-lg"
                            />
                            <div className="text-left">
                              <span className="text-2xs font-bold text-white line-clamp-1">{p.name}</span>
                              <span className="text-2xs font-mono text-[#C9A86A]">₹{p.price.toLocaleString()}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => addToCart(p, p.sizes[0] || "M", p.colors[0] || { name: "Black", hex: "#000" })}
                            className="bg-[#C9A86A] text-black font-bold p-1.5 rounded-lg hover:bg-white text-2xs uppercase tracking-wider shrink-0 cursor-pointer"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Contextual Action Button */}
                  {m.actionType === "PRE_OWNED" && (
                    <button
                      onClick={() => {
                        setActivePage("pre-owned");
                        setIsAiAssistantOpen(false);
                      }}
                      className="w-full bg-[#262626] hover:bg-[#333] text-[#C9A86A] border border-[#C9A86A]/40 font-mono text-2xs py-1.5 rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Explore Pre-Owned Vault</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}

                  {m.actionType === "CUSTOM_STUDIO" && (
                    <button
                      onClick={() => {
                        setActivePage("custom-studio");
                        setIsAiAssistantOpen(false);
                      }}
                      className="w-full bg-[#262626] hover:bg-[#333] text-[#C9A86A] border border-[#C9A86A]/40 font-mono text-2xs py-1.5 rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Open Custom Print Studio</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {m.sender === "user" && (
                  <div className="w-6 h-6 rounded-full bg-[#333] flex items-center justify-center text-white shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-neutral-400 text-2xs font-mono">
                <div className="w-2 h-2 rounded-full bg-[#C9A86A] animate-ping" />
                <span>ANIVA AI is styling recommendations...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Preset Prompts */}
          <div className="p-2 bg-[#161616] border-t border-[#262626] flex items-center gap-1.5 overflow-x-auto">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-[#202020] hover:bg-[#2A2A2A] text-neutral-300 text-2xs font-sans border border-[#333] transition-colors cursor-pointer shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-[#121212] border-t border-[#262626] flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about styling, sizes, pre-owned vault..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-[#1A1A1A] border border-[#333] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#C9A86A]"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-[#C9A86A] disabled:opacity-40 hover:bg-[#b89558] text-[#0D0D0D] font-bold p-2.5 rounded-xl cursor-pointer transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
