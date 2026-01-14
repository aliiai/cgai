/**
 * Localization Examples
 * 
 * أمثلة استخدام أدوات التوطين
 * 
 * هذا الملف للتوثيق فقط - لا يتم استيراده في الكود
 */

/* ============================================
   مثال 1: استخدام localizeField مباشرة
   ============================================ */

// import { localizeField } from './localization';
// 
// const name = localizeField(service.name, service.name_en);
// const description = localizeField(service.description, service.description_en);

/* ============================================
   مثال 2: استخدام localizeObject لتوطين كائن كامل
   ============================================ */

// import { localizeObject } from './localization';
// 
// // بعد جلب البيانات من API
// const localizedService = localizeObject(service, ['name', 'description']);
// 
// // الآن يمكن استخدام localizedService.name و localizedService.description مباشرة
// console.log(localizedService.name); // القيمة المترجمة حسب اللغة الحالية

/* ============================================
   مثال 3: استخدام useLocalized Hook داخل Component
   ============================================ */

// import { useLocalized } from '../hooks/useLocalized';
// 
// const ServiceCard = ({ service }: { service: Service }) => {
//   const localized = useLocalized(service, ['name', 'description']);
//   
//   return (
//     <div>
//       <h3>{localized.name}</h3>
//       <p>{localized.description}</p>
//     </div>
//   );
// };

/* ============================================
   مثال 4: استخدام useLocalizedName و useLocalizedDescription
   ============================================ */

// import { useLocalizedName, useLocalizedDescription } from '../hooks/useLocalized';
// 
// const ServiceCard = ({ service }: { service: Service }) => {
//   const name = useLocalizedName(service);
//   const description = useLocalizedDescription(service);
//   
//   return (
//     <div>
//       <h3>{name}</h3>
//       <p>{description}</p>
//     </div>
//   );
// };

/* ============================================
   مثال 5: توطين مصفوفة من الكائنات
   ============================================ */

// import { useLocalizedArray } from '../hooks/useLocalized';
// 
// const ServicesList = ({ services }: { services: Service[] }) => {
//   const localizedServices = useLocalizedArray(services, ['name', 'description']);
//   
//   return (
//     <div>
//       {localizedServices.map(service => (
//         <div key={service.id}>
//           <h3>{service.name}</h3>
//           <p>{service.description}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

/* ============================================
   مثال 6: استخدام في Mapping Layer بعد جلب البيانات
   ============================================ */

// import { localizeArray } from './localization';
// 
// // في API function
// export const getServices = async () => {
//   const response = await axios.get('/api/services');
//   const services = response.data.data;
//   
//   // توطين البيانات قبل إرجاعها
//   return localizeArray(services, ['name', 'description']);
// };

/* ============================================
   مثال 7: استخدام مع حقول مخصصة
   ============================================ */

// import { useLocalized } from '../hooks/useLocalized';
// 
// const ProductCard = ({ product }: { product: Product }) => {
//   // توطين حقول مخصصة
//   const localized = useLocalized(product, ['name', 'description', 'title', 'subtitle']);
//   
//   return (
//     <div>
//       <h3>{localized.name}</h3>
//       <p>{localized.description}</p>
//       <h4>{localized.title}</h4>
//       <p>{localized.subtitle}</p>
//     </div>
//   );
// };

/* ============================================
   مثال 8: استخدام مع خيارات مخصصة
   ============================================ */

// import { useLocalizedField } from '../hooks/useLocalized';
// 
// const CustomField = ({ item }: { item: any }) => {
//   const value = useLocalizedField(
//     item.custom_field_ar,
//     item.custom_field_en,
//     {
//       fallbackLanguage: 'en',
//       defaultValue: 'لا توجد قيمة'
//     }
//   );
//   
//   return <span>{value}</span>;
// };

