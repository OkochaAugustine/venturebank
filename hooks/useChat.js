"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useChat(pollMs = 3000) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const messagesRef = useRef([]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const fetchMessages = useCallback(async (initial = false) => {
    try {
      const last = messagesRef.current[messagesRef.current.length - 1];
      const since =
        !initial && last?.createdAt
          ? `?since=${encodeURIComponent(last.createdAt)}`
          : "";
      const res = await fetch(`/api/chat${since}`, { credentials: "include" });
      const json = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          setUnauthorized(true);
          return;
        }
        return;
      }
      setUnauthorized(false);

      if (since && json.messages?.length) {
        setMessages((prev) => {
          const ids = new Set(prev.map((m) => m.id));
          const added = json.messages.filter((m) => !ids.has(m.id));
          return added.length ? [...prev, ...added] : prev;
        });
      } else if (!since) {
        setMessages(json.messages || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!pollMs) {
      setLoading(false);
      return;
    }
    fetchMessages(true);
    const id = setInterval(() => fetchMessages(false), pollMs);
    return () => clearInterval(id);
  }, [fetchMessages, pollMs]);

  async function sendMessage(content) {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ content }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Send failed");
    setMessages((prev) => [...prev, json.message]);
    return json.message;
  }

  return { messages, loading, sendMessage, unauthorized };
}
