import { seededRandom } from "@/lib/utils";
import type {
  Branch, Order, Product, Employee, Expense, Refund, AppNotification,
  KPISet, TrendPoint, Granularity,
} from "@/lib/types/domain";

// Deterministic seeded "randomness" so the demo dashboard renders consistent,
// realistic numbers on every load/reload instead of pure noise, while still
// feeling alive (live counters are perturbed with Date.now()).
const rand = seededRandom(42);

export const branches: Branch[] = [
  { id: "b1", name: "فرع الرياض - العليا", city: "الرياض", lat: 24.7136, lng: 46.6753, manager: "سارة القحطاني", openedAt: "2021-03-01", status: "active" },
  { id: "b2", name: "فرع جدة - التحلية", city: "جدة", lat: 21.4858, lng: 39.1925, manager: "خالد العمري", openedAt: "2021-09-14", status: "active" },
  { id: "b3", name: "فرع الدمام - الشاطئ", city: "الدمام", lat: 26.4207, lng: 50.0888, manager: "منى الزهراني", openedAt: "2022-01-20", status: "active" },
  { id: "b4", name: "فرع مكة - العزيزية", city: "مكة المكرمة", lat: 21.3891, lng: 39.8579, manager: "فهد الغامدي", openedAt: "2022-06-10", status: "active" },
  { id: "b5", name: "فرع المدينة - قباء", city: "المدينة المنورة", lat: 24.4672, lng: 39.6111, manager: "نورة السبيعي", openedAt: "2023-02-05", status: "active" },
  { id: "b6", name: "فرع الخبر - الراكة", city: "الخبر", lat: 26.2172, lng: 50.1971, manager: "عبدالله المطيري", openedAt: "2023-11-01", status: "paused" },
];

const categories = ["إلكترونيات", "ملابس", "أغذية", "منزل ومطبخ", "عناية شخصية", "مستلزمات مكتب"];
const productNames = [
  "سماعة لاسلكية برو", "قميص قطني كلاسيك", "قهوة مختصة 250غ", "طقم أواني طهي", "كريم ترطيب يومي",
  "دفتر ملاحظات جلدي", "ساعة ذكية X2", "حذاء رياضي خفيف", "عسل سدر طبيعي", "مكواة بخار سريعة",
  "شاحن سريع 65 واط", "بنطال جينز مريح", "شاي أخضر فاخر", "مصباح مكتب LED", "شامبو عناية مكثفة",
  "حقيبة ظهر عملية", "لوحة مفاتيح ميكانيكية", "عباية تطريز فاخرة", "زيت زيتون بكر", "مقلاة هوائية",
];

export const products: Product[] = productNames.map((name, i) => {
  const branchId = branches[i % branches.length].id;
  const price = Math.round((30 + rand() * 470) / 5) * 5;
  const cost = Math.round(price * (0.4 + rand() * 0.25));
  const stock = Math.floor(rand() * 200);
  const reorderLevel = 20 + Math.floor(rand() * 20);
  return {
    id: `p${i + 1}`,
    name,
    sku: `SKU-${1000 + i}`,
    category: categories[i % categories.length],
    price,
    cost,
    stock,
    reorderLevel,
    unitsSoldLast30Days: Math.floor(rand() * 400) + (i < 6 ? 200 : 0),
    branchId,
  };
});

const firstNames = ["سارة", "خالد", "منى", "فهد", "نورة", "عبدالله", "ريم", "ماجد", "لمى", "تركي", "هند", "سلطان"];
const lastNames = ["القحطاني", "العمري", "الزهراني", "الغامدي", "السبيعي", "المطيري", "الحربي", "الدوسري"];
const roles = ["مندوب مبيعات", "كاشير", "مشرف فرع", "أمين مخزون"];
const avatarColors = ["#6D5EF7", "#22C58B", "#F5A524", "#EC4899", "#0EA5E9", "#F43F5E"];

export const employees: Employee[] = Array.from({ length: 18 }).map((_, i) => ({
  id: `e${i + 1}`,
  name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
  role: roles[i % roles.length],
  branchId: branches[i % branches.length].id,
  avatarColor: avatarColors[i % avatarColors.length],
  salesTotal: Math.floor(rand() * 90000) + 8000,
  ordersHandled: Math.floor(rand() * 500) + 40,
  attendanceRate: Math.round(80 + rand() * 20),
  productivityScore: Math.round(60 + rand() * 40),
}));

const customerNames = ["محمد العتيبي", "عائشة الشمري", "يوسف الجهني", "لينا فرحان", "عمر الشهري", "دانة الحربي", "زياد النجدي", "غادة السالم"];
const channels: Order["channel"][] = ["in-store", "online", "pos", "marketplace"];

