import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useAuth } from "./_core/hooks/useAuth";
import { getLoginUrl } from "./const";
import CashierPage from "./pages/CashierPage";
import DashboardPage from "./pages/DashboardPage";
import DailyInventoryPage from "./pages/DailyInventoryPage";
import CashBalancePage from "./pages/CashBalancePage";
import ReportsPage from "./pages/ReportsPage";
import PrintReportPage from "./pages/PrintReportPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AccessDeniedPage from "./pages/AccessDeniedPage";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, Users } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { data: authorizedUser } = trpc.accessControl.getAuthorizedUser.useQuery();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: "لوحة التحكم", path: "/" },
    { label: "الكاشير", path: "/cashier" },
    { label: "الجرد اليومي", path: "/daily-inventory" },
    { label: "جرد الكاش", path: "/cash-balance" },
    { label: "التقارير", path: "/reports" },
    { label: "التقرير المطبوع", path: "/print-report" },
    ...(authorizedUser?.role === "owner" ? [{ label: "إدارة المستخدمين", path: "/admin/users" }] : []),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-orange-800">حلويات الشيخ</h1>
            </div>

            <div className="hidden md:flex gap-6">
              {navItems.map((item) => (
                <a
                  key={item.path}
                  href={item.path}
                  className="text-gray-700 hover:text-orange-600 font-medium transition"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-4">
              {user && (
                <div className="text-sm">
                  <p className="text-gray-800 font-medium">{user.name}</p>
                  <p className="text-gray-500 text-xs">
                    {authorizedUser?.role === "owner" ? "مالك" : authorizedUser?.role === "manager" ? "مدير" : "موظف"}
                  </p>
                </div>
              )}
              {authorizedUser?.role === "owner" && (
                <a href="/admin/users">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Users className="w-4 h-4" />
                    الإدارة
                  </Button>
                </a>
              )}
              <Button
                onClick={() => logout()}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                خروج
              </Button>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>

          {menuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.path}
                  href={item.path}
                  className="block text-gray-700 hover:text-orange-600 font-medium py-2"
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </nav>

      <main>{children}</main>
    </div>
  );
}

function Router() {
  const { user, loading } = useAuth();
  const { data: hasAccess, isLoading: checkingAccess } = trpc.accessControl.checkAccess.useQuery(
    undefined,
    { enabled: !!user }
  );

  if (loading || checkingAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-orange-800 mb-4">حلويات الشيخ</h1>
          <p className="text-gray-600 mb-6">نظام إدارة مالية متكامل</p>
          <a href={getLoginUrl()}>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg">
              تسجيل الدخول
            </Button>
          </a>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return <AccessDeniedPage />;
  }

  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={DashboardPage} />
        <Route path="/cashier" component={CashierPage} />
        <Route path="/daily-inventory" component={DailyInventoryPage} />
        <Route path="/cash-balance" component={CashBalancePage} />
        <Route path="/reports" component={ReportsPage} />
        <Route path="/print-report" component={PrintReportPage} />
        <Route path="/admin/users" component={AdminUsersPage} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
