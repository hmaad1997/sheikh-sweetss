import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <Lock className="w-16 h-16 text-red-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">وصول مرفوض</h1>
        <p className="text-xl text-gray-600 mb-8">
          عذراً، ليس لديك صلاحية للوصول إلى هذا النظام
        </p>
        <p className="text-gray-500 mb-8">
          يرجى التواصل مع المالك لطلب الوصول
        </p>
        <Button
          onClick={() => window.location.href = "/"}
          className="bg-orange-600 hover:bg-orange-700"
        >
          العودة إلى الصفحة الرئيسية
        </Button>
      </div>
    </div>
  );
}
