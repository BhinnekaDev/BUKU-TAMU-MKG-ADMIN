"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";

import BgPage from "@/components/BgPage";
import IconBMKG from "@/components/IconBMKG";
import Button from "@/components/Button";
import CardLogin from "@/components/CardLogin";
import Footer from "@/components/Footer";

import {
  IoMail,
  IoLockClosed,
  IoEyeOff,
  IoEye,
  IoArrowBack,
} from "react-icons/io5";

import { toast, ToastContainer } from "react-toastify";
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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError) toast.error(emailError);
    if (passwordError) toast.error(passwordError);

    if (emailError || passwordError) return;

    // Jika validasi sukses
    toast.success("Login berhasil!");

    // Contoh simulasi login, bisa ganti dengan API call dst.
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <BgPage>
        <div className="flex justify-start items-center"></div>

        <CardLogin>
          <button
            type="button"
            onClick={() => router.back()}
            className="group flex items-center gap-2 cursor-pointer text-white text-sm self-start transition-all duration-300"
            aria-label="Kembali"
          >
            <IoArrowBack
              size={30}
              className="transition-transform duration-300 group-hover:-translate-x-1 group-hover:text-green-400"
            />
          </button>

          <div className="flex justify-center items-center">
            <img
              src="/LogoBmkg.png"
              alt="Logo Bmkg"
              className="w-[121px] h-[109px]"
            />
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
                  onChange={handleEmailChange}
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
                  onChange={handlePasswordChange}
                  required
                  className="w-full pl-8 pr-10 bg-transparent placeholder-white border-b border-white text-white focus:outline-none focus:border-blue-500"
                  aria-label="Kata Sandi"
                />
                {showPassword ? (
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white text-lg cursor-pointer focus:outline-none"
                    onClick={() => setShowPassword(false)}
                    aria-label="Sembunyikan Kata Sandi"
                  >
                    <IoEye />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white text-lg cursor-pointer focus:outline-none"
                    onClick={() => setShowPassword(true)}
                    aria-label="Tampilkan Kata Sandi"
                  >
                    <IoEyeOff />
                  </button>
                )}
              </div>

              <Button
                type="submit"
                text="Masuk"
                stylebutton="bg-blue-900 text-white hover:cursor-pointer font-medium py-2 px-5 rounded-3xl shadow hover:bg-blue-800 transition w-[343px]"
              />
            </form>

            <div className="flex w-full max-w-sm text-sm text-white">
              <div className="w-1/2 text-left">
                <Link href="/register" className="relative inline-block group">
                  <span className="transition-colors duration-300 group-hover:text-white">
                    Belum Punya Akun?
                  </span>
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </div>
              <div className="w-1/2 text-right">
                <Link
                  href="/lupakatasandi"
                  className="relative inline-block group"
                >
                  <span className="transition-colors duration-300 group-hover:text-white">
                    Lupa Kata Sandi?
                  </span>
                  <span className="absolute right-0 bottom-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </div>
            </div>
          </div>
        </CardLogin>

        <Footer />
      </BgPage>
    </>
  );
}
