"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { deleteCookie } from "@/actions/actions";

const Navbar: React.FC = () => {
  const router = useRouter();
  async function handleLogout() {
    await deleteCookie();
    router.push("/login");
  }
  return (
    <div className="navbar bg-base-100 shadow-md">
      <Link href="/home" className="flex-1">
        <Image
          src="/images/event.png"
          alt="Picture of the author"
          width={200}
          height={80}
          className="pointer-events-none"
        />
      </Link>
      <div className="flex-none gap-6 px-10">
        <Link className="btn" href="/home/organizers">
          Organizers
        </Link>
        <Link className="btn" href="/home/events">
          Events
        </Link>
        <button className="btn" onClick={handleLogout}>
          LogOut
        </button>
      </div>
    </div>
  );
};

export default Navbar;
