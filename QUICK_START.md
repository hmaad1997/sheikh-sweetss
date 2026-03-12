# نظام جرد حلويات الشيخ - دليل البدء السريع

## 🔐 بيانات الدخول الأساسية

**حساب المالك:**
- البريد الإلكتروني: `morehackk@gmail.com`
- كلمة المرور: `admino`

## 🚀 خطوات النشر على Vercel

### المتطلبات:
- حساب GitHub
- حساب Vercel (مجاني)
- حساب Supabase (مجاني)

### الخطوة 1: إعداد Supabase

1. اذهب إلى [supabase.com](https://supabase.com)
2. سجل دخول أو أنشئ حساب جديد
3. انقر **New Project**
4. أدخل:
   - اسم المشروع: `sheikh-sweets`
   - كلمة مرور قوية
   - المنطقة: Singapore أو Europe
5. انقر **Create new project**
6. انتظر إنشاء المشروع (2-3 دقائق)

### الخطوة 2: الحصول على Connection String

1. اذهب إلى **Settings > Database**
2. ابحث عن **Connection string**
3. اختر **URI** (ليس PSQL)
4. انسخ الرابط كاملاً (سيبدأ بـ `postgresql://`)
5. احفظه في مكان آمن

### الخطوة 3: تشغيل Migrations

في جهازك المحلي:

```bash
cd /home/ubuntu/sheikh_sweets_accounting
DATABASE_URL="your_supabase_connection_string" pnpm db:push
```

### الخطوة 4: دفع الكود إلى GitHub

```bash
cd /home/ubuntu/sheikh_sweets_accounting

# إنشاء مستودع جديد على GitHub أولاً من خلال موقع GitHub
# ثم:

git remote add origin https://github.com/YOUR_USERNAME/sheikh-sweets.git
git branch -M main
git push -u origin main
```

### الخطوة 5: النشر على Vercel

1. اذهب إلى [vercel.com](https://vercel.com)
2. سجل دخول بـ GitHub
3. انقر **New Project**
4. اختر **Import Git Repository**
5. ابحث عن `sheikh-sweets`
6. انقر **Import**

### الخطوة 6: إضافة متغيرات البيئة

في صفحة **Environment Variables**، أضف:

```
DATABASE_URL = your_supabase_connection_string
VITE_APP_TITLE = نظام جرد حلويات الشيخ
NODE_ENV = production
```

### الخطوة 7: النشر

1. انقر **Deploy**
2. انتظر انتهاء النشر (2-3 دقائق)
3. ستحصل على رابط مثل: `https://sheikh-sweets.vercel.app`

---

## 📝 الاستخدام الأول

1. اذهب إلى الرابط الذي حصلت عليه
2. سجل دخول بـ:
   - البريد: `morehackk@gmail.com`
   - الباسورد: `admino`
3. ابدأ باستخدام النظام!

---

## 👥 إضافة موظفين

من لوحة التحكم:

1. اذهب إلى **إدارة المستخدمين**
2. أضف موظف جديد:
   - البريد الإلكتروني
   - كلمة مرور (تحددها أنت)
   - الدور (موظف/مدير)
3. الموظف يدخل بـ البريد والباسورد

---

## 🆘 استكشاف الأخطاء

### المشكلة: "Database Connection Error"

**الحل:**
1. تحقق من `DATABASE_URL` في Vercel
2. تأكد من نسخ الرابط بشكل صحيح
3. جرب إعادة النشر

### المشكلة: "لا يمكن الدخول"

**الحل:**
1. تأكد من البريد والباسورد
2. تأكد من أن الحساب نشط
3. جرب مسح الـ cookies والدخول مرة أخرى

---

## 📞 الدعم

للمساعدة:
- اقرأ `README.md` للمزيد من المعلومات
- اقرأ `DEPLOY_TO_VERCEL.md` لتفاصيل النشر
- اقرأ `ACCESS_CONTROL.md` لشرح الأدوار والصلاحيات

---

**تم إنشاء هذا النظام بعناية واحترافية!** ✨
