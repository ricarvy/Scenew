import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useI18n } from "./I18nContext";
import { ArrowLeft, Receipt, Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface PaymentRecord {
  id: number;
  plan_id: string;
  points_added: number;
  amount: number;
  currency: string;
  status: string;
  created_at: string | null;
  completed_at: string | null;
}

export function PaymentHistoryPage() {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const [records, setRecords] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
      const res = await fetch(`${API_BASE}/payment/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        window.dispatchEvent(new Event("scenew:unauthorized"));
        return;
      }
      if (res.ok) {
        setRecords(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch payment history:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    const value = (amount / 100).toFixed(2);
    return currency === "cny" ? `¥${value}` : `$${value}`;
  };

  const formatTime = (iso: string | null) => {
    if (!iso) return "-";
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const planName = (planId: string) => {
    const key = `paymentHistory${planId.charAt(0).toUpperCase() + planId.slice(1)}` as any;
    return t(key) || planId;
  };

  const statusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return {
          label: t("paymentHistoryCompleted"),
          color: "#16a34a",
          bg: "rgba(34,197,94,0.08)",
          icon: CheckCircle2,
        };
      case "pending":
        return {
          label: t("paymentHistoryPending"),
          color: "#d97706",
          bg: "rgba(245,158,11,0.08)",
          icon: Clock,
        };
      default:
        return {
          label: t("paymentHistoryFailed"),
          color: "#dc2626",
          bg: "rgba(239,68,68,0.08)",
          icon: AlertCircle,
        };
    }
  };

  return (
    <section className="relative min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group mb-10"
          style={{ fontSize: "0.82rem" }}
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          {t("tryBackHome")}
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(160,113,74,0.1) 0%, rgba(196,149,106,0.06) 100%)",
            }}
          >
            <Receipt className="w-5 h-5" style={{ color: "#A0714A" }} />
          </div>
          <h1
            className="text-2xl font-semibold"
            style={{
              background: "linear-gradient(135deg, #5C3D24 0%, #8B5E3C 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {t("paymentHistoryTitle")}
          </h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-20">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ background: "rgba(196,149,106,0.06)" }}
            >
              <Receipt className="w-7 h-7" style={{ color: "#C4956A" }} />
            </div>
            <p className="font-medium mb-1" style={{ color: "#5C3D24" }}>
              {t("paymentHistoryEmpty")}
            </p>
            <p className="text-sm text-muted-foreground">{t("paymentHistoryEmptyDesc")}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((r) => {
              const sc = statusConfig(r.status);
              const StatusIcon = sc.icon;
              return (
                <div
                  key={r.id}
                  className="rounded-xl p-5 transition-all hover:shadow-md"
                  style={{
                    background: "rgba(255,252,248,0.8)",
                    border: "1px solid rgba(196,149,106,0.1)",
                    boxShadow: "0 2px 8px rgba(139,94,60,0.03)",
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="font-medium text-sm" style={{ color: "#5C3D24" }}>
                        {planName(r.plan_id)}
                      </span>
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ color: sc.color, background: sc.bg }}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {sc.label}
                      </span>
                    </div>
                    <span className="text-sm font-semibold" style={{ color: "#5C3D24" }}>
                      {formatAmount(r.amount, r.currency)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {formatTime(r.created_at)}
                    </span>
                    <span style={{ color: "#A0714A" }}>
                      +{r.points_added} {t("profilePointsUnit")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
