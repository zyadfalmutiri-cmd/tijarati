export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-primary">تجارتي</h1>
          <p className="text-sm text-muted-foreground mt-1">منصة تحليلات الأعمال المجانية</p>
        </div>
        {children}
      </div>
    </div>
  );
}
