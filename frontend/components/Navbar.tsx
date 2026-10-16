"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const getLinkClass = (path: string) =>
  `px-4 py-2 rounded transition-colors ${
    pathname === path
      ? "bg-blue-600 text-white"
      : "bg-gray-200 text-black hover:bg-gray-300"
  }`;

  return (
    <nav className="flex items-center gap-4 p-4 border-b bg-white shadow-sm">

        <Image
            src="/coptopt.svg"
            alt="CopOpt Logo"
            width={120}
            height={40}
            priority
        />

        <Link
            href="/"
            className={getLinkClass("/")}
        >
            Single Dataset
        </Link>

        <Link
            href="/comparison"
            className={getLinkClass("/comparison")}
        >
            Comparison
        </Link>
    </nav>
  );
}