import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, ChevronDown, Loader2, Plus, Shirt, Trash2 } from "lucide-react";
import { useI18n } from "./I18nContext";
import { toast } from "sonner";

interface WardrobeItem {
  id: number;
  category: string;
  product_image_url: string;
  product_title?: string | null;
}
interface WardrobeCategory {
  id: number;
  name: string;
}

export function WardrobePage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [categories, setCategories] = useState<WardrobeCategory[]>([]);
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({
    dress: true,
    tshirt: false,
    jeans: false,
  });
  const [newCategory, setNewCategory] = useState("");
  const [savingCategory, setSavingCategory] = useState(false);
  const [draggingItemId, setDraggingItemId] = useState<number | null>(null);
  const [dropTargetCategory, setDropTargetCategory] = useState<string | null>(null);

  const mapCategoryLabel = (name: string) => {
    if (name === "dress") return t("wardrobeCategoryDress");
    if (name === "tshirt") return t("wardrobeCategoryTshirt");
    if (name === "jeans") return t("wardrobeCategoryJeans");
    return name;
  };

  const toggleSection = (key: string) => {
    setOpenMap((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const token = () => localStorage.getItem("token");
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

  const fetchAll = async () => {
    try {
      const tk = token();
      if (!tk) {
        setLoading(false);
        return;
      }
      const [catRes, itemRes] = await Promise.all([
        fetch(`${API_BASE}/wardrobe/categories`, {
          headers: { Authorization: `Bearer ${tk}` },
        }),
        fetch(`${API_BASE}/wardrobe/items`, {
          headers: { Authorization: `Bearer ${tk}` },
        }),
      ]);
      if (catRes.status === 401 || itemRes.status === 401) {
        window.dispatchEvent(new Event("scenew:unauthorized"));
        return;
      }
      if (catRes.ok) {
        const catData: WardrobeCategory[] = await catRes.json();
        setCategories(catData);
        setOpenMap((prev) => {
          const next = { ...prev };
          for (const c of catData) {
            if (next[c.name] === undefined) next[c.name] = true;
          }
          return next;
        });
      }
      if (itemRes.ok) {
        setItems(await itemRes.json());
      }
    } catch (err) {
      console.error("Failed to fetch wardrobe:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const addCategory = async () => {
    const name = newCategory.trim();
    if (!name) return;
    const tk = token();
    if (!tk) return;
    setSavingCategory(true);
    try {
      const res = await fetch(`${API_BASE}/wardrobe/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tk}`,
        },
        body: JSON.stringify({ name }),
      });
      if (res.status === 401) {
        window.dispatchEvent(new Event("scenew:unauthorized"));
        return;
      }
      if (!res.ok) throw new Error("failed");
      const data: WardrobeCategory = await res.json();
      setCategories((prev) => (prev.some((c) => c.id === data.id) ? prev : [...prev, data]));
      setOpenMap((prev) => ({ ...prev, [data.name]: true }));
      setNewCategory("");
    } catch {
      toast.error(t("wardrobeAddFailed"));
    } finally {
      setSavingCategory(false);
    }
  };

  const deleteCategory = async (cat: WardrobeCategory) => {
    const tk = token();
    if (!tk) return;
    try {
      const res = await fetch(`${API_BASE}/wardrobe/categories/${cat.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${tk}` },
      });
      if (res.status === 401) {
        window.dispatchEvent(new Event("scenew:unauthorized"));
        return;
      }
      if (!res.ok) throw new Error("failed");
      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
      setItems((prev) => prev.filter((it) => it.category !== cat.name));
    } catch {
      toast.error(t("wardrobeAddFailed"));
    }
  };

  const deleteItem = async (id: number) => {
    const tk = token();
    if (!tk) return;
    try {
      const res = await fetch(`${API_BASE}/wardrobe/items/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${tk}` },
      });
      if (res.status === 401) {
        window.dispatchEvent(new Event("scenew:unauthorized"));
        return;
      }
      if (!res.ok) throw new Error("failed");
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch {
      toast.error(t("wardrobeAddFailed"));
    }
  };

  const moveItemToCategory = async (itemId: number, targetCategory: string) => {
    const tk = token();
    if (!tk) return;
    const current = items.find((it) => it.id === itemId);
    if (!current || current.category === targetCategory) return;
    const prevItems = items;
    setItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, category: targetCategory } : it)),
    );
    try {
      const res = await fetch(`${API_BASE}/wardrobe/items/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tk}`,
        },
        body: JSON.stringify({ category: targetCategory }),
      });
      if (res.status === 401) {
        window.dispatchEvent(new Event("scenew:unauthorized"));
        setItems(prevItems);
        return;
      }
      if (!res.ok) {
        setItems(prevItems);
        throw new Error("failed");
      }
      setOpenMap((prev) => ({ ...prev, [targetCategory]: true }));
    } catch {
      toast.error(t("wardrobeAddFailed"));
      setItems(prevItems);
    }
  };

  return (
    <section className="relative min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group mb-10"
          style={{ fontSize: "0.82rem" }}
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          {t("tryBackHome")}
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(160,113,74,0.1) 0%, rgba(196,149,106,0.06) 100%)",
            }}
          >
            <Shirt className="w-5 h-5" style={{ color: "#A0714A" }} />
          </div>
          <h1
            className="text-2xl font-semibold"
            style={{
              background: "linear-gradient(135deg, #5C3D24 0%, #8B5E3C 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {t("wardrobeTitle")}
          </h1>
        </div>
        <p className="text-sm text-muted-foreground mb-8">{t("wardrobeSubtitle")}</p>

        <div className="mb-4 flex gap-2">
          <input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder={t("wardrobeAddCategory")}
            className="flex-1 rounded-lg border border-[#E8C3BA]/40 px-3 py-2 bg-white/80 text-sm"
          />
          <button
            type="button"
            onClick={addCategory}
            disabled={savingCategory || !newCategory.trim()}
            className="px-3 py-2 rounded-lg bg-[#A0714A] text-white text-sm disabled:opacity-50 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            {t("wardrobeAddCategory")}
          </button>
        </div>

        <div className="space-y-3">
          {categories.map((cat) => {
            const isOpen = openMap[cat.name];
            const list = items.filter((item) => item.category === cat.name);
            return (
              <div
                key={cat.key}
                className="rounded-xl overflow-hidden"
                style={{
                  background: "rgba(255,252,248,0.82)",
                  border: "1px solid rgba(196,149,106,0.12)",
                  boxShadow: "0 2px 8px rgba(139,94,60,0.03)",
                }}
                onDragOver={(e) => {
                  if (draggingItemId !== null) {
                    e.preventDefault();
                    setDropTargetCategory(cat.name);
                  }
                }}
                onDragLeave={() => {
                  if (dropTargetCategory === cat.name) setDropTargetCategory(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (draggingItemId !== null) {
                    moveItemToCategory(draggingItemId, cat.name);
                  }
                  setDraggingItemId(null);
                  setDropTargetCategory(null);
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleSection(cat.name)}
                  aria-expanded={isOpen}
                  className="w-full px-5 py-4 flex items-center justify-between text-left transition-colors hover:bg-[rgba(196,149,106,0.05)]"
                >
                  <span className="font-medium" style={{ color: "#5C3D24" }}>
                    {mapCategoryLabel(cat.name)}
                  </span>
                  <span className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span
                      className="px-1.5 py-0.5 rounded"
                      style={{ background: "rgba(160,113,74,0.12)", color: "#8B5E3C" }}
                    >
                      {list.length}
                    </span>
                    {isOpen ? t("wardrobeCollapse") : t("wardrobeExpand")}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCategory(cat);
                      }}
                      className="ml-1 p-1 rounded hover:bg-red-50 text-red-500"
                      title={t("wardrobeDeleteCategory")}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div
                      className={`px-5 pb-5 pt-1 rounded-b-xl transition-colors ${
                        dropTargetCategory === cat.name ? "bg-[#A0714A]/8" : ""
                      }`}
                    >
                      {loading ? (
                        <div className="rounded-lg p-6 flex items-center justify-center text-muted-foreground gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                        </div>
                      ) : list.length === 0 ? (
                        <div
                          className="rounded-lg p-4 text-sm text-muted-foreground"
                          style={{ background: "rgba(196,149,106,0.06)" }}
                        >
                          {t("wardrobeEmpty")}
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {list.map((item) => (
                            <div
                              key={item.id}
                              className={`rounded-lg overflow-hidden border bg-white ${
                                draggingItemId === item.id ? "border-[#A0714A]" : "border-[#E8C3BA]/30"
                              }`}
                              draggable
                              onDragStart={() => setDraggingItemId(item.id)}
                              onDragEnd={() => {
                                setDraggingItemId(null);
                                setDropTargetCategory(null);
                              }}
                            >
                              <div className="aspect-square bg-[#faf6f0]">
                                <img
                                  src={item.product_image_url}
                                  alt={item.product_title || mapCategoryLabel(cat.name)}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="px-2 py-1.5 text-xs text-[#5C3D24] line-clamp-2 min-h-10 flex items-start justify-between gap-1">
                                <span>{item.product_title || "-"}</span>
                                <button
                                  type="button"
                                  onClick={() => deleteItem(item.id)}
                                  className="text-red-500 hover:text-red-600"
                                  title={t("wardrobeDeleteItem")}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

