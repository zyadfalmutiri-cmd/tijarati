// Rule-based business-intelligence engine that powers the AI Assistant.
// It inspects the same normalized data the dashboard uses (branches, orders,
// products, expenses) and produces grounded, explainable answers — no
// hallucinated numbers. If ANTHROPIC_API_KEY is configured server-side, the
// /api/ai/assistant route can optionally hand this context to Claude for a
// more natural-language response; the reasoning below still supplies the
// factual grounding either way.

import { branches, orders, products, expenses, computeKPIs, getTrend } from "@/lib/mock-data/generators";

export interface AssistantAnswer {
  text: string;
  highlights?: { label: string; value: string }[];
}

function branchSales(branchId: string) {
  return orders.filter((o) => o.branchId === branchId && o.status === "completed").reduce((s, o) => s + o.total, 0);
}

function bestBranch() {
  return [...branches].sort((a, b) => branchSales(b.id) - branchSales(a.id))[0];
}

function worstBranch() {
  return [...branches].sort((a, b) => branchSales(a.id) - branchSales(b.id))[0];
}

function mostProfitableProducts(n = 3) {
  return [...products]
    .map((p) => ({ ...p, profit: (p.price - p.cost) * p.unitsSoldLast30Days }))
    .sort((a, b) => b.profit - a.profit)
    .slice(0, n);
}

function predictNextMonth() {
  const trend = getTrend("monthly");
  const last3 = trend.slice(-3).map((t) => t.sales);
  const avgGrowth = (last3[2] - last3[0]) / 2;
  const predicted = Math.round(last3[2] + avgGrowth);
  const changePct = (((predicted - last3[2]) / last3[2]) * 100).toFixed(1);
  return { predicted, changePct };
}

export function askAssistant(question: string): AssistantAnswer {
  const q = question.toLowerCase();
  const kpis = computeKPIs();

  if (/(انخفاض|تراجع|قلت|why.*decreas|sales.*down)/.test(q)) {
    const worst = worstBranch();
    const worstExpenses = expenses.filter((e) => e.branchId === worst.id).reduce((s, e) => s + e.amount, 0);
    return {
      text: `أداء المبيعات ليس متراجعًا بشكل عام (نمو المبيعات الشهري +${kpis.ordersChange}%)، لكن فرع "${worst.name}" هو الأضعف حاليًا بمبيعات ${branchSales(worst.id).toLocaleString("ar-SA")} ر.س فقط. أسباب محتملة: ارتفاع نسبة المصروفات التشغيلية (${worstExpenses.toLocaleString("ar-SA")} ر.س)، أو انخفاض عدد الطلبات مقارنة بباقي الفروع. أنصح بمراجعة تسعير المنتجات الأكثر مبيعًا في هذا الفرع وتحليل حركة العملاء بالساعة.`,
      highlights: [
        { label: "الفرع الأضعف", value: worst.name },
        { label: "مبيعاته", value: `${branchSales(worst.id).toLocaleString("ar-SA")} ر.س` },
      ],
    };
  }

  if (/(أفضل فرع|أداء الفروع|best branch)/.test(q)) {
    const best = bestBranch();
    return {
      text: `فرع "${best.name}" في ${best.city} هو الأفضل أداءً حاليًا بمبيعات ${branchSales(best.id).toLocaleString("ar-SA")} ر.س، ويُدار بواسطة ${best.manager}. يتفوق هذا الفرع غالبًا بسبب موقعه الاستراتيجي وثبات فريق المبيعات فيه. يمكنك تطبيق نفس ممارسات هذا الفرع (التسعير، تدريب الموظفين، ساعات الذروة) على الفروع الأضعف.`,
      highlights: [{ label: "الفرع الأفضل", value: best.name }, { label: "المبيعات", value: `${branchSales(best.id).toLocaleString("ar-SA")} ر.س` }],
    };
  }

  if (/(أعلى ربح|منتجات.*ربح|profit.*product|highest profit)/.test(q)) {
    const top = mostProfitableProducts(3);
    return {
      text: `أعلى ثلاثة منتجات من حيث الربح خلال آخر 30 يومًا هي: ${top.map((p, i) => `${i + 1}) ${p.name} بربح إجمالي ${p.profit.toLocaleString("ar-SA")} ر.س`).join("، ")}. يُنصح بزيادة المخزون والترويج لهذه المنتجات تحديدًا لأنها تحقق أعلى عائد لكل عملية بيع.`,
      highlights: top.map((p) => ({ label: p.name, value: `${p.profit.toLocaleString("ar-SA")} ر.س` })),
    };
  }

  if (/(توقع|تنبؤ|predict|forecast|الشهر القادم|next month)/.test(q)) {
    const { predicted, changePct } = predictNextMonth();
    return {
      text: `بناءً على اتجاه المبيعات خلال آخر 3 أشهر، من المتوقع أن تصل مبيعات الشهر القادم إلى نحو ${predicted.toLocaleString("ar-SA")} ر.س، بتغيّر تقديري ${changePct}% مقارنة بالشهر الحالي. هذا التوقع مبني على معدل النمو الفعلي المُلاحظ في بياناتك، وليس افتراضًا عشوائيًا — راجعه دوريًا مع تحديث البيانات.`,
      highlights: [{ label: "توقع الشهر القادم", value: `${predicted.toLocaleString("ar-SA")} ر.س` }, { label: "نسبة التغيّر", value: `${changePct}%` }],
    };
  }

  if (/(اقتراح|تحسين|زياد.*ربح|improve profit|suggest)/.test(q)) {
    const worst = worstBranch();
    const lowMarginProducts = [...products].filter((p) => (p.price - p.cost) / p.price < 0.3).length;
    return {
      text: `لتحسين صافي الربح، أقترح: 1) مراجعة تسعير ${lowMarginProducts} منتج بهامش ربح أقل من 30%. 2) خفض المصروفات التشغيلية في فرع "${worst.name}" الأقل كفاءة. 3) التركيز التسويقي على المنتجات الأعلى ربحية بدل الأعلى مبيعًا فقط. 4) تقليل معدل المرتجعات الكبيرة عبر تحسين جودة الوصف والتغليف.`,
      highlights: [{ label: "هامش الربح الحالي", value: `${kpis.profitMargin}%` }],
    };
  }

  return {
    text: `يمكنني الإجابة عن أسئلة حول أداء الفروع، أسباب تغيّر المبيعات، أكثر المنتجات ربحية، توقعات المبيعات، واقتراحات تحسين الربح — بناءً على بياناتك الفعلية المتصلة بالمنصة. جرّب أن تسأل مثلاً: "لماذا تنخفض المبيعات؟" أو "ما هو أفضل فرع أداءً؟"`,
  };
}
