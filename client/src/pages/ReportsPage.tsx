import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ReportsPage() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());

  const { data: monthlyTransactions = [] } = trpc.transactions.getByMonth.useQuery({
    year: parseInt(selectedYear),
    month: parseInt(selectedMonth),
  });

  const { data: yearlyTransactions = [] } = trpc.transactions.getByYear.useQuery(parseInt(selectedYear));

  const calculateMonthlyStats = () => {
    const revenues = monthlyTransactions
      .filter((t) => t.type === "revenue")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const expenses = monthlyTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    return { revenues, expenses, net: revenues - expenses };
  };

  const calculateYearlyStats = () => {
    const months: Record<number, { revenues: number; expenses: number }> = {};
    for (let i = 1; i <= 12; i++) {
      months[i] = { revenues: 0, expenses: 0 };
    }

    yearlyTransactions.forEach((t) => {
      const month = new Date(t.date).getMonth() + 1;
      if (t.type === "revenue") {
        months[month].revenues += parseFloat(t.amount);
      } else {
        months[month].expenses += parseFloat(t.amount);
      }
    });

    return months;
  };

  const monthlyStats = calculateMonthlyStats();
  const yearlyStats = calculateYearlyStats();

  const monthNames = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-orange-800">التقارير المالية</h1>
        </div>

        <Tabs defaultValue="monthly" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="monthly">التقارير الشهرية</TabsTrigger>
            <TabsTrigger value="yearly">التقارير السنوية</TabsTrigger>
          </TabsList>

          <TabsContent value="monthly" className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">السنة</label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[2024, 2025, 2026].map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الشهر</label>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {monthNames.map((name, index) => (
                        <SelectItem key={index} value={(index + 1).toString()}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="bg-green-50">
                    <CardTitle className="text-green-800">الإيرادات</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-3xl font-bold text-green-600">{monthlyStats.revenues.toFixed(2)}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="bg-red-50">
                    <CardTitle className="text-red-800">المصاريف</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-3xl font-bold text-red-600">{monthlyStats.expenses.toFixed(2)}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="bg-blue-50">
                    <CardTitle className="text-blue-800">الصافي</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p
                      className={`text-3xl font-bold ${
                        monthlyStats.net >= 0 ? "text-blue-600" : "text-red-600"
                      }`}
                    >
                      {monthlyStats.net.toFixed(2)}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="yearly" className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">السنة</label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[2024, 2025, 2026].map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 text-right">الشهر</th>
                      <th className="p-3 text-right">الإيرادات</th>
                      <th className="p-3 text-right">المصاريف</th>
                      <th className="p-3 text-right">الصافي</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthNames.map((name, index) => {
                      const stats = yearlyStats[index + 1];
                      const net = stats.revenues - stats.expenses;
                      return (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-3">{name}</td>
                          <td className="p-3 text-green-600 font-bold">{stats.revenues.toFixed(2)}</td>
                          <td className="p-3 text-red-600 font-bold">{stats.expenses.toFixed(2)}</td>
                          <td className={`p-3 font-bold ${net >= 0 ? "text-blue-600" : "text-red-600"}`}>
                            {net.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
