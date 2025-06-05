"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BgPage from "@/components/BgPage";
import Card from "@/components/Card";
import IconBMKG from "@/components/IconBMKG";
import Footer from "@/components/Footer";

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <BgPage>
        <IconBMKG logo="/LogoBmkgSmall.png">
          BMKG PROVINSI
          <br />
          BENGKULU
        </IconBMKG>

        <div className="flex justify-center items-center">
          <img
            src="/LogoBmkg.png"
            alt="Logo Bmkg"
            className="flex justify-center items-center w-[121px] h-[109px]"
          />
        </div>
        <div className="flex flex-col items-center justify-center text-white space-y-4 text-center px-4">
          <h1 className="text-4xl md:text5xl font-medium leading-tight">
            BUKU TAMU DIGITAL BMKG
            <br />
            PROVINSI BENGKULU
          </h1>

          <h2 className="text-lg md:text-xl font-light">
            Silahkan pilih stasiun yang anda kunjungi :
          </h2>

          <div className="flex gap-4 justify-center items-start">
            <Card
              image="/GedungMeteo.png"
              text="STASIUN METEOROLOGI"
              logo="/LogoBmkgSmall.png"
              textColor="bg-gradient-to-r from-[#1A6EB5] to-[#073CA4] bg-clip-text text-transparent"
              onclick={() => router.push("/login")}
            />
            <Card
              image="/GedungKlima.png"
              text="STASIUN KLIMATOLOGI"
              logo="/LogoBmkgSmall.png"
              textColor="bg-gradient-to-r from-[#1A6EB5] to-[#073CA4] bg-clip-text text-transparent"
              onclick={() => router.push("/login")}
            />
            <Card
              image="/GedungGeo.png"
              text="STASIUN GEOFISIKA"
              logo="/LogoBmkgSmall.png"
              textColor="bg-gradient-to-r from-[#1A6EB5] to-[#073CA4] bg-clip-text text-transparent"
              onclick={() => router.push("/login")}
            />
          </div>
        </div>
      </BgPage>
      <Footer />
    </div>
  );
}
