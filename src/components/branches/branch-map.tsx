"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BranchPerformance } from "@/hooks/use-branches";
import { formatCurrency } from "@/lib/utils";

// Lightweight self-contained map: projects lat/lng onto a stylized KSA-region
// SVG canvas. No external maps API/key required, works fully offline.
function project(lat: number, lng: number) {
  const minLat = 16, maxLat = 32, minLng = 34, maxLng = 52;
  const x = ((lng - minLng) / (maxLng - minLng)) * 100;
  const y = 100 - ((lat - minLat) / (maxLat - minLat)) * 100;
  return { x, y };
}

export function BranchMap({ branches }: { branches: BranchPerformance[] }) {
  const [active, setActive] = useState<string | null>(null);
  const max = Math.max(...branches.map((b) => b.sales), 1);

  return (
    <Card>
      <CardHeader><CardTitle>خريطة الفروع</CardTitle></CardHeader>
      <CardContent>
        <div className="relative w-full aspect-[4/3] rounded-xl bg-gradient-to-br from-secondary to-secondary/50 border overflow-hidden">
          <svg className="absolute inset-0 w-full h-full opacity-[0.07]" viewBox="0 0 100 100" preserveAspectRatio="none">
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`v${i}`} x1={i * 10} y1={0} x2={i * 10} y2={100} stroke="currentColor" strokeWidth="0.2" />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`h${i}`} x1={0} y1={i * 10} x2={100} y2={i * 10} stroke="currentColor" strokeWidth="0.2" />
            ))}
          </svg>
          {branches.map((b, i) => {
            const { x, y } = project(b.lat, b.lng);
            const size = 10 + (b.sales / max) * 18;
            return (
              <motion.div
                key={b.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.06, type: "spring" }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{ left: `${x}%`, top: `${y}%` }}
                onMouseEnter={() => setActive(b.id)}
                onMouseLeave={() => setActive(null)}
              >
                <div
                  className="rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-primary transition-transform hover:scale-110"
                  style={{ width: size, height: size }}
                >
                  {b.status === "active" && <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-dot" />}
                </div>
                {active === b.id && (
                  <div className="absolute bottom-full mb-2 right-1/2 translate-x-1/2 whitespace-nowrap rounded-lg bg-popover border shadow-glow px-3 py-2 text-xs z-10">
                    <p className="font-semibold flex items-center gap-1"><MapPin className="h-3 w-3" />{b.name}</p>
                    <p className="text-muted-foreground mt-0.5">{formatCurrency(b.sales)}</p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
