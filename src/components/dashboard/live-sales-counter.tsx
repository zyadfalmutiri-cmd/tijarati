"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { useKPIs } from "@/hooks/use-kpis";

export function LiveSalesCounter() {
  const { data: kpis } = useKPIs();
  const [liveTotal, setLiveTotal] = useState(0);
  const [pulse, setPulse] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (kpis && !initialized.current) {
      setLiveTotal(kpis.todaySales);
      initialized.current = true;
    }
  }, [kpis]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.35) {
        const bump = Math.round((20 + Math.random() * 260) / 5) * 5;
        setLiveTotal((v) => v + bump);
        setPulse(true);
        setTimeout(() => setPulse(false), 600);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/[0.06] via-card to-card">
      <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
      <CardContent className="p-5 relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Zap className="h-4 w-4" />
            </div>
            <p className="text-sm font-semibold">عداد المبيعات المباشر</p>
          </div>
          <span className="flex items-center gap-1 text-xs text-success font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-dot" />
            الآن
          </span>
        </div>
        <motion.p
          animate={pulse ? { scale: [1, 1.04, 1] } : {}}
          className="number-tabular text-3xl lg:text-4xl font-extrabold tracking-tight"
        >
          {formatCurrency(liveTotal)}
        </motion.p>
        <div className="flex items-center gap-1.5 mt-2 text-xs text-success">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>مبيعات اليوم مقارنة بالأمس</span>
          <span className="font-bold">+12.4%</span>
        </div>
      </CardContent>
    </Card>
  );
}
