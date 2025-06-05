"use client";

import { useState } from "react";
import { Save, X } from "lucide-react";
import clsx from "clsx";

const tabs = ["General", "Security", "Notifications", "Localization"];

export default function PengaturanAdmin() {
  const [activeTab, setActiveTab] = useState("General");

  // General
  const [name, setName] = useState("Admin BMKG");
  const [email, setEmail] = useState("admin@bmkg.go.id");
  const [photo, setPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Security
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Notifications
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);

  // Localization
  const [language, setLanguage] = useState("id");
  const [timezone, setTimezone] = useState("Asia/Jakarta");

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (activeTab === "Security" && password && password !== confirmPassword) {
      setError("Password dan konfirmasi tidak sama.");
      return;
    }

    // Simulasi penyimpanan
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhoto(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPreviewUrl(null);
  };

  return (
    <div className="w-full mx-auto  rounded-2xl shadow-lg animate-fade-in">
      <div className="p-6 bg-white rounded-2xl shadow-lg w-full  animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Pengaturan Akun
        </h2>

        {/* Tabs */}
        <div className="flex border-b mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                "px-4 py-2 text-sm font-medium focus:outline-none",
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-6">
          {activeTab === "General" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nama
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1  border border-gray-300 rounded-lg px-10 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Foto Profil
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="mt-1 w-full text-sm"
                />
                {previewUrl && (
                  <div className="mt-2 flex items-center gap-3">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="text-red-500 text-sm flex items-center gap-1 hover:underline"
                    >
                      <X size={14} /> Hapus Foto
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === "Security" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password Baru
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Konfirmasi Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                />
              </div>
            </>
          )}

          {activeTab === "Notifications" && (
            <>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={emailNotif}
                  onChange={() => setEmailNotif(!emailNotif)}
                />
                <label className="text-sm text-gray-700">
                  Notifikasi via Email
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={smsNotif}
                  onChange={() => setSmsNotif(!smsNotif)}
                />
                <label className="text-sm text-gray-700">
                  Notifikasi via SMS
                </label>
              </div>
            </>
          )}

          {activeTab === "Localization" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bahasa
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                >
                  <option value="id">Bahasa Indonesia</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Zona Waktu
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                >
                  <option value="Asia/Jakarta">Asia/Jakarta</option>
                  <option value="Asia/Makassar">Asia/Makassar</option>
                  <option value="Asia/Jayapura">Asia/Jayapura</option>
                  <option value="Asia/Bengkulu">Asia/Bengkulu</option>
                </select>
              </div>
            </>
          )}

          <div>
            <button
              type="submit"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
            >
              <Save size={16} /> Simpan Pengaturan
            </button>
          </div>

          {success && (
            <div className="text-green-600 text-sm font-medium mt-2">
              ✅ Pengaturan berhasil disimpan.
            </div>
          )}
          {error && (
            <div className="text-red-600 text-sm font-medium mt-2">
              ⚠️ {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
