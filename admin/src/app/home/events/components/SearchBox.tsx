"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SearchBox = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query !== "") {
        router.push(`/home/events?q=${query}`);
      } else {
        router.push(`/home/events`);
      }
    }, 1500);
    return () => clearTimeout(delayDebounceFn);
  }, [query, router]);
  return (
    <div>
      <input
        type="search"
        className="input w-full input-bordered mt-[20px]"
        placeholder="Search events"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
};

export default SearchBox;
