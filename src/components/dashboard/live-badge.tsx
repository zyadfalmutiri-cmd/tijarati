"use client";
import { useEffect, useState } from "react";

export function LiveBadge() {
  const [tick, setTick] = useState(true);
  useEffect(() => {
    const i = setInterval(() => setTick((t) => !t), 1500);
    return () => clearInterval(i);
  }, []);
  return (
    <div className="hidden md:flex items-center gap-1.5 rounded-full border bg-success/5 px-2.5 py-1 text-xs font-medium text-success">
      <span className={`h-1.5 w-1.5 rounded-full bg-success ${tick ? "animate-pulse-dot" : ""}`} />
      مباشر
    </div>
  );
}
