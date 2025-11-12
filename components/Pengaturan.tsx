"use client";

import clsx from "clsx";
import { Save, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { toast } from "react-toastify";

const tabs = ["General", "Security"];

interface AdminProfile {
  nama_depan: string;
  nama_belakang: string;
  Peran: string;
  email: string;
}

export default function PengaturanAdmin() {
  const [activeTab, setActiveTab] = useState("General");
  const [profileData, setProfileData] = useState<AdminProfile | null>(null);

  // General
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Validation Password
  const validatePassword = (value: string): string => {
    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const isLongEnough = value.length >= 8;

    if (!isLongEnough) return "Kata sandi minimal 8 karakter";
    if (!hasUpperCase) return "Kata sandi harus mengandung huruf besar";
    if (!hasNumber) return "Kata sandi harus mengandung angka";
    return "";
  };
  // Security
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Notifications

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    console.log("=== handleSave called ===");
    console.log("Input name:", name);
    console.log("Input password:", password ? "****" : "(tidak diisi)");
    console.log(
      "Input confirmPassword:",
      confirmPassword ? "****" : "(tidak diisi)"
    );
    console.log("Photo:", photo ? photo.name : "(tidak ada photo baru)");
    console.log("Active tab:", activeTab);

    try {
      const user_id = sessionStorage.getItem("user_id");
      const access_token = sessionStorage.getItem("access_token");

      if (!user_id || !access_token) {
        const errMsg = "User ID atau Access Token tidak ditemukan.";
        setError(errMsg);
        console.log(errMsg);
        return;
      }
      console.log("User ID dan Access Token ditemukan");

      if (!profileData) {
        const errMsg = "Data profil belum dimuat.";
        setError(errMsg);
        console.log(errMsg);
        return;
      }
      console.log("ProfileData:", profileData);

      const nameParts = name.trim().split(" ");
      const namaDepanBaru = nameParts[0] || "";
      const namaBelakangBaru = nameParts.slice(1).join(" ") || "";

      const namaDepanLama = profileData.nama_depan || "";
      const namaBelakangLama = profileData.nama_belakang || "";

      console.log(
        "Nama depan lama:",
        namaDepanLama,
        "Nama depan baru:",
        namaDepanBaru
      );
      console.log(
        "Nama belakang lama:",
        namaBelakangLama,
        "Nama belakang baru:",
        namaBelakangBaru
      );

      const formData = new FormData();

      if (namaDepanBaru !== namaDepanLama) {
        formData.append("nama_depan", namaDepanBaru);
        console.log(
          "Nama depan berubah dan ditambahkan ke formData:",
          namaDepanBaru
        );
      } else {
        console.log("Nama depan tidak berubah");
      }

      if (namaBelakangBaru !== namaBelakangLama) {
        formData.append("nama_belakang", namaBelakangBaru);
        console.log(
          "Nama belakang berubah dan ditambahkan ke formData:",
          namaBelakangBaru
        );
      } else {
        console.log("Nama belakang tidak berubah");
      }

      if (activeTab === "Security" && password) {
        const pwdError = validatePassword(password);
        if (pwdError) {
          setPasswordError(pwdError);
          console.log("Password validation error:", pwdError);
          return;
        }
        if (password !== confirmPassword) {
          const confirmErr = "Konfirmasi password tidak cocok";
          setConfirmPasswordError(confirmErr);
          console.log(confirmErr);
          return;
        }
        setPasswordError("");
        setConfirmPasswordError("");
        formData.append("password", password);
        console.log("Password valid dan ditambahkan ke formData");
      }

      if (photo) {
        formData.append("foto", photo);
        console.log("Foto baru ditambahkan ke formData:", photo.name);
      } else {
        console.log("Tidak ada foto baru untuk diupload");
      }

      if ([...formData].length === 0) {
        const noChangeMsg = "Tidak ada perubahan data untuk disimpan.";
        setError(noChangeMsg);
        console.log(noChangeMsg);
        return;
      }

      console.log("Mengirim formData dengan fields:");
      for (const pair of formData.entries()) {
        const isFile = pair[1] instanceof File;
        console.log(
          `- ${pair[0]}: ${
            isFile ? `File(${(pair[1] as File).name})` : pair[1]
          }`
        );
      }

      const res = await fetch(
        "https://buku-tamu-mkg-database.vercel.app/api/admin/update-profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            Authorization: `Bearer ${access_token}`,
            user_id: user_id,
          },
          body: formData,
        }
      );

      if (!res.ok) {
        const errorJson = await res.json().catch(() => null);
        const msg = errorJson?.message || "Gagal memperbarui profil";
        console.log("Response error:", msg);
        throw new Error(msg);
      }

      const json = await res.json();
      console.log("Response update success:", json);

      setSuccess(true);

      // Kalau password diganti, tunggu 3 detik, show toast, lalu redirect
      if (formData.has("password")) {
        setTimeout(() => {
          // Misal kamu pakai library toast seperti react-toastify atau sejenisnya
          // Ganti sesuai library yang kamu gunakan:
          toast.success(
            "Password berhasil diperbarui, Anda akan diarahkan ke halaman utama."
          );

          setTimeout(() => {
            window.location.href = "/";
          }, 5000);
        }, 1000);
      } else {
        setTimeout(() => setSuccess(false), 4000);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Terjadi kesalahan");
        console.log("Catch error:", err.message);
      } else {
        setError("Terjadi kesalahan yang tidak diketahui");
        console.log("Catch unknown error");
      }
    }
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

  useEffect(() => {
    async function fetchProfile() {
      console.log("Mulai fetch profile");

      const user_id = sessionStorage.getItem("user_id");
      const access_token = sessionStorage.getItem("access_token");

      if (!user_id || !access_token) {
        console.error(
          "Data user_id atau access_token tidak ditemukan di sessionStorage"
        );
        return;
      }

      try {
        const token = sessionStorage.getItem("access_token");
        if (!token) {
          console.error("Token tidak ditemukan. Pastikan sudah login.");
          // Arahkan user ke halaman login atau tampilkan pesan error
          return;
        }
        const res = await fetch(
          "https://buku-tamu-mkg-database.vercel.app/api/admin/profile",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "*/*",
              Authorization: `Bearer ${access_token}`,
              user_id: user_id,
            },
          }
        );

        console.log("Fetch response status:", res.status);
        if (!res.ok) throw new Error("Failed to fetch profile");

        const json = await res.json();
        console.log("JSON data:", json);
        const profile = json.data;

        setProfileData(profile);

        // Set default value ke input form
        setName(`${profile.nama_depan} ${profile.nama_belakang}`.trim());
        setEmail(profile.email);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        console.log("Selesai fetch profile");
      }
    }

    fetchProfile();
  }, []);

  return (
    <div className="w-full mx-auto rounded-2xl shadow-lg animate-fade-in">
      <div className="p-6 bg-white rounded-2xl shadow-lg w-full animate-fade-in">
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
                "px-4 py-2 text-sm cursor-pointer font-medium focus:outline-none",
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
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-[25%] border border-gray-300 rounded-lg px-4 py-2 text-sm"
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
                  className="mt-1 w-[25%] border border-gray-300 rounded-lg px-4 py-2 text-sm"
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
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-lg border"
                      width={20}
                      height={20}
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
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError(validatePassword(e.target.value));
                    }}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-sm pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 text-lg cursor-pointer focus:outline-none"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    aria-label={
                      showNewPassword
                        ? "Sembunyikan Kata Sandi"
                        : "Tampilkan Kata Sandi"
                    }
                  >
                    {showNewPassword ? <IoEyeOff /> : <IoEye />}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-red-600 text-sm mt-1">{passwordError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setConfirmPasswordError(
                        e.target.value !== password
                          ? "Konfirmasi password tidak cocok"
                          : ""
                      );
                    }}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 text-lg cursor-pointer focus:outline-none"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={
                      showConfirmPassword
                        ? "Sembunyikan Kata Sandi"
                        : "Tampilkan Kata Sandi"
                    }
                  >
                    {showConfirmPassword ? <IoEyeOff /> : <IoEye />}
                  </button>
                </div>
                {confirmPasswordError && (
                  <p className="text-red-600 text-sm mt-1">
                    {confirmPasswordError}
                  </p>
                )}
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
