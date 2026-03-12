import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

export default function AdminUsersPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"owner" | "manager" | "employee">("employee");

  const { data: users = [], refetch } = trpc.accessControl.getAllAuthorizedUsers.useQuery();
  const { data: currentUser } = trpc.accessControl.getAuthorizedUser.useQuery();
  const addUser = trpc.accessControl.addAuthorizedUser.useMutation();
  const { data: accessLogs = [] } = trpc.accessControl.getAccessLogs.useQuery(50);

  const handleAddUser = async () => {
    if (!email || !name) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }

    try {
      await addUser.mutateAsync({ email, name, role });
      toast.success("تم إضافة المستخدم بنجاح");
      setEmail("");
      setName("");
      setRole("employee");
      refetch();
    } catch (error) {
      toast.error("خطأ في إضافة المستخدم");
    }
  };

  if (currentUser?.role !== "owner") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <p className="text-red-600 font-bold">لا توجد صلاحيات لعرض هذه الصفحة</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-orange-800">إدارة المستخدمين</h1>
          <p className="text-gray-600 mt-2">التحكم بالمستخدمين المسموح لهم بالوصول</p>
        </div>

        <Card className="mb-6">
          <CardHeader className="bg-orange-50">
            <CardTitle>إضافة مستخدم جديد</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الاسم</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="اسم المستخدم"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الدور</label>
                <Select value={role} onValueChange={(v) => setRole(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">موظف</SelectItem>
                    <SelectItem value="manager">مدير</SelectItem>
                    <SelectItem value="owner">مالك</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={handleAddUser} className="w-full bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader className="bg-gray-50">
            <CardTitle>المستخدمون المسموح لهم</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-right">البريد الإلكتروني</th>
                    <th className="p-3 text-right">الاسم</th>
                    <th className="p-3 text-right">الدور</th>
                    <th className="p-3 text-right">الحالة</th>
                    <th className="p-3 text-right">تاريخ الإضافة</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">{user.name}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          user.role === "owner" ? "bg-red-100 text-red-800" :
                          user.role === "manager" ? "bg-blue-100 text-blue-800" :
                          "bg-green-100 text-green-800"
                        }`}>
                          {user.role === "owner" ? "مالك" : user.role === "manager" ? "مدير" : "موظف"}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {user.isActive ? "نشط" : "معطل"}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString("ar-SA")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-gray-50">
            <CardTitle>سجل محاولات الوصول</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-right">البريد الإلكتروني</th>
                    <th className="p-3 text-right">الحالة</th>
                    <th className="p-3 text-right">السبب</th>
                    <th className="p-3 text-right">عنوان IP</th>
                    <th className="p-3 text-right">التاريخ والوقت</th>
                  </tr>
                </thead>
                <tbody>
                  {accessLogs.map((log) => (
                    <tr key={log.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{log.email}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          log.status === "allowed" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {log.status === "allowed" ? "مسموح" : "مرفوض"}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600">{log.reason || "-"}</td>
                      <td className="p-3 text-gray-600">{log.ipAddress || "-"}</td>
                      <td className="p-3 text-gray-600">
                        {new Date(log.createdAt).toLocaleString("ar-SA")}
                      </td>
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
