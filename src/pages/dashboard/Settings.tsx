import { User, Phone, Mail, Save, Loader2, Calendar, UserCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore, updateProfile } from '../../storeApi/storeApi';
import Swal from 'sweetalert2';
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader';
import { useThemeStore } from '../../storeApi/store/theme.store';

const Settings = () => {
  const { t, i18n } = useTranslation();
  const { user, setUser } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  
  // تحديد الاتجاه بناءً على اللغة
  const isRTL = i18n.language === 'ar';
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    gender: '' as 'male' | 'female' | '',
    date_of_birth: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [formKey, setFormKey] = useState(0); // لإجبار React على إعادة الرسم
  const originalDataRef = useRef<typeof formData | null>(null);

  // دالة لتحويل user data إلى formData
  const userToFormData = (userData: any) => {
    if (!userData) return null;
    
    return {
      name: userData?.name || '',
      phone: userData?.phone || '',
      email: userData?.email || '',
      gender: (userData?.gender as 'male' | 'female') || '',
      date_of_birth: userData?.birth_date 
        ? (typeof userData.birth_date === 'string' && userData.birth_date.includes('T') 
            ? userData.birth_date.split('T')[0] 
            : userData.birth_date)
        : (userData?.date_of_birth 
            ? (typeof userData.date_of_birth === 'string' && userData.date_of_birth.includes('T') 
                ? userData.date_of_birth.split('T')[0] 
                : userData.date_of_birth)
            : ''),
    };
  };

  // دالة لجلب البيانات من localStorage مباشرة
  const loadUserFromStorage = () => {
    try {
      // محاولة الحصول من auth-storage (Zustand persist)
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        const authData = JSON.parse(authStorage);
        const storedUser = authData?.state?.user;
        if (storedUser) {
          // console.log('User found in auth-storage:', storedUser);
          return storedUser;
        }
      }

      // محاولة الحصول من user-data مباشرة
      const userDataStr = localStorage.getItem('user-data');
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        // console.log('User found in user-data:', userData);
        return userData;
      }
    } catch (error) {
      // console.error('Error loading user data from localStorage:', error);
    }
    return null;
  };

  // جلب بيانات المستخدم عند تحميل الصفحة - يعمل مرة واحدة
  useEffect(() => {
    const loadUserData = () => {
      // console.log('Loading user data...', { user, isDataLoaded });
      
      let userData = user;

      // إذا لم يكن user موجوداً في الـ store، جربه من localStorage
      if (!userData) {
        userData = loadUserFromStorage();
        
        // إذا تم العثور على البيانات في localStorage، قم بتحديث الـ store
        if (userData && !user) {
          // console.log('Setting user in store from localStorage:', userData);
          setUser(userData);
        }
      }

      // ملء الحقول بالبيانات
      if (userData) {
        const loadedFormData = userToFormData(userData);
        if (loadedFormData) {
          setFormData(loadedFormData);
          originalDataRef.current = { ...loadedFormData };
          setIsDataLoaded(true);
          // console.log('Form data loaded successfully:', loadedFormData);
        }
      } else {
        // console.warn('No user data found');
      }
    };

    // محاولة التحميل فوراً
    loadUserData();

    // محاولة التحميل مرة أخرى بعد تأخير قصير (للتأكد من أن persist أكمل التحميل)
    const timeoutId = setTimeout(() => {
      if (!isDataLoaded) {
        // console.log('Retrying to load user data after delay...');
        loadUserData();
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, []); // Empty dependency array - runs only once on mount

  // تحديث formData عندما يتغير user من الـ store
  useEffect(() => {
    const updateFormData = () => {
      if (user) {
        // console.log('Settings: User changed in store, updating form data:', user);
        const loadedFormData = userToFormData(user);
        if (loadedFormData) {
          setFormData(loadedFormData);
          originalDataRef.current = { ...loadedFormData };
          setIsDataLoaded(true);
          // console.log('Settings: Form data updated from store:', loadedFormData);
        }
      }
    };
    
    updateFormData();
    
    // الاستماع لتغييرات الـ store مباشرة
    const unsubscribe = useAuthStore.subscribe(
      (state) => state.user,
      (user) => {
        if (user) {
          const loadedFormData = userToFormData(user);
          if (loadedFormData) {
            // استخدام setTimeout لإجبار React على إعادة الرسم
            setTimeout(() => {
              setFormData(loadedFormData);
              originalDataRef.current = { ...loadedFormData };
              setIsDataLoaded(true);
              setFormKey(prev => prev + 1); // تغيير key لإجبار إعادة الرسم
              // console.log('Settings: Form data updated via subscription:', loadedFormData);
            }, 0);
          }
        }
      }
    );
    
    return () => unsubscribe();
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // الحصول على البيانات الحالية من الـ store أو localStorage
      let currentUser = user;
      if (!currentUser) {
        currentUser = loadUserFromStorage();
      }

      // إنشاء profileData مع البيانات المحدثة فقط (دمج مع البيانات الحالية)
      const profileData: {
        name?: string;
        phone?: string;
        email?: string;
        gender?: 'male' | 'female';
        date_of_birth?: string;
      } = {};

      // إضافة البيانات المحدثة فقط (حتى لو كانت فارغة، نرسلها لتحديثها)
      if (formData.name !== undefined) profileData.name = formData.name;
      if (formData.phone !== undefined) profileData.phone = formData.phone;
      if (formData.email !== undefined) profileData.email = formData.email;
      if (formData.gender !== undefined && formData.gender !== '') {
        profileData.gender = formData.gender as 'male' | 'female';
      }
      if (formData.date_of_birth !== undefined && formData.date_of_birth !== '') {
        profileData.date_of_birth = formData.date_of_birth;
      }

      // console.log('Sending profile data:', profileData);

      const result = await updateProfile(profileData);

      if (result.success && result.data) {
        // دمج البيانات المحدثة مع البيانات الحالية
        const mergedUser = {
          ...currentUser,
          ...result.data,
          // التأكد من أن birth_date محدث
          birth_date: result.data.birth_date || result.data.date_of_birth || currentUser?.birth_date,
        };

        // تحديث الـ store - سيحدث re-render تلقائياً
        setUser(mergedUser);
        
        // انتظار قصير للتأكد من تحديث الـ store
        await new Promise(resolve => setTimeout(resolve, 100));

        // استخدام البيانات المحدثة مباشرة
        const finalUser = mergedUser;

        // تحديث formData بالبيانات المحدثة - useEffect سيتولى التحديث تلقائياً
        // لأننا قمنا بتحديث user في الـ store، useEffect سيعيد تعيين formData
        // console.log('User updated in store, useEffect will update formData automatically');

        Swal.fire({
          icon: 'success',
          title: t('dashboard.settings.saved'),
          text: result.message || t('dashboard.settings.savedSuccess'),
          confirmButtonText: t('dashboard.ticketDetails.ok'),
          confirmButtonColor: '#00adb5',
          customClass: {
            popup: 'font-ElMessiri',
          },
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: t('dashboard.support.error'),
          text: result.message || t('dashboard.settings.saveFailed'),
          confirmButtonText: t('dashboard.ticketDetails.ok'),
          confirmButtonColor: '#00adb5',
          customClass: {
            popup: 'font-ElMessiri',
          },
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Swal.fire({
        icon: 'error',
        title: t('dashboard.support.error'),
        text: t('dashboard.settings.saveError'),
        confirmButtonText: t('dashboard.ticketDetails.ok'),
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
    <div className="space-y-8 animate-in fade-in zoom-in duration-500">
      <DashboardPageHeader
        title={t('dashboard.settings.title')}
        subtitle={t('dashboard.settings.subtitle')}
      />

      {/* معلومات الحساب */}
      <div className={`rounded-3xl p-8 shadow-xl border-2 relative overflow-hidden ${
        isDarkMode 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-gray-200/60'
      }`}>
        {/* Decorative gradients */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-emerald-50/30 to-transparent rounded-full blur-2xl opacity-50" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 rounded-2xl flex items-center justify-center text-primary border-2 border-primary/20 shadow-lg">
              <User size={32} strokeWidth={1.5} />
            </div>
            <div>
              <h2 className={`text-3xl font-black mb-1 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>{t('dashboard.settings.accountInfo')}</h2>
              <p className={`text-sm ${
                isDarkMode ? 'text-slate-400' : 'text-gray-600'
              }`}>{t('dashboard.settings.updateInfo')}</p>
            </div>
          </div>
          
          <form key={formKey} onSubmit={handleSubmit} className="space-y-6">
            {/* الاسم */}
            <div className="group">
              <label className={`block text-sm font-bold mb-3 ${isRTL ? 'text-right' : 'text-left'} ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                {t('dashboard.settings.fullName')}
              </label>
              <div className="relative">
                <div className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border-2 border-primary/20 group-hover:bg-primary group-hover:border-primary transition-all duration-300`}>
                  <User size={20} className="text-primary group-hover:text-white transition-colors" />
                </div>
                <input
                  key={`name-${formKey}-${formData.name}`}
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full ${isRTL ? 'pr-20 pl-5' : 'pl-20 pr-5'} py-4 border-2 rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all ${isRTL ? 'text-right' : 'text-left'} font-semibold ${
                    isDarkMode 
                      ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 hover:bg-slate-700' 
                      : 'bg-gradient-to-br from-gray-50 to-white hover:from-white hover:to-gray-50 border-gray-200 text-gray-900'
                  }`}
                  placeholder={t('dashboard.settings.fullNamePlaceholder')}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
              </div>
            </div>

            {/* رقم الهاتف */}
            <div className="group">
              <label className={`block text-sm font-bold mb-3 ${isRTL ? 'text-right' : 'text-left'} ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                {t('dashboard.settings.phone')}
              </label>
              <div className="relative">
                <div className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border-2 border-primary/20 group-hover:bg-primary group-hover:border-primary transition-all duration-300`}>
                  <Phone size={20} className="text-primary group-hover:text-white transition-colors" />
                </div>
                <input
                  key={`phone-${formKey}-${formData.phone}`}
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    handleInputChange('phone', value);
                  }}
                  className={`w-full ${isRTL ? 'pr-20 pl-5' : 'pl-20 pr-5'} py-4 border-2 rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all ${isRTL ? 'text-right' : 'text-left'} font-semibold ${
                    isDarkMode 
                      ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 hover:bg-slate-700' 
                      : 'bg-gradient-to-br from-gray-50 to-white hover:from-white hover:to-gray-50 border-gray-200 text-gray-900'
                  }`}
                  placeholder="05xxxxxxxx"
                  dir="ltr"
                  inputMode="numeric"
                />
              </div>
            </div>

            {/* البريد الإلكتروني */}
            <div className="group">
              <label className={`block text-sm font-bold mb-3 ${isRTL ? 'text-right' : 'text-left'} ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                {t('dashboard.settings.email')}
              </label>
              <div className="relative">
                <div className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border-2 border-primary/20 group-hover:bg-primary group-hover:border-primary transition-all duration-300`}>
                  <Mail size={20} className="text-primary group-hover:text-white transition-colors" />
                </div>
                <input
                  key={`email-${formKey}-${formData.email}`}
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full ${isRTL ? 'pr-20 pl-5' : 'pl-20 pr-5'} py-4 border-2 rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all ${isRTL ? 'text-right' : 'text-left'} font-semibold ${
                    isDarkMode 
                      ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 hover:bg-slate-700' 
                      : 'bg-gradient-to-br from-gray-50 to-white hover:from-white hover:to-gray-50 border-gray-200 text-gray-900'
                  }`}
                  placeholder="example@email.com"
                  dir="ltr"
                />
              </div>
            </div>

            {/* الجنس */}
            <div className="group">
              <label className={`block text-sm font-bold mb-3 ${isRTL ? 'text-right' : 'text-left'} ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                {t('dashboard.settings.gender')}
              </label>
              <div className="relative">
                <div className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border-2 border-primary/20 group-hover:bg-primary group-hover:border-primary transition-all duration-300`}>
                  <UserCircle size={20} className="text-primary group-hover:text-white transition-colors" />
                </div>
                <select
                  key={`gender-${formKey}-${formData.gender}`}
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className={`w-full ${isRTL ? 'pr-20 pl-5' : 'pl-20 pr-5'} py-4 border-2 rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all ${isRTL ? 'text-right' : 'text-left'} font-semibold appearance-none ${
                    isDarkMode 
                      ? 'bg-slate-700 border-slate-600 text-white hover:bg-slate-700' 
                      : 'bg-gradient-to-br from-gray-50 to-white hover:from-white hover:to-gray-50 border-gray-200 text-gray-900'
                  }`}
                  dir={isRTL ? 'rtl' : 'ltr'}
                >
                  <option value="">{t('dashboard.settings.selectGender')}</option>
                  <option value="male">{t('dashboard.settings.male')}</option>
                  <option value="female">{t('dashboard.settings.female')}</option>
                </select>
              </div>
            </div>

            {/* تاريخ الميلاد */}
            <div className="group">
              <label className={`block text-sm font-bold mb-3 ${isRTL ? 'text-right' : 'text-left'} ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                {t('dashboard.settings.dateOfBirth')}
              </label>
              <div className="relative">
                <div className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border-2 border-primary/20 group-hover:bg-primary group-hover:border-primary transition-all duration-300`}>
                  <Calendar size={20} className="text-primary group-hover:text-white transition-colors" />
                </div>
                <input
                  key={`date-${formKey}-${formData.date_of_birth}`}
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                  className={`w-full ${isRTL ? 'pr-20 pl-5' : 'pl-20 pr-5'} py-4 border-2 rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all ${isRTL ? 'text-right' : 'text-left'} font-semibold ${
                    isDarkMode 
                      ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 hover:bg-slate-700' 
                      : 'bg-gradient-to-br from-gray-50 to-white hover:from-white hover:to-gray-50 border-gray-200 text-gray-900'
                  }`}
                  dir="ltr"
                />
              </div>
            </div>

            {/* زر الحفظ */}
            <div className={`pt-6 border-t-2 ${
              isDarkMode ? 'border-slate-700' : 'border-gray-200'
            }`}>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-primary-dark text-white py-4 rounded-2xl font-black shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3 text-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>{t('dashboard.settings.saving')}</span>
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    <span>{t('dashboard.settings.saveChanges')}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
