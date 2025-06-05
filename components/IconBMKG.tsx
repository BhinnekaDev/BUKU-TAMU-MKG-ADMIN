// IconBMKG.tsx
import Image from "next/image";
import { ReactNode } from "react";

export default function IconBMKG({
  logo,
  horizontal = true,
  imgClassName = "",
  className = "",
  children,
}: {
  logo: string;
  horizontal?: boolean;
  imgClassName?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={`flex items-center ${
        horizontal ? "flex-row" : "flex-col"
      } ${className}`}
    >
      <Image
        src={logo}
        alt="Logo BMKG"
        width={40}
        height={40}
        className={imgClassName}
      />
      {children && <div className="ml-2">{children}</div>}
    </div>
  );
}
