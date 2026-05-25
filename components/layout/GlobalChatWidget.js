"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlineXMark,
  HiOutlinePaperAirplane,
} from "react-icons/hi2";
import { useChat } from "@/hooks/useChat";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function GlobalChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const isAdmin = pathname?.startsWith("/admin");
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/admin/login" ||
    pathname === "/admin/register";

  const canChat = open && !isAuthPage && !isAdmin;
  const { messages, loading, sendMessage, unauthorized } = useChat(canChat ? 3000 : 0);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  if (isAuthPage) return null;

  async function handleSend(e) {
    e.preventDefault();
    if (!text.trim() || unauthorized) return;
    setSending(true);
    try {
      await sendMessage(text.trim());
      setText("");
    } catch {
      /* handled via unauthorized */
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-4 z-[90] flex h-[min(480px,70vh)] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-600 dark:bg-slate-900 sm:right-6"
          >
            <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-3 text-white">
              <div>
                <p className="font-semibold">Live support</p>
                <p className="text-xs text-blue-100">Encrypted · Typically under 5 min</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close chat">
                <HiOutlineXMark className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto p-4">
              {unauthorized && (
                <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950/50 dark:text-amber-200">
                  <Link href="/login" className="font-semibold underline">
                    Sign in
                  </Link>{" "}
                  to message support from your dashboard.
                </div>
              )}
              {isAdmin && (
                <p className="text-sm text-slate-500">
                  Open <Link href="/admin/chat" className="font-semibold text-blue-600">Admin → Support inbox</Link> to reply.
                </p>
              )}
              {canChat && loading && !messages.length && !unauthorized && (
                <p className="text-center text-sm text-slate-400">Connecting…</p>
              )}
              {canChat && !loading && !messages.length && !unauthorized && (
                <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  Ask about deposits, transfers, or verification.
                </p>
              )}
              {messages.map((m) => (
                <div key={m.id} className={cn("flex", m.isOwn ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
                      m.isOwn
                        ? "bg-blue-600 text-white"
                        : "border border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-600 dark:bg-slate-800"
                    )}
                  >
                    {m.content}
                    <p className={cn("mt-0.5 text-[10px]", m.isOwn ? "text-blue-200" : "text-slate-400")}>
                      {formatDate(m.createdAt, { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {canChat && !unauthorized && (
              <form onSubmit={handleSend} className="flex gap-2 border-t border-slate-100 p-3 dark:border-slate-700">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type a message…"
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  <HiOutlinePaperAirplane className="h-5 w-5" />
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-4 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-lg sm:right-6"
        aria-label="Open support chat"
      >
        {open ? <HiOutlineXMark className="h-6 w-6" /> : <HiOutlineChatBubbleLeftRight className="h-6 w-6" />}
      </motion.button>
    </>
  );
}
