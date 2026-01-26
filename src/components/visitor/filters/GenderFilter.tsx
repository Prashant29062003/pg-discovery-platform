"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/utils";

const options = ["ALL", "MEN", "WOMEN", "UNISEX"];

export default function GenderFilter({ currentGender }: { currentGender: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilter = (gender: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (gender === "ALL") {
      params.delete("gender");
    } else {
      params.set("gender", gender);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="inline-flex p-1 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
      {options.map((option) => {
        const isActive = currentGender.toUpperCase() === option;
        return (
          <button
            key={option}
            onClick={() => handleFilter(option)}
            className={cn(
              "relative px-6 py-2 text-sm font-semibold transition-all duration-200 rounded-xl",
              isActive ? "text-white" : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-orange-600 rounded-xl shadow-md"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{option}</span>
          </button>
        );
      })}
    </div>
  );
}