"use client";

import useModal from "@/hooks/useModal";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const UtilHeader = () => {
  const { openModal } = useModal();
  const router = useRouter();
  const [query, setQuery] = useState("");
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query !== "") {
        router.push(`/home/organizers?q=${query}`);
      } else {
        router.push(`/home/organizers`);
      }
    }, 1500);
    return () => clearTimeout(delayDebounceFn);
  }, [query, router]);
  return (
    <div className="flex items-center gap-6 mt-[20px] w-full">
      <input
        type="search"
        className="input w-full input-bordered"
        placeholder="Search organizer"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="tooltip" data-tip="Add new organizer">
        <button
          className="btn btn-circle btn-md"
          type="button"
          onClick={() => openModal("add-organizer")}
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
};

export default UtilHeader;
