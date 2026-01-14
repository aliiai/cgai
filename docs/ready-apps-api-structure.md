# 📋 هيكل بيانات التطبيقات الجاهزة (Ready Apps API Structure)

## 📌 نظرة عامة
هذا المستند يوضح شكل البيانات المتوقع استقبالها من الـ Backend لقسم التطبيقات والأنظمة الجاهزة.

---

## 🔗 Endpoints المتوقعة

### 1. جلب قائمة التطبيقات
**GET** `/api/customer/ready-apps`

**Query Parameters:**
- `category` (optional): فلترة حسب الفئة
- `search` (optional): البحث في الأسماء والأوصاف
- `page` (optional): رقم الصفحة
- `per_page` (optional): عدد العناصر في الصفحة

**Response Structure:**
```json
{
  "success": true,
  "data": {
    "apps": [
      {
        "id": 1,
        "name": "نظام إدارة المطاعم المتكامل",
        "name_en": "Restaurant Management System",
        "description": "نظام شامل لإدارة المطاعم...",
        "description_en": "Comprehensive restaurant management system...",
        "short_description": "نظام شامل لإدارة المطاعم بكامل تفاصيلها",
        "short_description_en": "Complete restaurant management solution",
        "price": 15000.00,
        "original_price": 20000.00,
        "currency": "SAR",
        "category": {
          "id": 1,
          "name": "أنظمة المطاعم",
          "name_en": "Restaurant Systems",
          "slug": "restaurant-systems"
        },
        "images": [
          {
            "id": 1,
            "url": "https://example.com/images/app-1-main.jpg",
            "type": "main",
            "order": 1
          },
          {
            "id": 2,
            "url": "https://example.com/images/app-1-2.jpg",
            "type": "gallery",
            "order": 2
          }
        ],
        "main_image": "https://example.com/images/app-1-main.jpg",
        "video_url": "https://www.youtube.com/embed/xxxxx",
        "features": [
          {
            "id": 1,
            "title": "إدارة الطلبات الكاملة",
            "title_en": "Complete Order Management",
            "icon": "shopping-cart"
          }
        ],
        "rating": 4.8,
        "reviews_count": 24,
        "is_popular": true,
        "is_new": false,
        "is_featured": true,
        "tags": ["مطاعم", "POS", "إدارة"],
        "created_at": "2024-01-15T10:00:00Z",
        "updated_at": "2024-01-20T15:30:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 12,
      "total": 50,
      "last_page": 5,
      "from": 1,
      "to": 12
    },
    "categories": [
      {
        "id": 1,
        "name": "أنظمة المطاعم",
        "name_en": "Restaurant Systems",
        "slug": "restaurant-systems",
        "apps_count": 15
      }
    ]
  },
  "message": "تم جلب التطبيقات بنجاح"
}
```

---

### 2. جلب تفاصيل تطبيق معين
**GET** `/api/customer/ready-apps/{id}`

