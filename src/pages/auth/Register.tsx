import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Phone, ArrowLeft, ArrowRight, User, UserPlus, X, FileText, Shield, Mail, Calendar, UserCircle, CheckCircle } from "lucide-react";
import Swal from "sweetalert2";
import { sendVerificationCode, verifyRegistrationCode, completeRegistration, useAuthStore } from "../../storeApi/storeApi";

const Register = () => {
  const navigate = useNavigate();
  const { login, setLoading } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [formattedPhone, setFormattedPhone] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [tempToken, setTempToken] = useState("");
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    birthDate: '',
    gender: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // دالة لتنسيق رقم الهاتف
  const formatPhoneNumber = (phoneNumber: string): string => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      return '966' + cleaned.substring(1);
    }
    if (cleaned.startsWith('966')) {
      return cleaned;
    }
    if (cleaned.length === 9) {
      return '966' + cleaned;
    }
    if (cleaned.length === 10 && cleaned.startsWith('0')) {
      return '966' + cleaned.substring(1);
    }
    return '966' + cleaned;
  };

  // الخطوة 1: إرسال OTP
  const sendOtp = async () => {
    if (!phone) {
      Swal.fire({
        icon: 'warning',
        title: 'تنبيه',
        text: 'الرجاء إدخال رقم الهاتف',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#00adb5',
        customClass: { popup: 'font-ElMessiri' },
      });
      return;
    }
    
    if (phone.length < 9) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'رقم الهاتف غير صحيح. يجب أن يكون 9 أرقام على الأقل',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#00adb5',
        customClass: { popup: 'font-ElMessiri' },
      });
      return;
    }

    if (!acceptedTerms) {
      Swal.fire({
        icon: 'warning',
        title: 'تنبيه',
        text: 'يجب الموافقة على الشروط والأحكام للمتابعة',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#00adb5',
        customClass: { popup: 'font-ElMessiri' },
      });
      return;
    }

    setIsLoading(true);
    try {
      const formatted = formatPhoneNumber(phone);
      setFormattedPhone(formatted);
      
      const result = await sendVerificationCode({
        phone: formatted,
        type: "registration",
      });

      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'تم الإرسال!',
          text: result.message || 'تم إرسال كود التحقق إلى هاتفك',
          confirmButtonText: 'حسناً',
          confirmButtonColor: '#00adb5',
          timer: 2000,
          timerProgressBar: true,
          customClass: { popup: 'font-ElMessiri' },
        });
        setCurrentStep(2);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: result.message || 'حدث خطأ أثناء إرسال كود التحقق',
          confirmButtonText: 'حسناً',
          confirmButtonColor: '#00adb5',
          customClass: { popup: 'font-ElMessiri' },
        });
      }
    } catch (error) {
      console.error('Send verification code error:', error);
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'حدث خطأ في الاتصال بالخادم',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#00adb5',
        customClass: { popup: 'font-ElMessiri' },
      });
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  // الخطوة 2: التحقق من OTP
  const verifyOtp = async () => {
    const otpString = otp.join("");
    
    if (otpString.length !== 6) {
      Swal.fire({
        icon: 'warning',
        title: 'تنبيه',
        text: 'الرجاء إدخال كود التحقق المكون من 6 أرقام',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#00adb5',
        customClass: { popup: 'font-ElMessiri' },
      });
      return;
    }

    setIsLoading(true);
    setLoading(true);
    try {
      const result = await verifyRegistrationCode({
        phone: formattedPhone,
        code: otpString,
      });

      if (result.success) {
        const token = result.data?.temp_token || result.data?.token || '';
        console.log('Register - Received temp_token:', token);
        
        if (token) {
          setTempToken(token);
          // حفظ temp_token في localStorage أيضاً
          localStorage.setItem('temp-token', token);
          console.log('Register - Temp token saved to localStorage:', token);
        } else {
          console.warn('Register - No temp_token found in response:', result);
        }
        
        Swal.fire({
          icon: 'success',
          title: 'تم التحقق!',
          text: result.message || 'تم التحقق من كود التحقق بنجاح',
          confirmButtonText: 'حسناً',
          confirmButtonColor: '#00adb5',
          customClass: { popup: 'font-ElMessiri' },
        });
        setCurrentStep(3);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: result.message || 'حدث خطأ أثناء التحقق من الكود',
          confirmButtonText: 'حسناً',
          confirmButtonColor: '#00adb5',
          customClass: { popup: 'font-ElMessiri' },
        });
      }
    } catch (error) {
      console.error('Verify registration code error:', error);
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'حدث خطأ في الاتصال بالخادم',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#00adb5',
        customClass: { popup: 'font-ElMessiri' },
      });
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  // الخطوة 3: إكمال التسجيل
  const completeReg = async () => {
    if (!formData.name.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'تنبيه',
        text: 'الرجاء إدخال الاسم الكامل',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#00adb5',
        customClass: { popup: 'font-ElMessiri' },
      });
      return;
    }

    setIsLoading(true);
    setLoading(true);
    try {
      const result = await completeRegistration({
        phone: formattedPhone,
        temp_token: tempToken,
        name: formData.name,
        email: formData.email || undefined,
        birth_date: formData.birthDate || undefined,
        gender: formData.gender || undefined,
      });

      if (result.success) {
        // حفظ بيانات المستخدم في store و localStorage
        // التوكن الآن موجود في result.data.token مباشرة بعد التعديل في completeRegistration
        const token = result.data?.token || result.data?.data?.token || '';
        const user = result.data?.user || result.data?.data?.user || {
          name: formData.name,
          phone: formattedPhone,
          email: formData.email,
        };
        
        console.log('Complete Registration - Full result:', result);
        console.log('Complete Registration - result.data:', result.data);
        console.log('Complete Registration - Token extracted:', token);
        console.log('Complete Registration - User extracted:', user);
        console.log('Token value:', token, 'Type:', typeof token, 'Is valid:', !!token && token !== 'null' && token !== 'undefined');
        
        // التحقق من أن token موجود وصحيح
        if (!token || token === 'null' || token === 'undefined' || (typeof token === 'string' && token.trim() === '')) {
          console.error('Invalid token received:', token);
          console.error('Full result for debugging:', JSON.stringify(result, null, 2));
          Swal.fire({
            icon: 'error',
            title: 'خطأ',
            text: 'لم يتم استلام التوكن بشكل صحيح. يرجى المحاولة مرة أخرى',
            confirmButtonText: 'حسناً',
            confirmButtonColor: '#00adb5',
            customClass: {
              popup: 'font-ElMessiri',
            },
          });
          return;
        }
        
        if (token && user) {
          // حفظ البيانات في Zustand store (سيتم حفظها تلقائياً في localStorage)
          console.log('Calling login with token:', token);
          login(user, token);
          
          // التأكد من حفظ البيانات بعد فترة قصيرة
          setTimeout(() => {
            try {
              const savedAuth = localStorage.getItem('auth-storage');
              const savedUser = localStorage.getItem('user-data');
              const savedToken = localStorage.getItem('auth-token');
              
              console.log('Verification - Saved data:', {
                authStorage: savedAuth ? JSON.parse(savedAuth) : null,
                userData: savedUser,
                token: savedToken,
              });
              
              if (!savedAuth || !savedUser || !savedToken) {
                console.warn('Data not saved correctly, retrying...');
                localStorage.setItem('user-data', JSON.stringify(user));
                localStorage.setItem('auth-token', token);
                localStorage.setItem('is-authenticated', 'true');
                localStorage.setItem('registration-timestamp', new Date().toISOString());
              }
            } catch (error) {
              console.error('Error verifying localStorage:', error);
            }
          }, 200);
        } else {
          console.error('Missing token or user data:', { token, user });
          Swal.fire({
            icon: 'error',
            title: 'خطأ',
            text: 'لم يتم استلام بيانات المستخدم بشكل صحيح',
            confirmButtonText: 'حسناً',
            confirmButtonColor: '#00adb5',
            customClass: {
              popup: 'font-ElMessiri',
            },
          });
          return;
        }
        
        Swal.fire({
          icon: 'success',
          title: 'تم بنجاح!',
          text: result.message || 'تم إكمال التسجيل بنجاح 🎉',
          confirmButtonText: 'حسناً',
          confirmButtonColor: '#00adb5',
          customClass: { popup: 'font-ElMessiri' },
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
          customClass: { popup: 'font-ElMessiri' },
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
        customClass: { popup: 'font-ElMessiri' },
      });
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  // دوال OTP
  const handleOtpChange = (index: number, value: string) => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length > 1) {
      const digits = numericValue.slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit;
        }
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + digits.length, 5);
      otpInputRefs.current[nextIndex]?.focus();
    } else {
      const newOtp = [...otp];
      newOtp[index] = numericValue;
      setOtp(newOtp);
      if (numericValue && index < 5) {
        otpInputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  useEffect(() => {
    if (currentStep === 2) {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    }
  }, [currentStep]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const steps = [
    { number: 1, title: 'رقم الهاتف', icon: Phone },
    { number: 2, title: 'كود التحقق', icon: Shield },
    { number: 3, title: 'البيانات الشخصية', icon: User },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-primary/5 px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4">
            <UserPlus className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            إنشاء حساب جديد
          </h1>
          <p className="text-gray-600">
            اتبع الخطوات لإكمال التسجيل
          </p>
        </div>

        {/* Steps Indicator */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                      isActive 
                        ? 'bg-primary text-white shadow-lg scale-110' 
                        : isCompleted 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <span className={`mt-2 text-xs font-medium ${
                      isActive ? 'text-primary' : isCompleted ? 'text-primary' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                      isCompleted ? 'bg-primary' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Step 1: Phone Number */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeInUp">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-right">
                  رقم الهاتف
                </label>
                <div className="relative">
                  <Phone className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="05xxxxxxxx"
                    value={phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setPhone(value);
                    }}
                    className="w-full pr-12 pl-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-right"
                    dir="ltr"
                    inputMode="numeric"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1 w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                  />
                  <span className="text-sm text-gray-600 flex-1 text-right">
                    أوافق على{" "}
                    <button
                      type="button"
                      onClick={() => setShowTermsModal(true)}
                      className="text-primary hover:text-primary-dark underline font-medium"
                    >
                      الشروط والأحكام
                    </button>
                  </span>
                </label>
              </div>

              <button
                onClick={sendOtp}
                disabled={isLoading}
                className="w-full bg-primary text-white py-4 rounded-xl font-semibold hover:bg-primary-dark transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>جاري الإرسال...</span>
                  </>
                ) : (
                  <>
                    <span>إرسال كود التحقق</span>
                    <ArrowLeft className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* Step 2: OTP Verification */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeInUp">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4 text-right">
                  كود التحقق
                </label>
                <div className="flex justify-center gap-3 mb-4" dir="ltr">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        otpInputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      dir="ltr"
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2 text-right">
                  تم إرسال الكود إلى: <span className="font-semibold text-primary">{formattedPhone}</span>
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-5 h-5" />
                  <span>رجوع</span>
                </button>

                <button
                  onClick={verifyOtp}
                  disabled={isLoading || otp.join("").length !== 6}
                  className="flex-1 bg-primary text-white py-4 rounded-xl font-semibold hover:bg-primary-dark transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>جاري التحقق...</span>
                    </>
                  ) : (
                    <>
                      <span>التحقق</span>
                      <ArrowLeft className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Complete Registration */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeInUp">
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

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-sm text-gray-600 text-right">
                  رقم الهاتف المسجل: <span className="font-semibold text-primary">{formattedPhone}</span>
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-5 h-5" />
                  <span>رجوع</span>
                </button>

                <button
                  onClick={completeReg}
                  disabled={isLoading}
                  className="flex-1 bg-primary text-white py-4 rounded-xl font-semibold hover:bg-primary-dark transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
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
              </div>
            </div>
          )}

          {/* Divider */}
          {currentStep === 1 && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">أو</span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-gray-600 mb-3">لديك حساب بالفعل؟</p>
                <Link to="/login">
                  <button className="w-full border-2 border-primary text-primary py-3 rounded-xl font-semibold hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 group">
                    <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>تسجيل الدخول</span>
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Terms and Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">الشروط والأحكام</h2>
              </div>
              <button
                onClick={() => setShowTermsModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">1. القبول</h3>
                  <p className="text-sm">
                    من خلال إنشاء حساب على منصتنا، أنت توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، يرجى عدم استخدام خدماتنا.
                  </p>
                </section>
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">2. استخدام الخدمة</h3>
                  <p className="text-sm">
                    يجب عليك استخدام خدماتنا فقط للأغراض القانونية وبما يتوافق مع جميع القوانين واللوائح المعمول بها. لا يجوز لك استخدام خدماتنا لأي غرض غير قانوني أو محظور.
                  </p>
                </section>
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">3. الحساب والأمان</h3>
                  <p className="text-sm">
                    أنت مسؤول عن الحفاظ على سرية معلومات حسابك وكلمة المرور. يجب عليك إبلاغنا فوراً عن أي استخدام غير مصرح به لحسابك.
                  </p>
                </section>
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">4. الخصوصية</h3>
                  <p className="text-sm">
                    نحن نلتزم بحماية خصوصيتك. يرجى مراجعة سياسة الخصوصية الخاصة بنا لفهم كيفية جمع واستخدام معلوماتك.
                  </p>
                </section>
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">5. التعديلات</h3>
                  <p className="text-sm">
                    نحتفظ بالحق في تعديل هذه الشروط والأحكام في أي وقت. سيتم إشعارك بأي تغييرات جوهرية عبر البريد الإلكتروني أو من خلال منصتنا.
                  </p>
                </section>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowTermsModal(false)}
                className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all"
              >
                إغلاق
              </button>
              <button
                onClick={() => {
                  setAcceptedTerms(true);
                  setShowTermsModal(false);
                }}
                className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl"
              >
                موافق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
