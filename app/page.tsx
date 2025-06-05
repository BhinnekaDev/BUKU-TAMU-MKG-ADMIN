import Image from "next/image";
import BgLogin from "@/components/BgLogin";
import IconBMKG from "@/components/IconBMKG";
import CardLogin from "@/components/CardLogin";

export default function Login() {
  const gambarLogin = "/assets/login.png";
  return (
    <BgLogin>
      {/* Wadah Login */}
      <CardLogin>
        {/* Sebelah Kiri */}

        <div className="flex flex-col items-center justify-center text-white w-1/2 px-6 py-8">
          <h2 className="text-3xl font-bold text-center mt-4 leading-snug">
            Selamat Datang di BMKG
            <br />
            Provinsi Bengkulu
          </h2>
          <p className="text-2sm text-center text-gray-200 mt-2 mb-6">
            Login untuk memulai kunjungan digital Anda di
            <br />
            di BMKG.
          </p>
          <form className="w-full max-w-sm flex flex-col gap-4">
            <div>
              <input
                type="email"
                className="w-full px-4 py-2 rounded  focus:outline-none"
                placeholder="Email"
              />
            </div>

            <div className="w-full px-4 h-[2px] bg-gray-400" />

            <div>
              <input
                type="password"
                className="w-full px-4 py-2 rounded  focus:outline-none"
                placeholder="Kata Sandi"
              />
            </div>

            <div className="w-full px-4 h-[2px] bg-gray-400" />

            <button
              type="submit"
              className="w-full py-2 bg-blue-900 hover:bg-blue-700 rounded-3xl text-white font-semibold mt-2"
            >
              Masuk
            </button>
          </form>
          <div className="flex justify-between w-full max-w-sm text-sm mt-4">
            <a href="register" className="text-white underline">
              Belum Punya Akun?
            </a>
            <a href="#" className="text-white underline">
              Lupa Kata Sandi?
            </a>
          </div>
        </div>
        {/* Sebelah Kanan */}

        <img
          className="w-[578px] h-[717px]"
          src={gambarLogin}
          alt="icon bmkg"
        />
      </CardLogin>
    </BgLogin>
  );
}
