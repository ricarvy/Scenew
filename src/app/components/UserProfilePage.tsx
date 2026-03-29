import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Send } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "./I18nContext";

type PublicUser = {
  id: number;
  username: string;
  avatar_url?: string | null;
  created_at?: string | null;
  is_me: boolean;
};

type ThreadItem = {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  created_at?: string | null;
};

export function UserProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { lang } = useI18n();
  const API_BASE = useMemo(() => import.meta.env.VITE_API_BASE_URL || "", []);
  const [profile, setProfile] = useState<PublicUser | null>(null);
  const [thread, setThread] = useState<ThreadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [content, setContent] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !userId) return;
    setLoading(true);
    Promise.all([
      fetch(`${API_BASE}/auth/user/${userId}/public`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
      fetch(`${API_BASE}/messages/thread/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([p, t]) => {
        setProfile(p);
        setThread(Array.isArray(t) ? t : []);
      })
      .catch(() => toast.error(lang === "zh" ? "加载用户信息失败" : "Failed to load profile"))
      .finally(() => setLoading(false));
  }, [API_BASE, userId, lang]);

  const sendMessage = async () => {
    const token = localStorage.getItem("token");
    if (!token || !profile || !content.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`${API_BASE}/messages/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiver_id: profile.id,
          content: content.trim(),
        }),
      });
      if (!res.ok) throw new Error("send failed");
      setContent("");
      const threadRes = await fetch(`${API_BASE}/messages/thread/${profile.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (threadRes.ok) {
        const t = await threadRes.json();
        setThread(Array.isArray(t) ? t : []);
      }
      toast.success(lang === "zh" ? "留言已发送" : "Message sent");
    } catch {
      toast.error(lang === "zh" ? "发送失败" : "Failed to send");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen pt-28 text-center text-muted-foreground">{lang === "zh" ? "加载中..." : "Loading..."}</div>;
  }

  if (!profile) {
    return <div className="min-h-screen pt-28 text-center text-muted-foreground">{lang === "zh" ? "用户不存在" : "User not found"}</div>;
  }

  return (
    <div className="min-h-screen bg-[#FDF9F4] pt-24 pb-12 px-6">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center gap-2 text-[#8B5E3C] hover:text-[#5C3D24]"
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === "zh" ? "返回" : "Back"}
        </button>

        <div className="rounded-2xl border border-[#E8C3BA]/40 bg-white/70 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border border-[#E8C3BA]/40 bg-[#FAF6F0]">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
              ) : null}
            </div>
            <div>
              <h2 className="text-xl text-[#5C3D24]">{profile.username}</h2>
              <p className="text-sm text-muted-foreground">
                {lang === "zh" ? "注册时间：" : "Joined: "}
                {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "-"}
              </p>
            </div>
          </div>

          {!profile.is_me && (
            <div className="mt-6">
              <p className="text-sm text-[#5C3D24] mb-2">{lang === "zh" ? "私信留言" : "Direct Message"}</p>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                placeholder={lang === "zh" ? "给TA留言..." : "Leave a message..."}
                className="w-full rounded-xl border border-[#E8C3BA]/30 bg-white p-3 text-sm"
              />
              <button
                onClick={sendMessage}
                disabled={sending || !content.trim()}
                className="mt-3 px-4 py-2 rounded-lg bg-[#A0714A] text-white disabled:opacity-50 inline-flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {sending ? (lang === "zh" ? "发送中..." : "Sending...") : (lang === "zh" ? "发送私信" : "Send Message")}
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 rounded-2xl border border-[#E8C3BA]/35 bg-white/70 p-5">
          <h3 className="text-[#5C3D24] mb-3">{lang === "zh" ? "留言记录" : "Message Thread"}</h3>
          <div className="space-y-3">
            {thread.length === 0 && (
              <p className="text-sm text-muted-foreground">{lang === "zh" ? "暂无留言" : "No messages yet"}</p>
            )}
            {thread.map((m) => (
              <div key={m.id} className="rounded-xl border border-[#E8C3BA]/20 bg-white p-3">
                <p className="text-sm text-[#5C3D24] whitespace-pre-wrap">{m.content}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {m.created_at ? new Date(m.created_at).toLocaleString() : "-"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
