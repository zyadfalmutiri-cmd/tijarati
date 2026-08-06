"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { askAssistant } from "@/lib/ai/assistant";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  highlights?: { label: string; value: string }[];
}

const suggestions = [
  "لماذا تنخفض المبيعات؟",
  "ما هو أفضل فرع أداءً؟",
  "ما المنتجات الأعلى ربحًا؟",
  "توقع مبيعات الشهر القادم",
  "اقترح إجراءات لتحسين الربح",
];

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "assistant", text: "مرحبًا! أنا مساعدك الذكي في تجارتي. اسألني عن أداء فروعك، أسباب تغيّر المبيعات، أكثر المنتجات ربحية، أو توقعات المستقبل — وسأجيبك بناءً على بياناتك الفعلية." },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, thinking]);

  function send(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      const answer = askAssistant(text);
      setMessages((m) => [...m, { id: `a-${Date.now()}`, role: "assistant", text: answer.text, highlights: answer.highlights }]);
      setThinking(false);
    }, 700 + Math.random() * 500);
  }

  return (
    <Card className="flex flex-col h-[calc(100vh-11rem)]">
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${m.role === "assistant" ? "bg-primary/10 text-primary" : "bg-secondary"}`}>
                {m.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === "assistant" ? "bg-secondary" : "bg-primary text-primary-foreground"}`}>
                <p>{m.text}</p>
                {m.highlights && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {m.highlights.map((h) => (
                      <span key={h.label} className="rounded-md bg-background/60 px-2 py-1 text-xs">
                        <span className="opacity-70">{h.label}: </span><span className="font-semibold">{h.value}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          {thinking && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"><Bot className="h-4 w-4" /></div>
              <div className="rounded-2xl bg-secondary px-4 py-3 flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span key={i} className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                    animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {messages.length < 2 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button key={s} onClick={() => send(s)} className="flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs hover:bg-accent transition-colors">
              <Sparkles className="h-3 w-3 text-primary" />{s}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-2 border-t p-3">
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="اسأل عن أعمالك..." className="flex-1" />
        <Button type="submit" size="icon" disabled={!input.trim()}><Send className="h-4 w-4" /></Button>
      </form>
    </Card>
  );
}
