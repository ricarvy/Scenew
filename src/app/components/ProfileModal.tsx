import { useState, useRef, useEffect } from "react";
import { X, User, Mail, Lock, Calendar, Coins, Edit2, Check, LogOut, Upload } from "lucide-react";
import { useI18n } from "./I18nContext";
import { toast } from "sonner";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { t, user, login, logout, refreshUser } = useI18n();
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || "");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      refreshUser();
    }
  }, [isOpen]);

  useEffect(() => {
    if (user) {
      setNewUsername(user.username);
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSaveUsername = () => {
    if (!newUsername.trim()) {
      toast.error("Please enter a username");
      return;
    }
    // Simulate API call
    login({ ...user, username: newUsername });
    setIsEditingUsername(false);
    toast.success("Username updated");
  };

  const handleSavePassword = () => {
    if (!newPassword || newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    // Simulate API call
    // Here we would call an API to update password
    setIsChangingPassword(false);
    setNewPassword("");
    setCurrentPassword("");
    toast.success("Password updated");
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleAvatarUpload = async (file: File) => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.dispatchEvent(new Event("scenew:unauthorized"));
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
      const res = await fetch(`${API_BASE}/auth/avatar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json().catch(() => ({} as any));
      if (!res.ok) throw new Error(data?.detail || "Upload failed");
      await refreshUser();
      toast.success("Avatar updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100 opacity-100">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[#5C3D24]">{t("profileTitle")}</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-6">
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleAvatarUpload(file);
                }}
              />
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold mb-3 border-4 border-white shadow-lg">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} className="w-full h-full object-cover rounded-full" />
                ) : (
                  user.username.charAt(0).toUpperCase()
                )}
              </div>
              <button
                type="button"
                disabled={uploadingAvatar}
                onClick={() => avatarInputRef.current?.click()}
                className="mb-2 px-3 py-1.5 rounded-full text-xs bg-[#FAF6F0] text-[#A0714A] border border-[#E8C3BA]/40 hover:bg-[#F2E8DA] transition-colors disabled:opacity-60 flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                {uploadingAvatar ? "Uploading..." : "Upload Avatar"}
              </button>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>

            {/* Info Cards */}
            <div className="bg-[#FAF6F0] rounded-xl p-4 space-y-4">
                {/* Username */}
                <div className="flex items-center justify-between py-2 border-b border-[#E8C3BA]/20 last:border-0">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-[#A0714A]" />
                    <span className="text-sm text-gray-600 w-20">{t("profileUsername")}</span>
                  </div>
                  {isEditingUsername ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="text-sm border border-[#E8C3BA] rounded px-2 py-1 w-32 focus:outline-none focus:border-[#A0714A] bg-white"
                        autoFocus
                      />
                      <button onClick={handleSaveUsername} className="p-1 hover:bg-white rounded-full text-green-600">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => setIsEditingUsername(false)} className="p-1 hover:bg-white rounded-full text-red-500">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#5C3D24]">{user.username}</span>
                      <button onClick={() => setIsEditingUsername(true)} className="p-1 hover:bg-white/50 rounded-full text-gray-400 hover:text-[#A0714A] transition-colors">
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Email (Read only) */}
                <div className="flex items-center justify-between py-2 border-b border-[#E8C3BA]/20 last:border-0">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#A0714A]" />
                    <span className="text-sm text-gray-600 w-20">{t("profileEmail")}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-400 cursor-not-allowed" title="Email cannot be changed">{user.email}</span>
                </div>

                {/* Password */}
                <div className="flex items-center justify-between py-2 last:border-0">
                  <div className="flex items-center gap-3">
                    <Lock className="w-4 h-4 text-[#A0714A]" />
                    <span className="text-sm text-gray-600 w-20">{t("profilePassword")}</span>
                  </div>
                  {isChangingPassword ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="password"
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="text-sm border border-[#E8C3BA] rounded px-2 py-1 w-32 focus:outline-none focus:border-[#A0714A] bg-white"
                        autoFocus
                      />
                      <button onClick={handleSavePassword} className="p-1 hover:bg-white rounded-full text-green-600">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => {
                        setIsChangingPassword(false);
                        setNewPassword("");
                      }} className="p-1 hover:bg-white rounded-full text-red-500">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setIsChangingPassword(true)}
                      className="text-xs flex items-center gap-1 text-gray-400 hover:text-[#A0714A] transition-colors"
                    >
                      ******** <Edit2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center justify-center border border-transparent hover:border-[#E8C3BA]/30 transition-colors">
                  <div className="flex items-center gap-2 mb-1 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs">{t("profileRegisterDate")}</span>
                  </div>
                  <span className="text-sm font-medium text-[#5C3D24]">
                    {user.joinedDate || new Date().toLocaleDateString()}
                  </span>
                </div>
                <div className="bg-gradient-to-br from-[#FAF6F0] to-[#E8C3BA]/20 rounded-xl p-4 flex flex-col items-center justify-center border border-[#D4AF37]/20 shadow-sm">
                  <div className="flex items-center gap-2 mb-1 text-[#A0714A]">
                    <Coins className="w-4 h-4" />
                    <span className="text-xs">{t("profilePoints")}</span>
                  </div>
                  <span className="text-lg font-bold text-[#D4AF37]">
                    {user.credits ?? 500} <span className="text-xs font-normal text-gray-500">{t("profilePointsUnit")}</span>
                  </span>
                </div>
              </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full py-3 mt-2 flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium border border-transparent hover:border-red-100"
            >
              <LogOut className="w-4 h-4" />
              {t("profileLogout")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
