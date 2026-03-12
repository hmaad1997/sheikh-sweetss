import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function CashBalancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const { data: transactions = [] } = trpc.transactions.getByDate.useQuery(new Date(selectedDate));

  const cashTransactions = transactions.filter((t) => t.paymentMethod === "cash");
  const cashRevenue = cashTransactions
    .filter((t) => t.type === "revenue")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const cashExpense = cashTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const previousBalance = 0;
  const netCash = cashRevenue - cashExpense;
  const cumulativeCash = previousBalance + netCash;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-orange-800 mb-4">جرد الكاش</h1>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-48"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="bg-gray-50">
              <CardTitle>الرصيد السابق</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-3xl font-bold text-gray-800">{previousBalance.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-green-50">
              <CardTitle className="text-green-800">كاش اليوم (إيراد)</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-3xl font-bold text-green-600">{cashRevenue.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-red-50">
              <CardTitle className="text-red-800">مصروف الكاش</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-3xl font-bold text-red-600">{cashExpense.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-blue-800">صافي الكاش</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className={`text-3xl font-bold ${netCash >= 0 ? "text-blue-600" : "text-red-600"}`}>
                {netCash.toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader className="bg-orange-50">
              <CardTitle className="text-orange-800">الكاش التراكمي</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className={`text-4xl font-bold ${cumulativeCash >= 0 ? "text-orange-600" : "text-red-600"}`}>
                {cumulativeCash.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader className="bg-gray-50">
            <CardTitle>تفاصيل عمليات الكاش</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-right">البيان</th>
                    <th className="p-2 text-right">النوع</th>
                    <th className="p-2 text-right">المبلغ</th>
                    <th className="p-2 text-right">الملاحظات</th>
                  </tr>
                </thead>
                <tbody>
                  {cashTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{tx.description}</td>
                      <td className="p-2">
                        <span className={tx.type === "revenue" ? "text-green-600" : "text-red-600"}>
                          {tx.type === "revenue" ? "إيراد" : "مصروف"}
                        </span>
                      </td>
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
