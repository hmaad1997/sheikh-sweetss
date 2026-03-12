import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, CheckCircle } from "lucide-react";

export default function CashierPage() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"revenue" | "expense">("revenue");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "click" | "visa" | "bank">("cash");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addTransaction = trpc.transactions.add.useMutation();
  const getByDate = trpc.transactions.getByDate.useQuery(new Date(date));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setIsSubmitting(true);
    try {
      await addTransaction.mutateAsync({
        date: new Date(date),
        description,
        type,
        paymentMethod,
        amount,
        notes,
      });

      toast.success("تم إضافة العملية بنجاح");
      setDescription("");
      setAmount("");
      setNotes("");
      setType("revenue");
      setPaymentMethod("cash");
    } catch (error) {
      toast.error("حدث خطأ أثناء إضافة العملية");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSubmit(e as any);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-orange-800 mb-2">حلويات الشيخ</h1>
          <p className="text-gray-600">نظام الكاشير السريع</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">التاريخ</label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">نوع العملية</label>
              <Select value={type} onValueChange={(v) => setType(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">إيراد</SelectItem>
                  <SelectItem value="expense">مصروف</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">البيان</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="أدخل وصف العملية"
              onKeyPress={handleKeyPress}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">طريقة الدفع</label>
              <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">كاش</SelectItem>
                  <SelectItem value="click">كليك</SelectItem>
                  <SelectItem value="visa">فيزا</SelectItem>
                  <SelectItem value="bank">بنك</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">المبلغ</label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                onKeyPress={handleKeyPress}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ملاحظات</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="أضف ملاحظات إضافية (اختياري)"
              rows={3}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 text-lg"
          >
            <Plus className="w-5 h-5 ml-2" />
            {isSubmitting ? "جاري الحفظ..." : "إضافة العملية (Enter)"}
          </Button>
        </form>

        {getByDate.data && getByDate.data.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">عمليات اليوم</h2>
            <div className="space-y-2">
              {getByDate.data.map((tx) => (
                <div key={tx.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium text-gray-800">{tx.description}</p>
                    <p className="text-sm text-gray-500">{tx.paymentMethod}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${tx.type === "revenue" ? "text-green-600" : "text-red-600"}`}>
                      {tx.type === "revenue" ? "+" : "-"} {tx.amount}
                    </span>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
