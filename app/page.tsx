"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import BgPage from "@/components/BgPage";
import Button from "@/components/Button";
import CardLogin from "@/components/CardLogin";
import Footer from "@/components/Footer";

import { IoEye, IoEyeOff, IoLockClosed, IoMail } from "react-icons/io5";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const validatePassword = (value: string): string => {
    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const isLongEnough = value.length >= 8;

    if (!isLongEnough) return "Kata sandi minimal 8 karakter";
    if (!hasUpperCase) return "Kata sandi harus mengandung huruf besar";
    if (!hasNumber) return "Kata sandi harus mengandung angka";
    return "";
  };

  const validateEmail = (value: string): string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Email tidak valid";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError) toast.error(emailError);
    if (passwordError) toast.error(passwordError);
    if (emailError || passwordError) return;

    try {
      const response = await fetch(
        "https://buku-tamu-mkg-database.vercel.app/api/admin/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login gagal");
      }

      toast.success("Login berhasil!");

      // Simpan data ke sessionStorage
      sessionStorage.setItem("isAdminLoggedIn", "true");
      sessionStorage.setItem("access_token", data.access_token);
      sessionStorage.setItem("user_id", data.user_id);
      sessionStorage.setItem("peran", data.peran || ""); // "Superadmin", "Admin", dll
      sessionStorage.setItem("nama_depan", data.nama_depan || "");
      sessionStorage.setItem("nama_belakang", data.nama_belakang || "");

      // Jangan pakai .toString() pada field yang mungkin undefined
      if (data.peran === "Superadmin") {
        sessionStorage.setItem("isSuperadmin", "true");
      } else {
        sessionStorage.setItem("isSuperadmin", "false");
      }

      // Redirect
      setTimeout(() => {
        router.push("/dashboard");
      }, 300);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Terjadi kesalahan yang tidak diketahui");
      }
    }
  };

  return (
    <BgPage>
      <CardLogin>
        <div className="flex justify-center items-center">
          <Image src="/LogoBmkg.png" alt="Logo Bmkg" width={121} height={109} />
        </div>

        <div className="flex flex-col items-center justify-center text-white space-y-4 text-center px-4">
          <h1 className="text-xl md:text-2xl font-bold">
            Selamat Datang di BMKG
            <br />
            Provinsi Bengkulu
          </h1>

          <h2 className="text-sm font-light">
            Login untuk memulai kunjungan digital Anda di BMKG.
          </h2>

          <form
            className="relative w-full mt-10 max-w-sm flex flex-col gap-9"
            onSubmit={handleSubmit}
            noValidate
          >
            {/* Email */}
            <div className="relative mb-2">
              <IoMail className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white text-lg" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-8 bg-transparent placeholder-white border-b border-white text-white focus:outline-none focus:border-blue-500"
                aria-label="Email"
              />
            </div>

            {/* Password */}
            <div className="relative mb-5">
              <IoLockClosed className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white text-lg" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Kata Sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-8 pr-10 bg-transparent placeholder-white border-b border-white text-white focus:outline-none focus:border-blue-500"
                aria-label="Kata Sandi"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white text-lg cursor-pointer focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword ? "Sembunyikan" : "Tampilkan Kata Sandi"
                }
              >
                {showPassword ? <IoEye /> : <IoEyeOff />}
              </button>
            </div>

            <Button
              type="submit"
              text="Masuk"
              stylebutton="cursor-pointer bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold py-2.5 px-6 rounded-full shadow-md transition duration-200 ease-in-out w-[343px]"
            />
          </form>
        </div>
      </CardLogin>

      <Footer />
    </BgPage>
  );
}
