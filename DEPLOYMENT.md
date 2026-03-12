# دليل النشر - نظام جرد حلويات الشيخ

## المتطلبات
- حساب GitHub
- حساب Vercel (مجاني)
- حساب Supabase (مجاني)

## خطوات النشر

### 1. إعداد قاعدة البيانات على Supabase

1. اذهب إلى [supabase.com](https://supabase.com)
2. أنشئ حساب جديد أو سجل دخول
3. أنشئ مشروع جديد:
   - اختر **PostgreSQL**
   - اختر المنطقة الأقرب لك
   - اكتب كلمة مرور قوية

4. بعد إنشاء المشروع:
   - اذهب إلى **Settings > Database**
   - انسخ **Connection String** (اختر URI)
   - احفظها في مكان آمن

5. قم بتشغيل migrations:
   ```bash
   DATABASE_URL="your_supabase_connection_string" pnpm db:push
   ```

### 2. إعداد OAuth (Manus)

1. اذهب إلى [manus.im](https://manus.im)
2. أنشئ تطبيق جديد
3. احصل على:
   - `MANUS_OAUTH_CLIENT_ID`
   - `MANUS_OAUTH_CLIENT_SECRET`

### 3. نشر على Vercel

1. اذهب إلى [vercel.com](https://vercel.com)
2. انقر على **New Project**
3. اختر مستودع GitHub الخاص بك
4. في **Environment Variables**، أضف:
   ```
   DATABASE_URL=your_supabase_connection_string
   MANUS_OAUTH_CLIENT_ID=your_client_id
   MANUS_OAUTH_CLIENT_SECRET=your_client_secret
   MANUS_OAUTH_REDIRECT_URL=https://your-vercel-app.vercel.app/auth/callback
   VITE_APP_TITLE=نظام جرد حلويات الشيخ
   ```

5. انقر على **Deploy**

### 4. تحديث OAuth Redirect URL

بعد النشر على Vercel:
1. انسخ الرابط الجديد (مثال: `https://sheikh-sweets.vercel.app`)
2. اذهب إلى إعدادات تطبيق Manus
3. حدّث `MANUS_OAUTH_REDIRECT_URL` إلى `https://your-domain/auth/callback`
4. حدّث نفس القيمة في متغيرات Vercel

## اختبار النظام

بعد النشر:
1. اذهب إلى الرابط الجديد
2. سجل دخول باستخدام Manus OAuth
3. اختبر إضافة عملية جديدة
4. تحقق من الجرد اليومي والتقارير

## استكشاف الأخطاء

إذا واجهت مشاكل:
1. تحقق من متغيرات البيئة في Vercel
2. تحقق من اتصال قاعدة البيانات
3. اعرض السجلات في Vercel Dashboard

## الصيانة

### النسخ الاحتياطية
Supabase توفر نسخ احتياطية تلقائية يومية مجاناً.

### التحديثات
لتحديث الكود:
1. أدخل التغييرات على GitHub
2. Vercel ستنشر تلقائياً

## الحدود المجانية

| الخدمة | الحد المجاني |
|--------|-----------|
| Vercel | 100 GB bandwidth/شهر |
| Supabase | 500 MB storage |
| OAuth Requests | غير محدود |

## الدعم

للمساعدة:
- Vercel Support: [vercel.com/support](https://vercel.com/support)
- Supabase Docs: [supabase.com/docs](https://supabase.com/docs)
