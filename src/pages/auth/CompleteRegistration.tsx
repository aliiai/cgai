import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { User, Mail, Calendar, UserCircle, ArrowLeft, CheckCircle } from "lucide-react";
import Swal from "sweetalert2";
import { completeRegistration } from "../../services/auth.service";
import { useAuthStore } from "../../storeApi/storeApi";

const CompleteRegistration = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const phone = searchParams.get('phone') || '';
  
  // الحصول على التوكن الحالي من localStorage أو Zustand store
  const getCurrentToken = (): string => {
    // أولاً: محاولة الحصول على temp_token من localStorage (يُحفظ من VerifyOTP)
    const tempToken = localStorage.getItem('temp-token');
    if (tempToken) {
      console.log('Using temp-token from localStorage:', tempToken);
      return tempToken;
    }
    
    // ثانياً: محاولة الحصول من query parameters (fallback)
    const tempTokenFromQuery = searchParams.get('temp_token');
    if (tempTokenFromQuery) {
      console.log('Using temp-token from query params:', tempTokenFromQuery);
      // حفظه في localStorage للاستخدام لاحقاً
      localStorage.setItem('temp-token', tempTokenFromQuery);
      return tempTokenFromQuery;
    }
    
    // ثالثاً: محاولة الحصول من Zustand store
    if (token) {
      console.log('Using token from Zustand store:', token);
      return token;
    }
    
    // رابعاً: محاولة الحصول من localStorage مباشرة
    const authToken = localStorage.getItem('auth-token');
    if (authToken) {
      console.log('Using auth-token from localStorage:', authToken);
      return authToken;
    }
    
    // خامساً: محاولة الحصول من auth-storage
    try {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        const authData = JSON.parse(authStorage);
        const storedToken = authData?.state?.token;
        if (storedToken) {
          console.log('Using token from auth-storage:', storedToken);
          return storedToken;
        }
      }
    } catch (error) {
      console.error('Error parsing auth storage:', error);
    }
    
    console.warn('No token found in any storage location');
    return '';
  };
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    birthDate: '',
    gender: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);

  // التحقق من وجود رقم الهاتف والتوكن الحالي
  useEffect(() => {
    if (!phone) {
      Swal.fire({
        icon: 'warning',
        title: 'تنبيه',
        text: 'لم يتم العثور على رقم الهاتف',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#00adb5',
        customClass: {
          popup: 'font-ElMessiri',
        },
      }).then(() => {
        navigate('/register');
      });
    }
    
    const currentToken = getCurrentToken();
    if (!currentToken) {
      Swal.fire({
        icon: 'warning',
        title: 'تنبيه',
        text: 'التوكن غير موجود. يرجى تسجيل الدخول أولاً',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#00adb5',
        customClass: {
          popup: 'font-ElMessiri',
        },
      }).then(() => {
        navigate('/login');
      });
    }
  }, [phone, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // التحقق من الاسم (مطلوب)
    if (!formData.name.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'تنبيه',
        text: 'الرجاء إدخال الاسم الكامل',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#00adb5',
        customClass: {
          popup: 'font-ElMessiri',
        },
      });
      return;
    }

    // الحصول على التوكن الحالي قبل الإرسال
    const currentToken = getCurrentToken();
    console.log('Token to be sent:', currentToken ? 'Found' : 'Not found', currentToken);
    
    if (!currentToken) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'التوكن غير موجود. يرجى تسجيل الدخول أولاً',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#00adb5',
        customClass: {
          popup: 'font-ElMessiri',
        },
      }).then(() => {
        navigate('/login');
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await completeRegistration({
        phone: phone,
        tempToken: currentToken,
        name: formData.name,
        email: formData.email || undefined,
        birthDate: formData.birthDate || undefined,
        gender: formData.gender || undefined,
      });

      if (result.success) {
        // تنظيف temp-token من localStorage بعد إكمال التسجيل بنجاح
        localStorage.removeItem('temp-token');
        
        Swal.fire({
          icon: 'success',
          title: 'تم بنجاح!',
          text: result.message || 'تم إكمال التسجيل بنجاح 🎉',
          confirmButtonText: 'حسناً',
          confirmButtonColor: '#00adb5',
          customClass: {
            popup: 'font-ElMessiri',
          },
        }).then(() => {
          navigate('/admin/dashboard');
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: result.message || 'حدث خطأ أثناء إكمال التسجيل',
          confirmButtonText: 'حسناً',
          confirmButtonColor: '#00adb5',
          customClass: {
            popup: 'font-ElMessiri',
          },
        });
      }
    } catch (error) {
      console.error('Complete registration error:', error);
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'حدث خطأ في الاتصال بالخادم',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#00adb5',
        customClass: {
          popup: 'font-ElMessiri',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-primary/5 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            إكمال بيانات التسجيل
          </h1>
          <p className="text-gray-600">
            أدخل بياناتك الشخصية لإكمال التسجيل
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* الاسم الكامل */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                الاسم الكامل <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full pr-12 pl-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-right"
                  placeholder="أدخل اسمك الكامل"
                  required
                />
              </div>
            </div>

            {/* البريد الإلكتروني */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full pr-12 pl-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-right"
                  placeholder="example@email.com"
                  dir="ltr"
                />
              </div>
            </div>

            {/* تاريخ الميلاد */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                تاريخ الميلاد
              </label>
              <div className="relative">
                <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  className="w-full pr-12 pl-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-right"
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            {/* الجنس */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                الجنس
              </label>
              <div className="relative">
                <UserCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full pr-12 pl-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-right appearance-none bg-white"
                >
                  <option value="">اختر الجنس</option>
                  <option value="male">ذكر</option>
                  <option value="female">أنثى</option>
                </select>
              </div>
            </div>

            {/* معلومات رقم الهاتف */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-sm text-gray-600 text-right">
                رقم الهاتف المسجل: <span className="font-semibold text-primary">{phone}</span>
              </p>
            </div>

            {/* زر الإرسال */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-4 rounded-xl font-semibold hover:bg-primary-dark transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <>
                  <span>إكمال التسجيل</span>
                  <ArrowLeft className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompleteRegistration;

