"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

export function AdminChat() {
  const [threads, setThreads] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  function loadThreads() {
    fetch("/api/admin/chat", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setThreads(d.threads || []));
  }

  function loadMessages(userId, since) {
    const q = since ? `&since=${encodeURIComponent(since)}` : "";
    return fetch(`/api/admin/chat?userId=${userId}${q}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (since && d.messages?.length) {
          setMessages((prev) => {
            const ids = new Set(prev.map((m) => m.id));
            return [...prev, ...d.messages.filter((m) => !ids.has(m.id))];
          });
        } else if (!since) {
          setMessages(d.messages || []);
        }
      });
  }

  useEffect(() => {
    loadThreads();
    const id = setInterval(loadThreads, 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!selectedUser) return;
    loadMessages(selectedUser);
    const id = setInterval(() => {
      loadMessages(selectedUser);
    }, 2500);
    return () => clearInterval(id);
  }, [selectedUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendReply(e) {
    e.preventDefault();
    if (!text.trim() || !selectedUser) return;
    const res = await fetch("/api/admin/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ userId: selectedUser, content: text }),
    });
    const json = await res.json();
    if (res.ok) {
      setMessages((prev) => [...prev, json.message]);
      setText("");
      loadThreads();
    }
  }

  return (
    <div className="flex h-[calc(100vh-10rem)] gap-4">
      <div className="w-72 shrink-0 overflow-y-auto rounded-xl border border-slate-200 bg-white">
        <p className="border-b border-slate-100 px-4 py-3 text-xs font-bold uppercase text-slate-500">Threads</p>
        {threads.map((t) => (
          <button
            key={t.userId}
            type="button"
            onClick={() => {
              setSelectedUser(t.userId);
              setMessages([]);
            }}
            className={`w-full border-b border-slate-50 px-4 py-3 text-left hover:bg-slate-50 ${
              selectedUser === t.userId ? "bg-ocean-50" : ""
            }`}
          >
            <p className="font-medium text-sm text-slate-800">{t.name}</p>
            <p className="truncate text-xs text-slate-500">{t.lastMessage}</p>
            {t.unread > 0 && (
              <span className="mt-1 inline-block rounded-full bg-red-500 px-2 py-0.5 text-[10px] text-white">
                {t.unread}
              </span>
            )}
          </button>
        ))}
        {!threads.length && <p className="p-4 text-sm text-slate-500">No conversations yet.</p>}
      </div>

      <div className="flex flex-1 flex-col rounded-xl border border-slate-200 bg-white">
        {selectedUser ? (
          <>
            <div className="flex-1 space-y-2 overflow-y-auto p-4">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.isOwn ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                      m.isOwn ? "bg-ocean-700 text-white" : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    {m.content}
                    <p className={`mt-1 text-[10px] ${m.isOwn ? "text-ocean-200" : "text-slate-400"}`}>
                      {formatDate(m.createdAt, { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            <form onSubmit={sendReply} className="flex gap-2 border-t border-slate-100 p-4">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                placeholder="Reply to member..."
              />
              <Button type="submit" variant="primary">Send</Button>
            </form>
          </>
        ) : (
          <p className="flex flex-1 items-center justify-center text-slate-500">Select a conversation</p>
        )}
      </div>
    </div>
  );
}
