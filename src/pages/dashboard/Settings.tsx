import { User, Phone, Mail, Save, Loader2, Calendar, UserCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore, updateProfile } from '../../storeApi/storeApi';
import Swal from 'sweetalert2';
import DashboardPageHeader from '../../components/dashboard/DashboardPageHeader';

const Settings = () => {
  const { t, i18n } = useTranslation();
  const { user, setUser } = useAuthStore();
  
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

  // تحديث formData عندما يتغير user من الـ store
  // Zustand سيتولى re-render تلقائياً عند تغيير user
  useEffect(() => {
    if (user) {
      const loadedFormData = userToFormData(user);
      if (loadedFormData) {
        setFormData(loadedFormData);
      }
    }
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
      // إنشاء profileData مع البيانات المحدثة فقط
      const profileData: {
        name?: string;
        phone?: string;
        email?: string;
        gender?: 'male' | 'female';
        date_of_birth?: string;
      } = {};

      // إضافة البيانات المحدثة فقط
      if (formData.name !== undefined) profileData.name = formData.name;
      if (formData.phone !== undefined) profileData.phone = formData.phone;
      if (formData.email !== undefined) profileData.email = formData.email;
      if (formData.gender !== undefined && formData.gender !== '') {
        profileData.gender = formData.gender as 'male' | 'female';
      }
      if (formData.date_of_birth !== undefined && formData.date_of_birth !== '') {
        profileData.date_of_birth = formData.date_of_birth;
      }

      const result = await updateProfile(profileData);

      if (result.success && result.data) {
        // updateProfile يتولى تحديث الـ store تلقائياً
        // Zustand persist سيتولى الحفظ في localStorage تلقائياً
        // جميع المكونات التي تستخدم useAuthStore ستعيد الرسم تلقائياً

        Swal.fire({
          icon: 'success',
          title: t('dashboard.settings.saved'),
          text: result.message || t('dashboard.settings.savedSuccess'),
          confirmButtonText: t('dashboard.ticketDetails.ok'),
          confirmButtonColor: '#114C5A',
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
          confirmButtonColor: '#114C5A',
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
        confirmButtonColor: '#114C5A',
        customClass: {
          popup: 'font-ElMessiri',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title={t('dashboard.settings.title')}
        subtitle={t('dashboard.settings.subtitle')}
      />

      {/* معلومات الحساب */}
      <div className="bg-white rounded-xl border border-[#114C5A]/10 shadow-sm p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-[#114C5A]/10 rounded-xl flex items-center justify-center text-[#114C5A] border border-[#114C5A]/20">
            <User size={32} strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-1 text-gray-900">{t('dashboard.settings.accountInfo')}</h2>
            <p className="text-sm text-gray-600">{t('dashboard.settings.updateInfo')}</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* الاسم */}
          <div className="group">
            <label className={`block text-sm font-semibold mb-3 ${isRTL ? 'text-right' : 'text-left'} text-gray-700`}>
              {t('dashboard.settings.fullName')}
            </label>
            <div className="relative">
              <div className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 w-12 h-12 bg-[#114C5A]/10 rounded-xl flex items-center justify-center border border-[#114C5A]/20 group-hover:bg-[#114C5A] group-hover:border-[#114C5A] transition-all duration-200`}>
                <User size={20} className="text-[#114C5A] group-hover:text-white transition-colors" />
              </div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full ${isRTL ? 'pr-20 pl-5' : 'pl-20 pr-5'} py-4 border border-[#114C5A]/10 rounded-xl focus:outline-none focus:border-[#114C5A] focus:ring-2 focus:ring-[#114C5A]/20 transition-all ${isRTL ? 'text-right' : 'text-left'} font-semibold bg-gray-50 text-gray-900 placeholder:text-gray-400 hover:bg-white`}
                placeholder={t('dashboard.settings.fullNamePlaceholder')}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
          </div>

          {/* رقم الهاتف */}
          <div className="group">
            <label className={`block text-sm font-semibold mb-3 ${isRTL ? 'text-right' : 'text-left'} text-gray-700`}>
              {t('dashboard.settings.phone')}
            </label>
            <div className="relative">
              <div className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 w-12 h-12 bg-[#114C5A]/10 rounded-xl flex items-center justify-center border border-[#114C5A]/20 group-hover:bg-[#114C5A] group-hover:border-[#114C5A] transition-all duration-200`}>
                <Phone size={20} className="text-[#114C5A] group-hover:text-white transition-colors" />
              </div>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  handleInputChange('phone', value);
                }}
                className={`w-full ${isRTL ? 'pr-20 pl-5' : 'pl-20 pr-5'} py-4 border border-[#114C5A]/10 rounded-xl focus:outline-none focus:border-[#114C5A] focus:ring-2 focus:ring-[#114C5A]/20 transition-all ${isRTL ? 'text-right' : 'text-left'} font-semibold bg-gray-50 text-gray-900 placeholder:text-gray-400 hover:bg-white`}
                placeholder="05xxxxxxxx"
                dir="ltr"
                inputMode="numeric"
              />
            </div>
          </div>

          {/* البريد الإلكتروني */}
          <div className="group">
            <label className={`block text-sm font-semibold mb-3 ${isRTL ? 'text-right' : 'text-left'} text-gray-700`}>
              {t('dashboard.settings.email')}
            </label>
            <div className="relative">
              <div className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 w-12 h-12 bg-[#114C5A]/10 rounded-xl flex items-center justify-center border border-[#114C5A]/20 group-hover:bg-[#114C5A] group-hover:border-[#114C5A] transition-all duration-200`}>
                <Mail size={20} className="text-[#114C5A] group-hover:text-white transition-colors" />
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full ${isRTL ? 'pr-20 pl-5' : 'pl-20 pr-5'} py-4 border border-[#114C5A]/10 rounded-xl focus:outline-none focus:border-[#114C5A] focus:ring-2 focus:ring-[#114C5A]/20 transition-all ${isRTL ? 'text-right' : 'text-left'} font-semibold bg-gray-50 text-gray-900 placeholder:text-gray-400 hover:bg-white`}
                placeholder="example@email.com"
                dir="ltr"
              />
            </div>
          </div>

          {/* الجنس */}
          <div className="group">
            <label className={`block text-sm font-semibold mb-3 ${isRTL ? 'text-right' : 'text-left'} text-gray-700`}>
              {t('dashboard.settings.gender')}
            </label>
            <div className="relative">
              <div className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 w-12 h-12 bg-[#114C5A]/10 rounded-xl flex items-center justify-center border border-[#114C5A]/20 group-hover:bg-[#114C5A] group-hover:border-[#114C5A] transition-all duration-200 pointer-events-none z-10`}>
                <UserCircle size={20} className="text-[#114C5A] group-hover:text-white transition-colors" />
              </div>
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className={`w-full ${isRTL ? 'pr-20 pl-5' : 'pl-20 pr-5'} py-4 border border-[#114C5A]/10 rounded-xl focus:outline-none focus:border-[#114C5A] focus:ring-2 focus:ring-[#114C5A]/20 transition-all ${isRTL ? 'text-right' : 'text-left'} font-semibold appearance-none bg-gray-50 text-gray-900 hover:bg-white`}
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
            <label className={`block text-sm font-semibold mb-3 ${isRTL ? 'text-right' : 'text-left'} text-gray-700`}>
              {t('dashboard.settings.dateOfBirth')}
            </label>
            <div className="relative">
              <div className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 w-12 h-12 bg-[#114C5A]/10 rounded-xl flex items-center justify-center border border-[#114C5A]/20 group-hover:bg-[#114C5A] group-hover:border-[#114C5A] transition-all duration-200 pointer-events-none z-10`}>
                <Calendar size={20} className="text-[#114C5A] group-hover:text-white transition-colors" />
              </div>
              <input
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                className={`w-full ${isRTL ? 'pr-20 pl-5' : 'pl-20 pr-5'} py-4 border border-[#114C5A]/10 rounded-xl focus:outline-none focus:border-[#114C5A] focus:ring-2 focus:ring-[#114C5A]/20 transition-all ${isRTL ? 'text-right' : 'text-left'} font-semibold bg-gray-50 text-gray-900 placeholder:text-gray-400 hover:bg-white`}
                dir="ltr"
              />
            </div>
          </div>

          {/* زر الحفظ */}
          <div className="pt-6 border-t border-[#114C5A]/10">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#114C5A] text-white py-4 rounded-xl font-semibold shadow-md hover:bg-[#114C5A]/90 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-base"
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
  );
};

export default Settings;
