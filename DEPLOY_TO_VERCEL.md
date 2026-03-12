# دليل النشر على Vercel - نظام جرد حلويات الشيخ

## المتطلبات الأساسية

1. **حساب GitHub** - لتخزين الكود
2. **حساب Vercel** - للنشر (مجاني)
3. **حساب Supabase** - لقاعدة البيانات (مجاني)
4. **حساب Manus** - للمصادقة (مجاني)

---

## الخطوة 1: إعداد Supabase (قاعدة البيانات)

### 1.1 إنشاء حساب Supabase

1. اذهب إلى [supabase.com](https://supabase.com)
2. انقر على **Sign Up**
3. اختر **Sign up with GitHub** (أسهل)
4. وافق على الصلاحيات

### 1.2 إنشاء مشروع جديد

1. انقر على **New Project**
2. أدخل اسم المشروع: `sheikh-sweets-accounting`
3. اختر كلمة مرور قوية
4. اختر المنطقة الأقرب: **Singapore** أو **Europe**
5. انقر **Create new project**

### 1.3 الحصول على Connection String

1. اذهب إلى **Settings > Database**
2. ابحث عن **Connection string**
3. اختر **URI** (ليس PSQL)
4. انسخ الرابط كاملاً (سيبدأ بـ `postgresql://`)
5. احفظه في مكان آمن

### 1.4 تشغيل Migrations

في جهازك المحلي:

```bash
cd /home/ubuntu/sheikh_sweets_accounting
DATABASE_URL="your_supabase_connection_string" pnpm db:push
```

---

## الخطوة 2: إعداد Manus OAuth

### 2.1 إنشاء تطبيق Manus

1. اذهب إلى [manus.im](https://manus.im)
2. سجل دخول أو أنشئ حساب
3. اذهب إلى **Developer Dashboard**
4. انقر **Create New App**
5. أدخل اسم التطبيق: `Sheikh Sweets Accounting`
6. أدخل الوصف: `نظام إدارة مالية لمحل حلويات`
7. انقر **Create**

### 2.2 الحصول على بيانات OAuth

بعد إنشاء التطبيق، ستحصل على:
- `MANUS_OAUTH_CLIENT_ID`
- `MANUS_OAUTH_CLIENT_SECRET`

احفظهما في مكان آمن.

---

## الخطوة 3: نشر على Vercel

### 3.1 دفع الكود إلى GitHub

```bash
cd /home/ubuntu/sheikh_sweets_accounting
git remote add origin https://github.com/YOUR_USERNAME/sheikh-sweets-accounting.git
git branch -M main
git push -u origin main
```

### 3.2 إنشاء مشروع على Vercel

1. اذهب إلى [vercel.com](https://vercel.com)
2. انقر **New Project**
3. اختر **Import Git Repository**
4. ابحث عن `sheikh-sweets-accounting`
5. انقر **Import**

### 3.3 إضافة متغيرات البيئة

في صفحة **Environment Variables**، أضف:

```
DATABASE_URL = your_supabase_connection_string
MANUS_OAUTH_CLIENT_ID = your_client_id
MANUS_OAUTH_CLIENT_SECRET = your_client_secret
MANUS_OAUTH_REDIRECT_URL = https://your-project.vercel.app/auth/callback
VITE_APP_TITLE = نظام جرد حلويات الشيخ
NODE_ENV = production
```

### 3.4 النشر

1. انقر **Deploy**
2. انتظر انتهاء النشر (عادة 2-3 دقائق)
3. ستحصل على رابط مثل: `https://sheikh-sweets-accounting.vercel.app`

---

## الخطوة 4: تحديث Manus OAuth

### 4.1 تحديث Redirect URL

1. اذهب إلى تطبيق Manus الذي أنشأته
2. اذهب إلى **Settings**
3. حدّث **Redirect URL** إلى:
   ```
   https://your-project.vercel.app/auth/callback
   ```
4. احفظ التغييرات

### 4.2 تحديث Vercel

1. اذهب إلى مشروع Vercel
2. اذهب إلى **Settings > Environment Variables**
3. حدّث `MANUS_OAUTH_REDIRECT_URL` بالرابط الجديد
4. انقر **Deploy** مرة أخرى

---

## الخطوة 5: الإعداد الأولي

### 5.1 الدخول للمرة الأولى

1. اذهب إلى رابط التطبيق
2. انقر **تسجيل الدخول**
3. استخدم حسابك على Manus
4. ستتم إضافتك تلقائياً كمستخدم

### 5.2 إضافة نفسك كمالك

1. اذهب إلى `/admin/users`
2. أضف حسابك:
   - البريد الإلكتروني: بريدك
   - الاسم: اسمك
   - الدور: **مالك (Owner)**
3. انقر **إضافة**

### 5.3 إضافة مستخدمين آخرين

من نفس الصفحة، أضف أي موظفين أو مديرين تريدهم.

---

## اختبار النظام

### اختبر الميزات التالية:

✅ **تسجيل الدخول:** تأكد من أنك تستطيع الدخول

✅ **إضافة عملية:** أضف عملية إيراد واحدة

✅ **الجرد اليومي:** تحقق من ظهور العملية

✅ **التقارير:** اعرض التقارير الشهرية والسنوية

✅ **إدارة المستخدمين:** أضف مستخدم جديد واختبر وصوله

---

## استكشاف الأخطاء الشائعة

### المشكلة: "Database Connection Error"

**الحل:**
1. تحقق من `DATABASE_URL` في Vercel
2. تأكد من أن Supabase مشروع نشط
3. جرب إعادة النشر

### المشكلة: "OAuth Error"

**الحل:**
1. تحقق من `MANUS_OAUTH_CLIENT_ID` و `MANUS_OAUTH_CLIENT_SECRET`
2. تأكد من أن `MANUS_OAUTH_REDIRECT_URL` صحيح
3. تأكد من تطابقه مع إعدادات Manus

### المشكلة: "Wصول مرفوض" عند الدخول

**الحل:**
1. تأكد من إضافة بريدك في `/admin/users`
2. تأكد من أن الحساب نشط (Active)

---

## الصيانة المستمرة

### النسخ الاحتياطية

Supabase توفر نسخ احتياطية يومية تلقائية مجاناً.

### التحديثات

لتحديث الكود:

```bash
cd /home/ubuntu/sheikh_sweets_accounting
# أدخل التغييرات
git add .
git commit -m "وصف التغييرات"
git push origin main
```

Vercel ستنشر تلقائياً.

### المراقبة

في Vercel Dashboard:
- اعرض السجلات: **Deployments > Logs**
- اعرض الأخطاء: **Functions > Logs**

---

## الحدود المجانية

| الخدمة | الحد المجاني |
|--------|-----------|
| Vercel | 100 GB bandwidth/شهر |
| Supabase Storage | 500 MB |
| Supabase Database | 500 MB |
| Supabase Connections | 10 |
| Manus OAuth | غير محدود |

---

## الدعم والمساعدة

- **Vercel Support:** [vercel.com/support](https://vercel.com/support)
- **Supabase Docs:** [supabase.com/docs](https://supabase.com/docs)
- **Manus Docs:** [manus.im/docs](https://manus.im/docs)

---

## ملاحظات أمنية مهمة

🔒 **لا تشارك:**
- `MANUS_OAUTH_CLIENT_SECRET`
- `DATABASE_URL`
- أي متغيرات بيئية حساسة

🔒 **استخدم:**
- متغيرات البيئة في Vercel (ليس في الكود)
- HTTPS فقط (Vercel توفره افتراضياً)
- كلمات مرور قوية

---

## الخطوات التالية

بعد النشر بنجاح:

1. ✅ أضف مستخدمين آخرين
2. ✅ اختبر جميع الميزات
3. ✅ راقب سجلات الوصول
4. ✅ قم بعمل نسخة احتياطية من البيانات بانتظام

**تهانينا! النظام الآن جاهز للاستخدام الفعلي!** 🎉
