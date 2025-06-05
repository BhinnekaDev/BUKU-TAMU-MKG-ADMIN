"use client";
import { useRouter } from "next/navigation";
import React, { use } from "react";
import BgPage from "@/components/BgPage";
import IconBMKG from "@/components/IconBMKG";
import Button from "@/components/Button";
import CardLogin from "@/components/CardLogin";
import Footer from "@/components/Footer";
import { IoMail } from "react-icons/io5";
import { IoLockClosed, IoEyeOff, IoEye } from "react-icons/io5";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <BgPage>
      <IconBMKG logo="/LogoBmkgSmall.png">
        BMKG PROVINSI
        <br />
        BENGKULU
      </IconBMKG>

      <CardLogin>
        <div className="flex justify-center items-center">
          <img
            src="/LogoBmkg.png"
            alt="Logo Bmkg"
            className="w-[121px] h-[109px] flex flex-col items-center justify-center space-y-6"
          />
        </div>

        <div className="flex flex-col items-center justify-center text-white space-y-4 text-center px-4">
          <h1 className="text-xl md:text-2xl font-bold">
            Selamat Datang di BMKG
            <br />
            Provinsi Bengkulu
          </h1>

          <h2 className="text-sm md:text-sm font-light ">
            Login untuk memulai kunjungan digital Anda di BMKG.
          </h2>

          <form className="relative w-full mt-6 max-w-sm flex flex-col gap-9">
            <div className="relative">
              <IoMail className="absolute top-1/2 transform -translate-y-1/2 text-white text-lg" />
              <input
                type="Email"
                placeholder="Email"
                className="w-full pl-6 bg-transparent text-white placeholder-white border-b border-white focus:outline-none focus:border-blue-500 "
              />
            </div>
            <div className="relative">
              <IoLockClosed className="absolute top-1/2 transform -translate-y-1/2 text-white text-lg" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Kata Sandi"
                className="w-full pl-6 bg-transparent text-white placeholder-white border-b border-white focus:outline-none focus:border-blue-500 peer"
              />
              {showPassword ? (
                <IoEye
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-white text-lg cursor-pointer"
                  onClick={() => setShowPassword(false)} // ✅ ini setter yang benar
                />
              ) : (
                <IoEyeOff
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-white text-lg cursor-pointer"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>
          </form>

          <Button
            text="Masuk"
            stylebutton="bg-blue-900 mt-4 text-white hover:cursor-pointer font-medium py-2 px-5 rounded-3xl shadow hover:bg-blue-800 transition w-[343px] h[40px]"
            onClick={() => router.push("/dashboard")}
          />

          <div className="flex justify-between w-full max-w-sm text-sm ">
            <a href="register" className="text-white underline">
              Belum Punya Akun?
            </a>
            <a href="lupakatasandi" className="text-white underline">
              Lupa Kata Sandi?
            </a>
          </div>
        </div>
      </CardLogin>

      <Footer />
    </BgPage>
  );
}