export function generateOrders(count = 260): Order[] {
  const list: Order[] = [];
  const now = Date.now();
  for (let i = 0; i < count; i++) {
    const branchId = branches[Math.floor(rand() * branches.length)].id;
    const daysAgo = Math.floor(rand() * 30);
    const total = Math.round((40 + rand() * 900) / 5) * 5;
    const statusRoll = rand();
    list.push({
      id: `ord${i + 1}`,
      branchId,
      customerName: customerNames[Math.floor(rand() * customerNames.length)],
      total,
      itemsCount: 1 + Math.floor(rand() * 6),
      status: statusRoll > 0.94 ? "refunded" : statusRoll > 0.9 ? "cancelled" : statusRoll > 0.85 ? "pending" : "completed",
      channel: channels[Math.floor(rand() * channels.length)],
      createdAt: new Date(now - daysAgo * 86400000 - Math.floor(rand() * 86400000)).toISOString(),
    });
  }
  return list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export const orders = generateOrders();

export const expenseCategories: Expense["category"][] = ["rent", "salaries", "utilities", "marketing", "supplies", "other"];

export function generateExpenses(): Expense[] {
  const list: Expense[] = [];
  const now = Date.now();
  branches.forEach((b) => {
    expenseCategories.forEach((cat, idx) => {
      list.push({
        id: `exp-${b.id}-${cat}`,
        branchId: b.id,
        category: cat,
        amount: Math.round((2000 + rand() * 18000) / 100) * 100,
        date: new Date(now - idx * 86400000 * 3).toISOString(),
      });
    });
  });
  return list;
}

export const expenses = generateExpenses();

export function generateRefunds(): Refund[] {
  return orders
    .filter((o) => o.status === "refunded")
    .map((o) => ({
      id: `rf-${o.id}`,
      orderId: o.id,
      branchId: o.branchId,
      amount: o.total,
      reason: ["منتج تالف", "تأخر التوصيل", "عدم الرضا", "خطأ في الطلب"][Math.floor(rand() * 4)],
      createdAt: o.createdAt,
      isLarge: o.total > 500,
    }));
}

export const refunds = generateRefunds();

export function computeKPIs(): KPISet {
  const todayOrders = orders.filter((o) => {
    const d = new Date(o.createdAt);
    const now = new Date();
    return d.toDateString() === now.toDateString() && o.status === "completed";
  });
  const todaySales = todayOrders.reduce((s, o) => s + o.total, 0) || 18420;
  const weekSales = orders.filter((o) => Date.now() - +new Date(o.createdAt) < 7 * 86400000 && o.status === "completed").reduce((s, o) => s + o.total, 0);
  const monthSales = orders.filter((o) => o.status === "completed").reduce((s, o) => s + o.total, 0);
  const yearSales = monthSales * 8.4;
  const revenue = monthSales;
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const taxes = Math.round(revenue * 0.15);
  const netProfit = revenue - totalExpenses - taxes;
  const completedOrders = orders.filter((o) => o.status === "completed");
  const refundsTotal = refunds.reduce((s, r) => s + r.amount, 0);

  return {
    todaySales,
    todaySalesChange: 12.4,
    weekSales,
    monthSales,
    yearSales,
    revenue,
    netProfit,
    netProfitChange: 8.1,
    expenses: totalExpenses,
    profitMargin: Number(((netProfit / revenue) * 100).toFixed(1)),
    taxes,
    orders: completedOrders.length,
    ordersChange: 5.6,
    avgOrderValue: Math.round(revenue / (completedOrders.length || 1)),
    refunds: refundsTotal,
    refundsChange: -3.2,
  };
}

const hourLabels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
const dayLabels = ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];
const weekLabels = ["الأسبوع 1", "الأسبوع 2", "الأسبوع 3", "الأسبوع 4"];
const monthLabels = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
const yearLabels = ["2021", "2022", "2023", "2024", "2025", "2026"];

function buildSeries(labels: string[], base: number, volatility: number, trendUp = true): TrendPoint[] {
  let value = base;
  return labels.map((label, i) => {
    const trend = trendUp ? i * (base * 0.015) : -i * (base * 0.01);
    value = Math.max(base * 0.3, base + trend + (rand() - 0.5) * volatility);
    const expensesVal = value * (0.45 + rand() * 0.1);
    return {
      label,
      sales: Math.round(value),
      revenue: Math.round(value * 1.05),
      expenses: Math.round(expensesVal),
      customers: Math.round(20 + rand() * 80 + i * 1.5),
    };
  });
}

export function getTrend(granularity: Granularity): TrendPoint[] {
  switch (granularity) {
    case "hourly": return buildSeries(hourLabels, 2200, 1400);
    case "daily": return buildSeries(dayLabels, 15000, 6000);
    case "weekly": return buildSeries(weekLabels, 95000, 20000);
    case "monthly": return buildSeries(monthLabels, 380000, 90000);
    case "yearly": return buildSeries(yearLabels, 3800000, 500000);
  }
}

export function generateNotifications(): AppNotification[] {
  const now = Date.now();
  const items: Omit<AppNotification, "id" | "createdAt">[] = [
    { type: "sales_up", title: "ارتفاع في المبيعات", message: "فرع الرياض - العليا سجّل ارتفاعًا بنسبة 18% خلال الساعتين الماضيتين", read: false, branchId: "b1" },
    { type: "inventory_low", title: "تنبيه مخزون منخفض", message: "منتج \"سماعة لاسلكية برو\" أوشك على النفاد (6 قطع متبقية)", read: false, branchId: "b1" },
    { type: "large_refund", title: "استرداد كبير", message: "تم تسجيل استرداد بقيمة 850 ر.س في فرع جدة - التحلية", read: false, branchId: "b2" },
    { type: "sales_down", title: "انخفاض في المبيعات", message: "فرع الخبر - الراكة أظهر انخفاضًا بنسبة 9% مقارنة بالأمس", read: true, branchId: "b6" },
    { type: "system", title: "مزامنة ناجحة", message: "تمت مزامنة بيانات Shopify بنجاح — 142 طلبًا جديدًا", read: true },
    { type: "inventory_low", title: "تنبيه مخزون منخفض", message: "منتج \"شاي أخضر فاخر\" وصل إلى حد إعادة الطلب", read: true, branchId: "b3" },
    { type: "system", title: "تنبيه اتصال", message: "تعذّر الاتصال بمزوّد الدفع Tap Payments، الرجاء إعادة المصادقة", read: true },
  ];
  return items.map((it, i) => ({ ...it, id: `n${i + 1}`, createdAt: new Date(now - i * 3600_000 * (i + 1)).toISOString() }));
}

export const notifications = generateNotifications();
