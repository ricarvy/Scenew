import { useEffect, useMemo, useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "./I18nContext";

type ConversationItem = {
  user_id: number;
  user_name: string;
  user_avatar?: string | null;
  last_message: string;
  last_message_at?: string | null;
  unread_count: number;
};

type ThreadItem = {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  parent_id?: number | null;
  is_read: boolean;
  created_at?: string | null;
};

export function MessagesPage() {
  const { lang, user } = useI18n();
  const API_BASE = useMemo(() => import.meta.env.VITE_API_BASE_URL || "", []);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeUserId, setActiveUserId] = useState<number | null>(null);
  const [thread, setThread] = useState<ThreadItem[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const token = localStorage.getItem("token") || "";
  const currentUserId = Number(user?.id || 0);

  const loadConversations = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/messages/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("load conversations failed");
      const data = await res.json();
      const list: ConversationItem[] = Array.isArray(data) ? data : [];
      setConversations(list);
      if (list.length > 0 && !activeUserId) {
        setActiveUserId(list[0].user_id);
      }
    } catch {
      toast.error(lang === "zh" ? "加载消息失败" : "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const loadThread = async (otherUserId: number) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/messages/thread/${otherUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("load thread failed");
      const data = await res.json();
      setThread(Array.isArray(data) ? data : []);
      await fetch(`${API_BASE}/messages/thread/${otherUserId}/read-all`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      setConversations((prev) => prev.map((c) => (c.user_id === otherUserId ? { ...c, unread_count: 0 } : c)));
    } catch {
      toast.error(lang === "zh" ? "加载会话失败" : "Failed to load thread");
    }
  };

  useEffect(() => {
    loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeUserId) loadThread(activeUserId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeUserId]);

  const sendMessage = async () => {
    if (!activeUserId) return;
    const content = input.trim();
    if (!content) return;
    setSending(true);
    try {
      const res = await fetch(`${API_BASE}/messages/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiver_id: activeUserId,
          content,
        }),
      });
      if (!res.ok) throw new Error("send failed");
      setInput("");
      await loadThread(activeUserId);
      await loadConversations();
    } catch {
      toast.error(lang === "zh" ? "发送失败" : "Failed to send");
    } finally {
      setSending(false);
    }
  };

  const activeConversation = conversations.find((c) => c.user_id === activeUserId) || null;

  return (
    <div className="min-h-screen bg-[#FDF9F4] pt-24 pb-10 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl text-[#5C3D24]">{lang === "zh" ? "我的消息" : "My Messages"}</h2>
          <button onClick={loadConversations} className="text-sm text-[#A0714A] hover:text-[#8B5E3C]">
            {lang === "zh" ? "刷新" : "Refresh"}
          </button>
        </div>

        {loading ? (
          <p className="text-muted-foreground">{lang === "zh" ? "加载中..." : "Loading..."}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 min-h-[72vh]">
            <div className="md:col-span-4 rounded-2xl border border-[#E8C3BA]/35 bg-white/70 overflow-hidden">
              <div className="px-4 py-3 border-b border-[#E8C3BA]/25 text-sm text-[#5C3D24]">
                {lang === "zh" ? "会话列表" : "Conversations"}
              </div>
              <div className="max-h-[68vh] overflow-y-auto">
                {conversations.length === 0 && (
                  <p className="p-4 text-sm text-muted-foreground">{lang === "zh" ? "暂无私信会话" : "No conversations yet"}</p>
                )}
                {conversations.map((c) => (
                  <button
                    key={c.user_id}
                    onClick={() => setActiveUserId(c.user_id)}
                    className={`w-full text-left px-4 py-3 border-b border-[#E8C3BA]/15 hover:bg-[#FAF2E8]/70 transition-colors ${
                      activeUserId === c.user_id ? "bg-[#FAF2E8]" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={c.user_avatar || "https://i.pravatar.cc/120?img=8"} alt={c.user_name} className="w-10 h-10 rounded-full object-cover" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium text-[#5C3D24] truncate">{c.user_name}</p>
                          {c.unread_count > 0 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500 text-white">{c.unread_count}</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{c.last_message}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-8 rounded-2xl border border-[#E8C3BA]/35 bg-white/70 flex flex-col min-h-[72vh]">
              <div className="px-4 py-3 border-b border-[#E8C3BA]/25">
                <p className="text-sm text-[#5C3D24]">
                  {activeConversation ? activeConversation.user_name : (lang === "zh" ? "请选择会话" : "Select a conversation")}
                </p>
              </div>
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {thread.length === 0 && (
                  <p className="text-sm text-muted-foreground">{lang === "zh" ? "还没有消息，开始聊天吧" : "No messages yet"}</p>
                )}
                {thread.map((m) => {
                  const mine = currentUserId > 0 && m.sender_id === currentUserId;
                  return (
                    <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 ${
                          mine
                            ? "bg-[#A0714A] text-white"
                            : "bg-[#FAF2E8] text-[#5C3D24] border border-[#E8C3BA]/30"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                        <p className={`text-[10px] mt-1 ${mine ? "text-white/80" : "text-muted-foreground"}`}>
                          {m.created_at ? new Date(m.created_at).toLocaleString() : "-"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-3 border-t border-[#E8C3BA]/25">
                <div className="flex items-end gap-2">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={lang === "zh" ? "输入消息..." : "Type a message..."}
                    rows={2}
                    className="flex-1 rounded-xl border border-[#E8C3BA]/30 bg-white p-2.5 text-sm resize-none"
                    disabled={!activeUserId}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={sending || !activeUserId || !input.trim()}
                    className="h-10 px-3 rounded-lg bg-[#A0714A] text-white disabled:opacity-50 inline-flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {lang === "zh" ? "发送" : "Send"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
