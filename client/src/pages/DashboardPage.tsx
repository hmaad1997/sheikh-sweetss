import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";

export default function DashboardPage() {
  const { data: allTransactions = [] } = trpc.transactions.getAll.useQuery();

  const totalRevenue = allTransactions
    .filter((t) => t.type === "revenue")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpense = allTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const netProfit = totalRevenue - totalExpense;

  const chartData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const dateStr = date.toISOString().split("T")[0];

    const dayTransactions = allTransactions.filter((t) => {
      const txDate = new Date(t.date).toISOString().split("T")[0];
      return txDate === dateStr;
    });

    const revenue = dayTransactions
      .filter((t) => t.type === "revenue")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const expense = dayTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    return {
      date: date.toLocaleDateString("ar-SA", { month: "short", day: "numeric" }),
      revenue: Math.round(revenue),
      expense: Math.round(expense),
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-orange-800">لوحة التحكم</h1>
          <p className="text-gray-600 mt-2">حلويات الشيخ - نظام الإدارة المالية</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="bg-green-50">
              <CardTitle className="text-green-800">إجمالي الإيرادات</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-4xl font-bold text-green-600">{totalRevenue.toFixed(2)}</p>
              <p className="text-sm text-gray-500 mt-2">من جميع المصادر</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-red-50">
              <CardTitle className="text-red-800">إجمالي المصاريف</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-4xl font-bold text-red-600">{totalExpense.toFixed(2)}</p>
              <p className="text-sm text-gray-500 mt-2">جميع النفقات</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-blue-800">صافي الربح</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className={`text-4xl font-bold ${netProfit >= 0 ? "text-blue-600" : "text-red-600"}`}>
                {netProfit.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 mt-2">الإيرادات - المصاريف</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader className="bg-gray-50">
            <CardTitle>رسم بياني للمبيعات (آخر 30 يوم)</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#10b981" name="الإيرادات" />
                <Bar dataKey="expense" fill="#ef4444" name="المصاريف" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-gray-50">
            <CardTitle>الاتجاه العام (آخر 30 يوم)</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" name="الإيرادات" />
                <Line type="monotone" dataKey="expense" stroke="#ef4444" name="المصاريف" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
