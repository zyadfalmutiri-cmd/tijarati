import type { ConnectorDefinition } from "./types";

// Full catalog requested for the Integrations Marketplace. Connectors with
// `hasAdapter: true` ship a concrete, working ConnectorAdapter implementation
// (see /adapters). The rest are fully wired into the marketplace UI, sync
// engine, and connection-state store — only the vendor-specific adapter class
// needs to be added, following the exact pattern of the five reference
// adapters, for them to go live. This keeps the architecture genuinely
// modular: the core app never needs to change to add #51.

export const connectorRegistry: ConnectorDefinition[] = [
  // ---------------- E-commerce ----------------
  { id: "shopify", name: "Shopify", nameAr: "شوبيفاي", category: "ecommerce", authMethod: "oauth2", description: "منصة تجارة إلكترونية عالمية", color: "#95BF47", hasAdapter: true },
  { id: "woocommerce", name: "WooCommerce", nameAr: "ووكومرس", category: "ecommerce", authMethod: "api-key", description: "إضافة متجر إلكتروني لووردبريس", color: "#96588A", hasAdapter: true },
  { id: "bigcommerce", name: "BigCommerce", nameAr: "بيغ كوميرس", category: "ecommerce", authMethod: "oauth2", description: "منصة تجارة إلكترونية للمؤسسات", color: "#34313F", hasAdapter: false },
  { id: "magento", name: "Magento (Adobe Commerce)", nameAr: "ماجنتو", category: "ecommerce", authMethod: "api-key", description: "منصة أدوبي للتجارة الإلكترونية", color: "#F26322", hasAdapter: false },
  { id: "opencart", name: "OpenCart", nameAr: "أوبن كارت", category: "ecommerce", authMethod: "api-key", description: "منصة تجارة إلكترونية مفتوحة المصدر", color: "#26B6E5", hasAdapter: false },
  { id: "prestashop", name: "PrestaShop", nameAr: "بريستاشوب", category: "ecommerce", authMethod: "api-key", description: "منصة متاجر إلكترونية أوروبية", color: "#DF0067", hasAdapter: false },
  { id: "wix", name: "Wix Stores", nameAr: "ويكس ستورز", category: "ecommerce", authMethod: "oauth2", description: "متاجر ويكس الإلكترونية", color: "#0C6EFC", hasAdapter: false },
  { id: "squarespace", name: "Squarespace Commerce", nameAr: "سكوير سبيس", category: "ecommerce", authMethod: "oauth2", description: "متجر سكوير سبيس", color: "#000000", hasAdapter: false },
  { id: "ecwid", name: "Ecwid", nameAr: "إكويد", category: "ecommerce", authMethod: "oauth2", description: "متجر إلكتروني قابل للتضمين", color: "#03A9F4", hasAdapter: false },
  { id: "salesforce-commerce", name: "Salesforce Commerce Cloud", nameAr: "سيلزفورس كوميرس", category: "ecommerce", authMethod: "oauth2", description: "منصة سيلزفورس للتجارة", color: "#00A1E0", hasAdapter: false },
  { id: "salla", name: "Salla", nameAr: "سلة", category: "ecommerce", authMethod: "oauth2", description: "منصة سلة السعودية للمتاجر", color: "#1CE783", hasAdapter: false },
  { id: "zid", name: "Zid", nameAr: "زد", category: "ecommerce", authMethod: "oauth2", description: "منصة زد للمتاجر الإلكترونية", color: "#0D2436", hasAdapter: false },
  { id: "expandcart", name: "ExpandCart", nameAr: "إكسباند كارت", category: "ecommerce", authMethod: "api-key", description: "منصة متاجر عربية", color: "#6C3FC5", hasAdapter: false },

  // ---------------- POS ----------------
  { id: "foodics", name: "Foodics", nameAr: "فودكس", category: "pos", authMethod: "oauth2", description: "نظام نقاط بيع للمطاعم", color: "#E4523B", hasAdapter: false },
  { id: "square-pos", name: "Square POS", nameAr: "سكوير", category: "pos", authMethod: "api-key", description: "نظام نقاط بيع Square", color: "#000000", hasAdapter: true },
  { id: "clover", name: "Clover", nameAr: "كلوفر", category: "pos", authMethod: "oauth2", description: "نظام نقاط بيع Clover", color: "#00A862", hasAdapter: false },
  { id: "lightspeed-retail", name: "Lightspeed Retail", nameAr: "لايت سبيد ريتيل", category: "pos", authMethod: "oauth2", description: "نقاط بيع للمتاجر", color: "#B6DE38", hasAdapter: false },
  { id: "lightspeed-restaurant", name: "Lightspeed Restaurant", nameAr: "لايت سبيد مطاعم", category: "pos", authMethod: "oauth2", description: "نقاط بيع للمطاعم", color: "#B6DE38", hasAdapter: false },
  { id: "shopify-pos", name: "Shopify POS", nameAr: "شوبيفاي بوس", category: "pos", authMethod: "oauth2", description: "نقاط بيع شوبيفاي", color: "#95BF47", hasAdapter: false },
  { id: "oracle-micros", name: "Oracle MICROS", nameAr: "أوراكل مايكروس", category: "pos", authMethod: "api-key", description: "أنظمة نقاط بيع أوراكل", color: "#C74634", hasAdapter: false },
  { id: "toast-pos", name: "Toast POS", nameAr: "توست", category: "pos", authMethod: "oauth2", description: "نقاط بيع للمطاعم", color: "#FF4C00", hasAdapter: false },
  { id: "revel", name: "Revel Systems", nameAr: "ريفل", category: "pos", authMethod: "api-key", description: "نظام نقاط بيع Revel", color: "#1B1F3B", hasAdapter: false },
  { id: "vend", name: "Vend (Lightspeed X-Series)", nameAr: "فيند", category: "pos", authMethod: "oauth2", description: "نقاط بيع للتجزئة", color: "#4FC9DB", hasAdapter: false },
  { id: "erply", name: "Erply", nameAr: "إيربلاي", category: "pos", authMethod: "api-key", description: "نظام نقاط بيع Erply", color: "#2E3A59", hasAdapter: false },
  { id: "hike-pos", name: "Hike POS", nameAr: "هايك بوس", category: "pos", authMethod: "api-key", description: "نقاط بيع سحابية", color: "#5B4CFF", hasAdapter: false },
  { id: "loyverse", name: "Loyverse POS", nameAr: "لويفيرس", category: "pos", authMethod: "oauth2", description: "نقاط بيع مجانية", color: "#EF3E36", hasAdapter: false },

  // ---------------- Payments ----------------
  { id: "stripe", name: "Stripe", nameAr: "سترايب", category: "payments", authMethod: "api-key", description: "بوابة دفع عالمية", color: "#635BFF", hasAdapter: true },
  { id: "paypal", name: "PayPal", nameAr: "باي بال", category: "payments", authMethod: "oauth2", description: "بوابة دفع عالمية", color: "#003087", hasAdapter: false },
  { id: "adyen", name: "Adyen", nameAr: "أديين", category: "payments", authMethod: "api-key", description: "بوابة دفع للمؤسسات", color: "#0ABF53", hasAdapter: false },
  { id: "checkout", name: "Checkout.com", nameAr: "تشيك أوت دوت كوم", category: "payments", authMethod: "api-key", description: "بوابة دفع عالمية", color: "#0C2340", hasAdapter: false },
  { id: "hyperpay", name: "HyperPay", nameAr: "هايبر باي", category: "payments", authMethod: "api-key", description: "بوابة دفع خليجية", color: "#6F42C1", hasAdapter: false },
  { id: "moyasar", name: "Moyasar", nameAr: "ميسر", category: "payments", authMethod: "api-key", description: "بوابة دفع سعودية", color: "#0D9488", hasAdapter: false },
  { id: "tap", name: "Tap Payments", nameAr: "تاب", category: "payments", authMethod: "api-key", description: "بوابة دفع خليجية", color: "#00BFA5", hasAdapter: false },
  { id: "paytabs", name: "PayTabs", nameAr: "باي تابس", category: "payments", authMethod: "api-key", description: "بوابة دفع إقليمية", color: "#EE3124", hasAdapter: false },
  { id: "myfatoorah", name: "MyFatoorah", nameAr: "ماي فاتورة", category: "payments", authMethod: "api-key", description: "بوابة دفع خليجية", color: "#7A1FA2", hasAdapter: false },
  { id: "amazon-payment-services", name: "Amazon Payment Services", nameAr: "أمازون للمدفوعات", category: "payments", authMethod: "api-key", description: "بوابة دفع أمازون", color: "#FF9900", hasAdapter: false },

  // ---------------- Accounting ----------------
  { id: "quickbooks", name: "QuickBooks", nameAr: "كويك بوكس", category: "accounting", authMethod: "oauth2", description: "برنامج محاسبة سحابي", color: "#2CA01C", hasAdapter: true },
  { id: "xero", name: "Xero", nameAr: "زيرو", category: "accounting", authMethod: "oauth2", description: "برنامج محاسبة سحابي", color: "#13B5EA", hasAdapter: false },
  { id: "zoho-books", name: "Zoho Books", nameAr: "زوهو بوكس", category: "accounting", authMethod: "oauth2", description: "برنامج محاسبة Zoho", color: "#E42527", hasAdapter: false },
  { id: "odoo", name: "Odoo", nameAr: "أودو", category: "accounting", authMethod: "api-key", description: "نظام ERP متكامل", color: "#714B67", hasAdapter: false },
  { id: "sage", name: "Sage", nameAr: "سيج", category: "accounting", authMethod: "oauth2", description: "برنامج محاسبة للمؤسسات", color: "#00DC00", hasAdapter: false },
  { id: "freshbooks", name: "FreshBooks", nameAr: "فريش بوكس", category: "accounting", authMethod: "oauth2", description: "محاسبة لأصحاب الأعمال الصغيرة", color: "#0075DD", hasAdapter: false },

  // ---------------- Banking ----------------
  { id: "open-banking", name: "Open Banking", nameAr: "الخدمات المصرفية المفتوحة", category: "banking", authMethod: "oauth2", description: "ربط الحسابات البنكية عبر Open Banking حيثما توفر", color: "#1E40AF", hasAdapter: false },

  // ---------------- Shipping ----------------
  { id: "aramex", name: "Aramex", nameAr: "أرامكس", category: "shipping", authMethod: "api-key", description: "خدمات شحن إقليمية وعالمية", color: "#E4032E", hasAdapter: false },
  { id: "dhl", name: "DHL", nameAr: "دي إتش إل", category: "shipping", authMethod: "api-key", description: "شحن دولي", color: "#FFCC00", hasAdapter: false },
  { id: "fedex", name: "FedEx", nameAr: "فيدكس", category: "shipping", authMethod: "api-key", description: "شحن دولي", color: "#4D148C", hasAdapter: false },
  { id: "ups", name: "UPS", nameAr: "يو بي إس", category: "shipping", authMethod: "api-key", description: "شحن دولي", color: "#351C15", hasAdapter: false },
  { id: "shipstation", name: "ShipStation", nameAr: "شيب ستيشن", category: "shipping", authMethod: "api-key", description: "إدارة شحنات متعددة الناقلين", color: "#0F6FFF", hasAdapter: false },
  { id: "shippo", name: "Shippo", nameAr: "شيبو", category: "shipping", authMethod: "api-key", description: "إدارة شحنات متعددة الناقلين", color: "#5D33F6", hasAdapter: false },
  { id: "easyship", name: "Easyship", nameAr: "إيزي شيب", category: "shipping", authMethod: "api-key", description: "إدارة شحنات متعددة الناقلين", color: "#00C48C", hasAdapter: false },

  // ---------------- Marketing ----------------
  { id: "google-analytics", name: "Google Analytics", nameAr: "جوجل أناليتكس", category: "marketing", authMethod: "oauth2", description: "تحليلات الموقع والزوار", color: "#F9AB00", hasAdapter: false },
  { id: "google-ads", name: "Google Ads", nameAr: "إعلانات جوجل", category: "marketing", authMethod: "oauth2", description: "منصة إعلانات جوجل", color: "#4285F4", hasAdapter: false },
  { id: "meta-ads", name: "Meta Ads", nameAr: "إعلانات ميتا", category: "marketing", authMethod: "oauth2", description: "إعلانات فيسبوك وإنستغرام", color: "#0866FF", hasAdapter: false },
  { id: "tiktok-ads", name: "TikTok Ads", nameAr: "إعلانات تيك توك", category: "marketing", authMethod: "oauth2", description: "منصة إعلانات تيك توك", color: "#000000", hasAdapter: false },
  { id: "linkedin-ads", name: "LinkedIn Ads", nameAr: "إعلانات لينكدإن", category: "marketing", authMethod: "oauth2", description: "منصة إعلانات لينكدإن", color: "#0A66C2", hasAdapter: false },

  // ---------------- Data Import ----------------
  { id: "csv-import", name: "CSV Import", nameAr: "استيراد CSV", category: "data-import", authMethod: "file-upload", description: "استيراد بيانات من ملف CSV", color: "#64748B", hasAdapter: true },
  { id: "excel-import", name: "Excel Import", nameAr: "استيراد Excel", category: "data-import", authMethod: "file-upload", description: "استيراد بيانات من ملف Excel", color: "#217346", hasAdapter: true },
  { id: "google-sheets", name: "Google Sheets", nameAr: "جداول جوجل", category: "data-import", authMethod: "oauth2", description: "استيراد ومزامنة من Google Sheets", color: "#0F9D58", hasAdapter: false },
];

export const categoryLabels: Record<ConnectorDefinition["category"], string> = {
  ecommerce: "التجارة الإلكترونية",
  pos: "أنظمة نقاط البيع",
  payments: "بوابات الدفع",
  accounting: "المحاسبة",
  banking: "الخدمات المصرفية",
  shipping: "الشحن والتوصيل",
  marketing: "التسويق والإعلانات",
  "data-import": "استيراد البيانات",
};

export function getConnector(id: string) {
  return connectorRegistry.find((c) => c.id === id);
}
