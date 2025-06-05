import React from "react";

export default function CardLogin({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center  min-h-screen">
      <div className="flex w-[900px] bg-gradient-to-b from-[#1A6EB5] to-[#073CA4] h-[617px] rounded-3xl overflow-hidden shadow-lg">
        <div className="w-1/2   text-white flex flex-col justify-center items-center px-10">
          {children}
        </div>
        <div>
          <div className="flex justify-center items-center">
            <img
              src="/BgLogin.png"
              alt="BgLogin"
              className="w-[578px] h-[617px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
