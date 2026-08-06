// Core domain types shared across the whole platform.
// These mirror the Supabase/PostgreSQL schema in supabase/schema.sql so the
// UI layer is identical whether data comes from mock generators or Supabase.

export type ID = string;

export interface Branch {
  id: ID;
  name: string;
  city: string;
  lat: number;
  lng: number;
  manager: string;
  openedAt: string;
  status: "active" | "paused";
}

export interface Order {
  id: ID;
  branchId: ID;
  customerName: string;
  total: number;
  itemsCount: number;
  status: "completed" | "pending" | "refunded" | "cancelled";
  channel: "in-store" | "online" | "pos" | "marketplace";
  createdAt: string;
}

export interface Product {
  id: ID;
  name: string;
  sku: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  reorderLevel: number;
  unitsSoldLast30Days: number;
  branchId: ID;
}

export interface Employee {
  id: ID;
  name: string;
  role: string;
  branchId: ID;
  avatarColor: string;
  salesTotal: number;
  ordersHandled: number;
  attendanceRate: number; // 0-100
  productivityScore: number; // 0-100
}

export interface Expense {
  id: ID;
  branchId: ID;
  category: "rent" | "salaries" | "utilities" | "marketing" | "supplies" | "other";
  amount: number;
  date: string;
}

export interface Refund {
  id: ID;
  orderId: ID;
  branchId: ID;
  amount: number;
  reason: string;
  createdAt: string;
  isLarge: boolean;
}

export type NotificationType =
  | "sales_up"
  | "sales_down"
  | "inventory_low"
  | "large_refund"
  | "system";

export interface AppNotification {
  id: ID;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  branchId?: ID;
}

export interface KPISet {
  todaySales: number;
  todaySalesChange: number;
  weekSales: number;
  monthSales: number;
  yearSales: number;
  revenue: number;
  netProfit: number;
  netProfitChange: number;
  expenses: number;
  profitMargin: number;
  taxes: number;
  orders: number;
  ordersChange: number;
  avgOrderValue: number;
  refunds: number;
  refundsChange: number;
}

export interface TrendPoint {
  label: string;
  sales: number;
  revenue?: number;
  expenses?: number;
  customers?: number;
}

export type Granularity = "hourly" | "daily" | "weekly" | "monthly" | "yearly";
