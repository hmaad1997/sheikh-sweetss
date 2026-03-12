import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Printer, Download } from "lucide-react";

export default function DailyInventoryPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const { data: transactions = [] } = trpc.transactions.getByDate.useQuery(new Date(selectedDate));

  const revenues = transactions.filter((t) => t.type === "revenue");
  const expenses = transactions.filter((t) => t.type === "expense");

  const revenuesByMethod = {
    cash: revenues.filter((t) => t.paymentMethod === "cash").reduce((sum, t) => sum + parseFloat(t.amount), 0),
    click: revenues.filter((t) => t.paymentMethod === "click").reduce((sum, t) => sum + parseFloat(t.amount), 0),
    visa: revenues.filter((t) => t.paymentMethod === "visa").reduce((sum, t) => sum + parseFloat(t.amount), 0),
    bank: revenues.filter((t) => t.paymentMethod === "bank").reduce((sum, t) => sum + parseFloat(t.amount), 0),
  };

  const totalRevenue = Object.values(revenuesByMethod).reduce((a, b) => a + b, 0);
  const totalExpense = expenses.reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const netDaily = totalRevenue - totalExpense;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-orange-800 mb-4">الجرد اليومي</h1>
          <div className="flex gap-4">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-48"
            />
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Printer className="w-4 h-4 ml-2" />
              طباعة
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              <Download className="w-4 h-4 ml-2" />
              تصدير PDF
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="bg-green-50">
              <CardTitle className="text-green-800">إجمالي الإيرادات</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-3xl font-bold text-green-600">{totalRevenue.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-red-50">
              <CardTitle className="text-red-800">إجمالي المصاريف</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-3xl font-bold text-red-600">{totalExpense.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-blue-800">صافي اليوم</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className={`text-3xl font-bold ${netDaily >= 0 ? "text-blue-600" : "text-red-600"}`}>
                {netDaily.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="bg-orange-50">
              <CardTitle className="text-orange-800">الإيرادات حسب طريقة الدفع</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="flex justify-between">
                <span>كاش:</span>
                <span className="font-bold">{revenuesByMethod.cash.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>كليك:</span>
                <span className="font-bold">{revenuesByMethod.click.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>فيزا:</span>
                <span className="font-bold">{revenuesByMethod.visa.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>بنك:</span>
                <span className="font-bold">{revenuesByMethod.bank.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-red-50">
              <CardTitle className="text-red-800">المصاريف</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {expenses.length > 0 ? (
                <div className="space-y-2">
                  {expenses.map((exp) => (
                    <div key={exp.id} className="flex justify-between text-sm">
                      <span>{exp.description}</span>
                      <span className="font-bold">{exp.amount}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">لا توجد مصاريف اليوم</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader className="bg-gray-50">
            <CardTitle>جميع العمليات</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-right">البيان</th>
                    <th className="p-2 text-right">النوع</th>
                    <th className="p-2 text-right">الطريقة</th>
                    <th className="p-2 text-right">المبلغ</th>
                    <th className="p-2 text-right">الملاحظات</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{tx.description}</td>
                      <td className="p-2">
                        <span className={tx.type === "revenue" ? "text-green-600" : "text-red-600"}>
                          {tx.type === "revenue" ? "إيراد" : "مصروف"}
                        </span>
                      </td>
                      <td className="p-2">{tx.paymentMethod}</td>
                      <td className="p-2 font-bold">{tx.amount}</td>
                      <td className="p-2 text-gray-600">{tx.notes || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
