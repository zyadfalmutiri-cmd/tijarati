import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return {
    // كل صفحات الداشبورد محمية بتسجيل دخول أصلًا (middleware)، فما فيه فايدة
    // من فهرستها. المحتوى العام الوحيد حاليًا هو /login و /signup.
    rules: [{ userAgent: "*", allow: ["/login", "/signup"], disallow: ["/api/", "/"] }],
    sitemap: `${base}/sitemap.xml`,
  };
}
