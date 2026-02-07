# 🌤️ تطبيق الطقس - Weather App

تطبيق ويب احترافي لعرض حالة الطقس بتصميم **Glassmorphism** عصري.

## ✨ المميزات

- 🎨 تصميم Glassmorphism حديث
- 📱 تصميم متجاوب (Mobile First)
- ♿ دعم إمكانية الوصول (Accessibility)
- 🔍 بحث سريع عن أي مدينة
- 💾 حفظ البحث الأخير
- 🔒 حماية مفتاح API عبر Serverless
- ⚡ أداء عالي بدون frameworks

## 🚀 التشغيل

### محلياً (للتطوير)

```bash
# تثبيت Vercel CLI
npm i -g vercel

# تشغيل محلي
vercel dev
```

### النشر على Vercel

```bash
# تسجيل الدخول
vercel login

# النشر
vercel --prod
```

## ⚙️ إعداد API Key

1. احصل على مفتاح من [OpenWeatherMap](https://openweathermap.org/api)
2. في Vercel Dashboard → Settings → Environment Variables
3. أضف: `OPENWEATHER_API_KEY` = مفتاحك

## 📁 هيكل المشروع

```
weather-app/
├── index.html          # الصفحة الرئيسية
├── api/weather.js      # Serverless Function
├── css/                # ملفات التصميم
├── js/                 # ملفات JavaScript
└── assets/             # الأصول (أيقونات)
```

## 🛠️ التقنيات

- HTML5 Semantic
- CSS3 (Variables, Flexbox, Grid)
- Vanilla JavaScript ES6+
- Vercel Serverless Functions
- OpenWeatherMap API

---

صُنع بـ ❤️
