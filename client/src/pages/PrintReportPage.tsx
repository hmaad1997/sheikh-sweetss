import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Printer, Download } from "lucide-react";

export default function PrintReportPage() {
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

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    window.print();
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 no-print">
          <h1 className="text-3xl font-bold text-orange-800 mb-4">التقرير اليومي</h1>
          <div className="flex gap-4 mb-4">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-48"
            />
            <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700">
              <Printer className="w-4 h-4 ml-2" />
              طباعة
            </Button>
            <Button onClick={handleExportPDF} className="bg-green-600 hover:bg-green-700">
              <Download className="w-4 h-4 ml-2" />
              تصدير PDF
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 print:shadow-none print:p-0">
          <div className="text-center mb-8 pb-6 border-b-2 border-orange-300">
            <h1 className="text-4xl font-bold text-orange-800 mb-2">حلويات الشيخ</h1>
            <h2 className="text-2xl font-bold text-gray-800">تقرير الجرد اليومي</h2>
            <p className="text-gray-600 mt-2">{formatDate(selectedDate)}</p>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8 pb-6 border-b-2 border-gray-200">
            <div className="text-center">
              <p className="text-gray-600 mb-2">إجمالي الإيرادات</p>
              <p className="text-3xl font-bold text-green-600">{totalRevenue.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 mb-2">إجمالي المصاريف</p>
              <p className="text-3xl font-bold text-red-600">{totalExpense.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 mb-2">صافي اليوم</p>
              <p className={`text-3xl font-bold ${netDaily >= 0 ? "text-blue-600" : "text-red-600"}`}>
                {netDaily.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold text-orange-800 mb-4">الإيرادات حسب طريقة الدفع</h3>
            <table className="w-full mb-4">
              <tbody>
                <tr className="border-b">
                  <td className="p-2">كاش</td>
                  <td className="p-2 text-right font-bold">{revenuesByMethod.cash.toFixed(2)}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">كليك</td>
                  <td className="p-2 text-right font-bold">{revenuesByMethod.click.toFixed(2)}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">فيزا</td>
                  <td className="p-2 text-right font-bold">{revenuesByMethod.visa.toFixed(2)}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">بنك</td>
                  <td className="p-2 text-right font-bold">{revenuesByMethod.bank.toFixed(2)}</td>
                </tr>
                <tr className="bg-green-50">
                  <td className="p-2 font-bold">الإجمالي</td>
                  <td className="p-2 text-right font-bold text-green-600">{totalRevenue.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {expenses.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-red-800 mb-4">المصاريف</h3>
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-right">البيان</th>
                    <th className="p-2 text-right">المبلغ</th>
                    <th className="p-2 text-right">الملاحظات</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((exp) => (
                    <tr key={exp.id} className="border-b">
                      <td className="p-2">{exp.description}</td>
                      <td className="p-2 text-right font-bold">{exp.amount}</td>
                      <td className="p-2 text-right text-gray-600">{exp.notes || "-"}</td>
                    </tr>
                  ))}
                  <tr className="bg-red-50">
                    <td className="p-2 font-bold">الإجمالي</td>
                    <td className="p-2 text-right font-bold text-red-600">{totalExpense.toFixed(2)}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-8 pt-6 border-t-2 border-gray-200">
            <p className="text-gray-600 text-sm">تم إنشاء هذا التقرير بواسطة نظام جرد حلويات الشيخ</p>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body {
            background: white;
            padding: 0;
            margin: 0;
          }
          .no-print {
            display: none;
          }
          .print\\:shadow-none {
            box-shadow: none;
          }
          .print\\:p-0 {
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
}