**Response Structure:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "نظام إدارة المطاعم المتكامل",
    "name_en": "Restaurant Management System",
    "description": "نظام شامل ومتكامل لإدارة المطاعم...",
    "description_en": "Comprehensive integrated restaurant management system...",
    "full_description": "نظام إدارة المطاعم المتكامل هو حل شامل...",
    "full_description_en": "Restaurant Management System is a comprehensive solution...",
    "short_description": "نظام شامل لإدارة المطاعم بكامل تفاصيلها",
    "short_description_en": "Complete restaurant management solution",
    "price": 15000.00,
    "original_price": 20000.00,
    "currency": "SAR",
    "discount_percentage": 25,
    "category": {
      "id": 1,
      "name": "أنظمة المطاعم",
      "name_en": "Restaurant Systems",
      "slug": "restaurant-systems"
    },
    "images": [
      {
        "id": 1,
        "url": "https://example.com/images/app-1-main.jpg",
        "type": "main",
        "order": 1,
        "alt": "صورة رئيسية للنظام",
        "alt_en": "Main system image"
      },
      {
        "id": 2,
        "url": "https://example.com/images/app-1-2.jpg",
        "type": "gallery",
        "order": 2,
        "alt": "صورة ثانوية",
        "alt_en": "Secondary image"
      },
      {
        "id": 3,
        "url": "https://example.com/images/app-1-3.jpg",
        "type": "gallery",
        "order": 3,
        "alt": "صورة ثالثة",
        "alt_en": "Third image"
      }
    ],
    "main_image": "https://example.com/images/app-1-main.jpg",
    "video_url": "https://www.youtube.com/embed/xxxxx",
    "video_thumbnail": "https://example.com/videos/thumb.jpg",
    "screenshots": [
      {
        "id": 1,
        "url": "https://example.com/screenshots/app-1-ss1.jpg",
        "title": "لوحة التحكم الرئيسية",
        "title_en": "Main Dashboard",
        "order": 1
      },
      {
        "id": 2,
        "url": "https://example.com/screenshots/app-1-ss2.jpg",
        "title": "نظام الطلبات",
        "title_en": "Order System",
        "order": 2
      }
    ],
    "features": [
      {
        "id": 1,
        "title": "إدارة الطلبات الكاملة من الاستقبال حتى التسليم",
        "title_en": "Complete order management from reception to delivery",
        "icon": "shopping-cart",
        "order": 1
      },
      {
        "id": 2,
        "title": "نظام نقاط البيع (POS) متقدم",
        "title_en": "Advanced POS system",
        "icon": "credit-card",
        "order": 2
      }
    ],
    "specifications": {
      "platforms": ["Web", "iOS", "Android"],
      "languages": ["العربية", "English"],
      "support": "24/7",
      "updates": "Free for 1 year",
      "installation": "Included",
      "training": "Included"
    },
    "pricing_plans": [
      {
        "id": 1,
        "name": "Basic",
        "name_en": "Basic",
        "price": 10000.00,
        "features": ["Feature 1", "Feature 2"]
      },
      {
        "id": 2,
        "name": "Pro",
        "name_en": "Pro",
        "price": 15000.00,
        "features": ["All Basic", "Feature 3", "Feature 4"]
      }
    ],
    "rating": {
      "average": 4.8,
      "total_reviews": 24,
      "breakdown": {
        "5": 15,
        "4": 7,
        "3": 2,
        "2": 0,
        "1": 0
      }
    },
    "reviews": [
      {
        "id": 1,
        "user": {
          "id": 10,
          "name": "أحمد محمد",
          "avatar": "https://example.com/avatars/user-10.jpg"
        },
        "rating": 5,
        "comment": "نظام رائع وسهل الاستخدام",
        "comment_en": "Great and easy to use system",
        "created_at": "2024-01-10T12:00:00Z"
      }
    ],
    "is_popular": true,
    "is_new": false,
    "is_featured": true,
    "is_favorite": false,
    "tags": ["مطاعم", "POS", "إدارة", "نقاط البيع"],
    "related_apps": [
      {
        "id": 2,
        "name": "نظام QR Menu",
        "main_image": "https://example.com/images/app-2-main.jpg",
        "price": 5000.00
      }
    ],
    "statistics": {
      "views": 1250,
      "purchases": 45,
      "favorites": 120
    },
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-20T15:30:00Z"
  },
  "message": "تم جلب تفاصيل التطبيق بنجاح"
}
```

---

### 3. إنشاء طلب شراء تطبيق
**POST** `/api/customer/ready-apps/{id}/purchase`

**Request Body:**
```json
{
  "pricing_plan_id": 2,
  "notes": "أريد تثبيت النظام في المطعم",
  "contact_preference": "phone"
}
```

**Response Structure:**
```json
{
  "success": true,
  "data": {
    "order_id": 12345,
    "app_id": 1,
    "app_name": "نظام إدارة المطاعم المتكامل",
    "price": 15000.00,
    "status": "pending",
    "created_at": "2024-01-25T10:00:00Z",
    "message": "تم إنشاء الطلب بنجاح، سيتم التواصل معك قريباً"
  },
  "message": "تم إنشاء طلب الشراء بنجاح"
}
```

---

### 4. إنشاء طلب استفسار
**POST** `/api/customer/ready-apps/{id}/inquiry`

**Request Body:**
```json
{
  "subject": "استفسار عن النظام",
  "message": "أريد معرفة المزيد عن المميزات",
  "contact_preference": "email"
}
```

**Response Structure:**
```json
{
  "success": true,
  "data": {
    "ticket_id": 67890,
    "app_id": 1,
    "status": "open",
    "created_at": "2024-01-25T10:00:00Z"
  },
  "message": "تم إنشاء طلب الاستفسار بنجاح"
}
```

---

### 5. إضافة/إزالة من المفضلة
**POST** `/api/customer/ready-apps/{id}/favorite`
**DELETE** `/api/customer/ready-apps/{id}/favorite`

**Response Structure:**
```json
{
  "success": true,
  "data": {
    "is_favorite": true
  },
  "message": "تمت إضافة التطبيق للمفضلة"
}
```

---

### 6. جلب التطبيقات المفضلة
**GET** `/api/customer/ready-apps/favorites`

**Response Structure:**
```json
{
  "success": true,
  "data": {
    "apps": [
      {
        "id": 1,
        "name": "نظام إدارة المطاعم المتكامل",
        "main_image": "https://example.com/images/app-1-main.jpg",
        "price": 15000.00,
        "favorited_at": "2024-01-20T10:00:00Z"
      }
    ]
  },
  "message": "تم جلب التطبيقات المفضلة بنجاح"
}
```

---

## 📊 Types/Interfaces المتوقعة

### ReadyApp (قائمة التطبيقات)
```typescript
interface ReadyApp {
  id: number;
  name: string;
  name_en?: string;
  description: string;
  description_en?: string;
  short_description?: string;
  short_description_en?: string;
  price: number;
  original_price?: number;
  currency: string;
  category: {
    id: number;
    name: string;
    name_en?: string;
    slug: string;
  };
  main_image: string;
  images?: Array<{
    id: number;
    url: string;
    type: 'main' | 'gallery';
    order: number;
  }>;
  video_url?: string;
  features?: Array<{
    id: number;
    title: string;
    title_en?: string;
    icon?: string;
  }>;
  rating?: number;
  reviews_count?: number;
  is_popular: boolean;
  is_new: boolean;
  is_featured?: boolean;
  tags?: string[];
  created_at: string;
  updated_at: string;
}
```

### ReadyAppDetails (تفاصيل التطبيق)
```typescript
interface ReadyAppDetails extends ReadyApp {
  full_description: string;
  full_description_en?: string;
  discount_percentage?: number;
  images: Array<{
    id: number;
    url: string;
    type: 'main' | 'gallery';
    order: number;
    alt?: string;
    alt_en?: string;
  }>;
  video_thumbnail?: string;
  screenshots: Array<{
    id: number;
    url: string;
    title: string;
    title_en?: string;
    order: number;
  }>;
  features: Array<{
    id: number;
    title: string;
    title_en?: string;
    icon?: string;
    order: number;
  }>;
  specifications?: {
    platforms: string[];
    languages: string[];
    support: string;
    updates: string;
    installation: string;
    training: string;
  };
  pricing_plans?: Array<{
    id: number;
    name: string;
    name_en?: string;
    price: number;
    features: string[];
  }>;
  rating: {
    average: number;
    total_reviews: number;
    breakdown: {
      [key: string]: number; // "5": 15, "4": 7, etc.
    };
  };
  reviews?: Array<{
    id: number;
    user: {
      id: number;
      name: string;
      avatar?: string;
    };
    rating: number;
    comment: string;
    comment_en?: string;
    created_at: string;
  }>;
  is_favorite: boolean;
  related_apps?: Array<{
    id: number;
    name: string;
    main_image: string;
    price: number;
  }>;
  statistics?: {
    views: number;
    purchases: number;
    favorites: number;
  };
}
```

### PurchaseRequest
```typescript
interface PurchaseRequest {
  pricing_plan_id?: number;
  notes?: string;
  contact_preference: 'phone' | 'email' | 'both';
}
```

### InquiryRequest
```typescript
interface InquiryRequest {
  subject: string;
  message: string;
  contact_preference: 'phone' | 'email' | 'both';
}
```

---

## 🔄 حالات الاستجابة (Response Status Codes)

- `200` - نجاح العملية
- `201` - تم الإنشاء بنجاح
- `400` - خطأ في البيانات المرسلة
- `401` - غير مصرح (غير مسجل دخول)
- `404` - التطبيق غير موجود
- `422` - خطأ في التحقق من البيانات
- `500` - خطأ في الخادم

---

## 📝 ملاحظات مهمة

1. **الترجمة**: جميع الحقول التي تحتوي على `_en` هي ترجمة إنجليزية اختيارية
2. **الصور**: جميع URLs يجب أن تكون كاملة (full URLs)
3. **التاريخ**: جميع التواريخ بصيغة ISO 8601 (UTC)
4. **العملة**: العملة الافتراضية هي SAR (ريال سعودي)
5. **Pagination**: عند وجود pagination، يتم إرجاعه في `pagination` object
6. **الترتيب**: يمكن استخدام `order` field لترتيب الصور والمميزات
7. **الفئات**: يمكن جلب قائمة الفئات من نفس endpoint أو endpoint منفصل

---

## 🎯 أمثلة على الاستخدام

### مثال 1: جلب التطبيقات مع فلترة
```
GET /api/customer/ready-apps?category=restaurant-systems&search=مطعم&page=1&per_page=12
```

### مثال 2: جلب تطبيق معين
```
GET /api/customer/ready-apps/1
```

### مثال 3: إنشاء طلب شراء
```
POST /api/customer/ready-apps/1/purchase
Content-Type: application/json

{
  "pricing_plan_id": 2,
  "notes": "أريد تثبيت النظام",
  "contact_preference": "phone"
}
```

---

**تاريخ الإنشاء:** 2024-01-25  
**آخر تحديث:** 2024-01-25  
**الإصدار:** 1.0.0

