# نظام التوطين للبيانات الديناميكية

## نظرة عامة

نظام معماري نظيف وقابل للتوسع لتوطين البيانات الديناميكية القادمة من الـ Backend في منصة React + TypeScript.

## البنية المعمارية

```
src/
├── types/
│   └── localization.ts          # Types المشتركة
├── utils/
│   └── localization.ts           # الدوال الأساسية للتوطين
├── hooks/
│   └── useLocalized.ts           # React Hooks للتوطين
└── utils/
    └── localization.examples.ts  # أمثلة الاستخدام
```

## الملفات الرئيسية

### 1. `types/localization.ts`
يحتوي على Types المشتركة:
- `Localizable`: واجهة للكائنات القابلة للترجمة
- `LocalizationOptions`: خيارات التوطين
- `LocalizedResult`: نتيجة التوطين مع معلومات إضافية

### 2. `utils/localization.ts`
الدوال الأساسية:
- `getCurrentLanguage()`: الحصول على اللغة الحالية من i18n
- `localizeField(ar, en, options)`: توطين حقل واحد
- `localizeObject(item, fields[], options)`: توطين كائن كامل
- `getLocalizedName(item, options)`: الحصول على اسم محلي
- `getLocalizedDescription(item, options)`: الحصول على وصف محلي
- `localizeArray(items[], fields[], options)`: توطين مصفوفة

### 3. `hooks/useLocalized.ts`
React Hooks:
- `useLocalizedField(ar, en, options)`: Hook لتوطين حقل واحد
- `useLocalized(item, fields[], options)`: Hook لتوطين كائن كامل
- `useLocalizedName(item, options)`: Hook للحصول على اسم محلي
- `useLocalizedDescription(item, options)`: Hook للحصول على وصف محلي
- `useLocalizedArray(items[], fields[], options)`: Hook لتوطين مصفوفة
- `useLanguage()`: Hook للحصول على اللغة الحالية

## أمثلة الاستخدام

### مثال 1: استخدام Hook داخل Component

```tsx
import { useLocalized } from '../../hooks/useLocalized';

const ServiceCard = ({ service }: { service: Service }) => {
  const localized = useLocalized(service, ['name', 'description']);
  
  return (
    <div>
      <h3>{localized.name}</h3>
      <p>{localized.description}</p>
    </div>
  );
};
```

### مثال 2: استخدام Helper Functions

```tsx
import { useLocalizedName, useLocalizedDescription } from '../../hooks/useLocalized';

const ServiceCard = ({ service }: { service: Service }) => {
  const name = useLocalizedName(service);
  const description = useLocalizedDescription(service);
  
  return (
    <div>
      <h3>{name}</h3>
      <p>{description}</p>
    </div>
  );
};
```

### مثال 3: توطين مصفوفة

```tsx
import { useLocalizedArray } from '../../hooks/useLocalized';

const ServicesList = ({ services }: { services: Service[] }) => {
  const localizedServices = useLocalizedArray(services, ['name', 'description']);
  
  return (
    <div>
      {localizedServices.map(service => (
        <div key={service.id}>
          <h3>{service.name}</h3>
          <p>{service.description}</p>
        </div>
      ))}
    </div>
  );
};
```

### مثال 4: استخدام في Mapping Layer

```tsx
import { localizeArray } from '../utils/localization';

export const getServices = async () => {
  const response = await axios.get('/api/services');
  const services = response.data.data;
  
  // توطين البيانات قبل إرجاعها
  return localizeArray(services, ['name', 'description']);
};
```

### مثال 5: استخدام مع حقول مخصصة

```tsx
import { useLocalized } from '../../hooks/useLocalized';

const ProductCard = ({ product }: { product: Product }) => {
  // توطين حقول مخصصة
  const localized = useLocalized(product, ['name', 'description', 'title', 'subtitle']);
  
  return (
    <div>
      <h3>{localized.name}</h3>
      <p>{localized.description}</p>
      <h4>{localized.title}</h4>
      <p>{localized.subtitle}</p>
    </div>
  );
};
```

## المميزات

✅ **نظيف ومعماري**: لا توجد شروط لغوية داخل Components  
✅ **قابل لإعادة الاستخدام**: يعمل مع أي كيان قادم من الـ API  
✅ **Type-Safe**: الالتزام الكامل بأفضل ممارسات TypeScript  
✅ **تحديث تلقائي**: يعيد التصيير تلقائياً عند تغيير اللغة  
✅ **Fallback آمن**: يتعامل مع القيم null و undefined بشكل آمن  
✅ **قابل للتوسع**: سهل إضافة لغات جديدة في المستقبل  

## القواعد

❌ **ممنوع**: وضع البيانات الديناميكية داخل ملفات i18n JSON  
❌ **ممنوع**: استخدام شروط مثل `i18n.language === 'en'` داخل Components  
❌ **ممنوع**: تعديل شكل الـ API القادم من الـ Backend  

## التوافق

- ✅ React 18+
- ✅ TypeScript 5+
- ✅ react-i18next
- ✅ جميع المتصفحات الحديثة

## الدعم المستقبلي

النظام مصمم لدعم لغات إضافية بسهولة. عند إضافة لغة جديدة:
1. تحديث `getCurrentLanguage()` لدعم اللغة الجديدة
2. تحديث `localizeField()` لدعم الحقول الجديدة (مثل `name_fr` للفرنسية)
3. تحديث Types في `localization.ts` إذا لزم الأمر

