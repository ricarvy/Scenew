import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Star, Trash2, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "./I18nContext";

interface UserModelPhoto {
  id: number;
  name: string;
  image_url: string;
  is_default: boolean;
  created_at?: string;
}

export function MyModelsPage() {
  const { lang } = useI18n();
  const navigate = useNavigate();
  const [models, setModels] = useState<UserModelPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [nameInput, setNameInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

  const fetchModels = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.dispatchEvent(new Event("scenew:unauthorized"));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/models`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        window.dispatchEvent(new Event("scenew:unauthorized"));
        return;
      }
      if (!res.ok) throw new Error("Failed to load models");
      const data = await res.json();
      setModels(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error(lang === "zh" ? "加载模特库失败" : "Failed to load model library");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleUpload = async (file: File) => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.dispatchEvent(new Event("scenew:unauthorized"));
      return;
    }
    const form = new FormData();
    form.append("photo", file);
    form.append("name", nameInput.trim() || file.name.replace(/\.[^.]+$/, ""));
    if (models.length === 0) form.append("set_default", "true");
    setUploading(true);
    try {
      const res = await fetch(`${API_BASE}/models`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      if (res.status === 401) {
        window.dispatchEvent(new Event("scenew:unauthorized"));
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || "upload failed");
      }
      toast.success(lang === "zh" ? "已加入模特库" : "Added to model library");
      setNameInput("");
      await fetchModels();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || (lang === "zh" ? "上传失败" : "Upload failed"));
    } finally {
      setUploading(false);
    }
  };

  const setDefault = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.dispatchEvent(new Event("scenew:unauthorized"));
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/models/${id}/set-default`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("set default failed");
      setModels((prev) => prev.map((m) => ({ ...m, is_default: m.id === id })));
      toast.success(lang === "zh" ? "已设为默认模特" : "Default model updated");
    } catch (err) {
      console.error(err);
      toast.error(lang === "zh" ? "设置默认失败" : "Failed to set default");
    }
  };

  const removeModel = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.dispatchEvent(new Event("scenew:unauthorized"));
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch(`${API_BASE}/models/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("delete failed");
      setModels((prev) => prev.filter((m) => m.id !== id));
      toast.success(lang === "zh" ? "已删除模特" : "Model deleted");
    } catch (err) {
      console.error(err);
      toast.error(lang === "zh" ? "删除失败" : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="pt-24 pb-12 px-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-black/5 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-serif text-[#5C3D24]">{lang === "zh" ? "我的模特" : "My Models"}</h1>
      </div>

      <div className="mb-6 p-4 rounded-2xl border border-[#E8C3BA]/30 bg-white/60">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder={lang === "zh" ? "可选：模特名称" : "Optional: model name"}
            className="flex-1 rounded-xl border border-[#E8C3BA]/40 px-3 py-2 bg-white"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 rounded-xl bg-[#A0714A] text-white hover:bg-[#8B5E3C] transition-colors disabled:opacity-60 flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            {uploading ? (lang === "zh" ? "上传中..." : "Uploading...") : (lang === "zh" ? "上传模特照片" : "Upload Model Photo")}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-muted-foreground">{lang === "zh" ? "加载中..." : "Loading..."}</div>
      ) : models.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground rounded-2xl border border-[#E8C3BA]/30 bg-white/50">
          <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
          {lang === "zh" ? "暂无模特，先上传一张吧" : "No models yet. Upload one to start."}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {models.map((m) => (
            <div key={m.id} className="rounded-2xl overflow-hidden border border-[#E8C3BA]/30 bg-white/80">
              <div className="aspect-[3/4] bg-[#f8f3ec]">
                <img src={m.image_url} alt={m.name || "model"} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <p className="text-sm text-[#5C3D24] truncate mb-2">{m.name || (lang === "zh" ? "未命名模特" : "Untitled model")}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDefault(m.id)}
                    className={`flex-1 py-1.5 rounded-lg text-xs border transition-colors ${
                      m.is_default
                        ? "bg-[#A0714A] text-white border-[#A0714A]"
                        : "bg-white text-[#A0714A] border-[#A0714A]/30 hover:bg-[#A0714A]/5"
                    }`}
                  >
                    <span className="inline-flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {m.is_default ? (lang === "zh" ? "默认" : "Default") : (lang === "zh" ? "设为默认" : "Set Default")}
                    </span>
                  </button>
                  <button
                    onClick={() => removeModel(m.id)}
                    disabled={deletingId === m.id}
                    className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-60"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
