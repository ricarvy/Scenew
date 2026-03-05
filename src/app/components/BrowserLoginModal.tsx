import { useEffect, useRef, useState, useCallback } from "react";
import { X, Loader2, Monitor, CheckCircle2, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { useI18n } from "./I18nContext";
import { startLoginSession, confirmLogin, type ProductInfo } from "./productScraper";

interface BrowserLoginModalProps {
  isOpen: boolean;
  taskId: string;
  platform: string;
  onClose: () => void;
  onLoginSuccess: () => void;
}

/**
 * CDP Screencast remote browser viewer.
 * Connects via WebSocket to the Playwright browser endpoint,
 * renders real-time screenshots and forwards mouse/keyboard events.
 */
export function BrowserLoginModal({
  isOpen,
  taskId,
  platform,
  onClose,
  onLoginSuccess,
}: BrowserLoginModalProps) {
  const { t } = useI18n();
  const overlayRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const sessionIdRef = useRef(0);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  // Canvas dimensions for screencast - set to a standard desktop resolution
  const CANVAS_WIDTH = 1280;
  const CANVAS_HEIGHT = 1024;

  const cleanup = useCallback(() => {
    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch {
        // ignore
      }
      wsRef.current = null;
    }
    setConnected(false);
    setLoading(true);
    setError("");
    setConfirming(false);
    setRetryCount(0);
  }, []);

  useEffect(() => {
    if (!isOpen || !taskId) return;
    const currentSession = ++sessionIdRef.current;

    let ws: WebSocket | null = null;

    const connect = async () => {
      try {
        setLoading(true);
        setError("");
        const wsEndpoint = await startLoginSession(taskId, platform);

        // Guard against stale session
        if (currentSession !== sessionIdRef.current) return;

        ws = new WebSocket(wsEndpoint);
        wsRef.current = ws;

        ws.onopen = () => {
          if (currentSession !== sessionIdRef.current) return;
          setConnected(true);
          setLoading(false);
          console.log("WebSocket connected to:", wsEndpoint);

          // 1. Set remote viewport size to match canvas
          ws?.send(
            JSON.stringify({
              method: "Emulation.setDeviceMetricsOverride",
              params: {
                width: CANVAS_WIDTH,
                height: CANVAS_HEIGHT,
                deviceScaleFactor: 1,
                mobile: false,
              },
              id: 0,
            })
          );

          // 2. Start screencast via CDP
          ws?.send(
            JSON.stringify({
              method: "Page.startScreencast",
              params: {
                format: "jpeg",
                quality: 60,
                maxWidth: CANVAS_WIDTH,
                maxHeight: CANVAS_HEIGHT,
              },
              id: 1,
            })
          );
        };

        ws.onmessage = (event) => {
          if (currentSession !== sessionIdRef.current) return;
          try {
            const msg = JSON.parse(event.data);
            if (msg.method === "Page.screencastFrame") {
              const { data, sessionId } = msg.params;
              // Acknowledge frame
              ws?.send(
                JSON.stringify({
                  method: "Page.screencastFrameAck",
                  params: { sessionId },
                  id: 2,
                })
              );
              // Draw to canvas
              const img = new Image();
              img.onload = () => {
                const ctx = canvasRef.current?.getContext("2d");
                if (ctx) {
                  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                  ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                }
              };
              img.src = `data:image/jpeg;base64,${data}`;
            }
          } catch {
            // ignore parse errors
          }
        };

        ws.onerror = (e) => {
          if (currentSession !== sessionIdRef.current) return;
          console.error("WebSocket error:", e);
          setError("WebSocket connection failed");
          setLoading(false);
        };

        ws.onclose = () => {
          if (currentSession !== sessionIdRef.current) return;
          setConnected(false);
        };
      } catch (err: any) {
        if (currentSession !== sessionIdRef.current) return;
        setError(err.message || "Failed to start login session");
        setLoading(false);
      }
    };

    connect();

    return () => {
      sessionIdRef.current++;
      if (ws) {
        try {
          ws.close();
        } catch {
          // ignore
        }
      }
    };
  }, [isOpen, taskId, platform, retryCount]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      cleanup();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, cleanup]);

  // Forward mouse events to CDP
  const sendInput = useCallback(
    (type: string, x: number, y: number, extra?: Record<string, any>) => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
      wsRef.current.send(
        JSON.stringify({
          method: "Input.dispatchMouseEvent",
          params: { type, x: Math.round(x), y: Math.round(y), button: "left", clickCount: 1, ...extra },
          id: 3,
        })
      );
    },
    []
  );

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoords(e);
    sendInput("mousePressed", x, y);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoords(e);
    sendInput("mouseReleased", x, y);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoords(e);
    sendInput("mouseMoved", x, y);
  };

  // Forward keyboard events
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
      wsRef.current.send(
        JSON.stringify({
          method: "Input.dispatchKeyEvent",
          params: {
            type: "keyDown",
            key: e.key,
            code: e.code,
            text: e.key.length === 1 ? e.key : "",
          },
          id: 4,
        })
      );
      // Also send char event for text input
      if (e.key.length === 1) {
        wsRef.current.send(
          JSON.stringify({
            method: "Input.dispatchKeyEvent",
            params: { type: "char", text: e.key },
            id: 5,
          })
        );
      }
    },
    []
  );

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent) => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
      wsRef.current.send(
        JSON.stringify({
          method: "Input.dispatchKeyEvent",
          params: {
            type: "keyUp",
            key: e.key,
            code: e.code,
          },
          id: 6,
        })
      );
    },
    []
  );

  const handleConfirmLogin = async () => {
    setConfirming(true);
    try {
      await confirmLogin(taskId);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || "Confirmation failed");
    } finally {
      setConfirming(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[110] flex items-center justify-center px-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        style={{ animation: "blFadeIn 0.3s ease" }}
      />

      <div
        className="relative rounded-2xl w-full max-w-[880px] overflow-hidden"
        style={{
          animation: "blSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          background: "linear-gradient(145deg, #FDF9F4 0%, #FAF6F0 100%)",
          boxShadow:
            "0 24px 80px rgba(0,0,0,0.2), 0 0 0 1px rgba(196,149,106,0.1)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(160,113,74,0.12), rgba(196,149,106,0.08))",
              }}
            >
              <Monitor className="w-4 h-4" style={{ color: "#A0714A" }} />
            </div>
            <div>
              <h3 className="flex items-center gap-2" style={{ fontSize: "0.95rem", color: "#5C3D24" }}>
                {t("browserLoginTitle")}
                {/* Connection status badge */}
                {!loading && !error && (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                    style={{
                      fontSize: "0.6rem",
                      color: connected ? "#16a34a" : "#d97706",
                      background: connected ? "rgba(22,163,74,0.08)" : "rgba(217,119,6,0.08)",
                    }}
                  >
                    {connected ? <Wifi className="w-2.5 h-2.5" /> : <WifiOff className="w-2.5 h-2.5" />}
                    {connected ? (t("browserLoginTitle") === "需要平台登录" ? "已连接" : "Connected") : (t("browserLoginTitle") === "需要平台登录" ? "已断开" : "Disconnected")}
                  </span>
                )}
              </h3>
              <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>
                {t("browserLoginDesc")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Browser viewport */}
        <div
          className="relative bg-black/5 overflow-auto"
          style={{ height: "600px" }}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
        >
          <div className="min-w-full min-h-full flex items-center justify-center p-4">
            {loading ? (
              <div className="flex flex-col items-center gap-4 py-20">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#A0714A" }} />
                <p className="text-muted-foreground" style={{ fontSize: "0.85rem" }}>
                  {t("browserLoginLoading")}
                </p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center gap-3 py-20">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(196,69,54,0.1)" }}
                >
                  <X className="w-5 h-5 text-destructive" />
                </div>
                <p className="text-muted-foreground" style={{ fontSize: "0.85rem" }}>
                  {error}
                </p>
                <button
                  onClick={() => setRetryCount((c) => c + 1)}
                  className="mt-2 flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all hover:opacity-80"
                  style={{
                    fontSize: "0.8rem",
                    color: "#A0714A",
                    background: "rgba(160,113,74,0.08)",
                    border: "1px solid rgba(160,113,74,0.15)",
                  }}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {t("browserLoginTitle") === "需要平台登录" ? "重试连接" : "Retry Connection"}
                </button>
              </div>
            ) : (
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="cursor-pointer shadow-lg bg-white shrink-0"
                style={{
                  maxWidth: "none",
                  objectFit: "none",
                  imageRendering: "auto",
                }}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
              />
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border/40">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-muted-foreground hover:text-foreground transition-colors"
            style={{
              fontSize: "0.85rem",
              background: "rgba(237,229,216,0.4)",
            }}
          >
            {t("browserLoginCancel")}
          </button>
          <button
            onClick={handleConfirmLogin}
            disabled={!connected || confirming}
            className="px-5 py-2.5 rounded-xl text-primary-foreground transition-all duration-300 hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
            style={{
              fontSize: "0.85rem",
              background: "linear-gradient(135deg, #A0714A 0%, #8B5E3C 100%)",
              boxShadow: "0 4px 12px rgba(139,94,60,0.2)",
            }}
          >
            {confirming ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("browserLoginSuccess")}
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                {t("browserLoginConfirm")}
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes blFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes blSlideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}