"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { HiOutlinePaperAirplane } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";
import { useChat } from "@/hooks/useChat";
import { formatDate } from "@/lib/utils";

export function SupportChat() {
  const { messages, loading, sendMessage } = useChat(2500);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    try {
      await sendMessage(text.trim());
      setText("");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] min-h-[420px] flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-4">
        <h2 className="text-lg font-semibold text-ocean-950">Live support</h2>
        <p className="text-sm text-slate-500">Message our team — replies appear in real time</p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {loading && !messages.length && (
          <p className="text-center text-sm text-slate-400">Connecting to support...</p>
        )}
        {!loading && !messages.length && (
          <div className="rounded-xl bg-ocean-50 p-4 text-center text-sm text-ocean-800">
            No messages yet. Ask about deposits, transfers, or account setup.
          </div>
        )}
        {messages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${m.isOwn ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                m.isOwn
                  ? "bg-ocean-700 text-white"
                  : "border border-slate-200 bg-slate-50 text-slate-800"
              }`}
            >
              <p>{m.content}</p>
              <p className={`mt-1 text-[10px] ${m.isOwn ? "text-ocean-200" : "text-slate-400"}`}>
                {formatDate(m.createdAt, { hour: "2-digit", minute: "2-digit" })}
                {!m.isOwn && " · Support"}
              </p>
            </div>
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2 border-t border-slate-100 p-4">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-ocean-500 focus:ring-2 focus:ring-ocean-100"
        />
        <Button type="submit" variant="primary" disabled={sending || !text.trim()}>
          <HiOutlinePaperAirplane className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
}
