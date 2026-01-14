import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Phone, Shield, ArrowRight, ArrowLeft, UserPlus } from "lucide-react";
import Swal from "sweetalert2";
import { sendVerificationCode, verifyLoginCode, useAuthStore } from "../../storeApi/storeApi";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, setLoading } = useAuthStore();
  const [phone, setPhone] = useState("");
  const [formattedPhone, setFormattedPhone] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
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

  const sendOtp = async () => {
    if (!phone) {
      await Swal.fire({
        icon: 'warning',
        title: 'تنبيه',
        text: 'الرجاء إدخال رقم الهاتف',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#00adb5',
        customClass: {
          popup: 'font-ElMessiri',
        },
        allowOutsideClick: true,
        allowEscapeKey: true,
      });
      return;
    }
    
    if (phone.length < 9) {
      await Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'رقم الهاتف غير صحيح. يجب أن يكون 9 أرقام على الأقل',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#00adb5',
        customClass: {
          popup: 'font-ElMessiri',
        },
        allowOutsideClick: true,
        allowEscapeKey: true,
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // تنسيق رقم الهاتف قبل الإرسال
      const formatted = formatPhoneNumber(phone);
      setFormattedPhone(formatted);
      
      // API call
      const result = await sendVerificationCode({
        phone: formatted,
        type: "login",
      });

      if (result.success) {
        await Swal.fire({
          icon: 'success',
          title: 'تم الإرسال!',
          text: result.message || 'تم إرسال كود التحقق إلى هاتفك',
          confirmButtonText: 'حسناً',
          confirmButtonColor: '#00adb5',
          timer: 2000,
          timerProgressBar: true,
          customClass: {
            popup: 'font-ElMessiri',
          },
          allowOutsideClick: true,
          allowEscapeKey: true,
        });
        setStep(2);
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: result.message || 'حدث خطأ أثناء إرسال كود التحقق',
          confirmButtonText: 'حسناً',
          confirmButtonColor: '#00adb5',
          customClass: {
            popup: 'font-ElMessiri',
          },
          allowOutsideClick: true,
          allowEscapeKey: true,
        });
      }
    } catch (error) {
      console.error('Send verification code error:', error);
      await Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'حدث خطأ في الاتصال بالخادم',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#00adb5',
        customClass: {
          popup: 'font-ElMessiri',
        },
        allowOutsideClick: true,
        allowEscapeKey: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    const otpString = otp.join("");
    
    if (otpString.length !== 6) {
      await Swal.fire({
        icon: 'warning',
        title: 'تنبيه',
        text: 'الرجاء إدخال كود التحقق المكون من 6 أرقام',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#00adb5',
        customClass: {
          popup: 'font-ElMessiri',
        },
        allowOutsideClick: true,
        allowEscapeKey: true,
      });
      return;
    }

    setIsLoading(true);
    setLoading(true);
    
    try {
      const result = await verifyLoginCode({
        phone: formattedPhone,
        code: otpString,
      });

      if (result.success) {
        // حفظ بيانات المستخدم في store و localStorage
        const token = result.data?.token || result.data?.data?.token || '';
        const user = result.data?.user || result.data?.data?.user || {
          phone: formattedPhone,
        };
        
        console.log('Login response data:', { token, user, fullData: result.data });
        console.log('Token value:', token, 'Type:', typeof token, 'Is valid:', !!token && token !== 'null' && token !== 'undefined');
        
        // التحقق من أن token موجود وصحيح
        if (!token || token === 'null' || token === 'undefined' || token.trim() === '') {
          console.error('Invalid token received:', token);
          await Swal.fire({
            icon: 'error',
            title: 'خطأ',
            text: 'لم يتم استلام التوكن بشكل صحيح. يرجى المحاولة مرة أخرى',
            confirmButtonText: 'حسناً',
            confirmButtonColor: '#00adb5',
            customClass: {
              popup: 'font-ElMessiri',
            },
            allowOutsideClick: true,
            allowEscapeKey: true,
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
                localStorage.setItem('login-timestamp', new Date().toISOString());
              }
            } catch (error) {
              console.error('Error verifying localStorage:', error);
            }
          }, 200);
        } else {
          console.error('Missing token or user data:', { token, user });
          await Swal.fire({
            icon: 'error',
            title: 'خطأ',
            text: 'لم يتم استلام بيانات المستخدم بشكل صحيح',
            confirmButtonText: 'حسناً',
            confirmButtonColor: '#00adb5',
            customClass: {
              popup: 'font-ElMessiri',
            },
            allowOutsideClick: true,
            allowEscapeKey: true,
          });
          return;
        }
        
        await Swal.fire({
          icon: 'success',
          title: 'تم بنجاح!',
          text: result.message || 'تم تسجيل الدخول بنجاح ✅',
          confirmButtonText: 'حسناً',
          confirmButtonColor: '#00adb5',
          customClass: {
            popup: 'font-ElMessiri',
          },
          allowOutsideClick: true,
          allowEscapeKey: true,
        });
        
          // التوجيه إلى المسار المحفوظ (من ProtectedRoute) أو لوحة التحكم
          const from = (location.state as any)?.from?.pathname || '/admin/dashboard';
          navigate(from, { replace: true });
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: result.message || 'حدث خطأ أثناء تسجيل الدخول',
          confirmButtonText: 'حسناً',
          confirmButtonColor: '#00adb5',
          customClass: {
            popup: 'font-ElMessiri',
          },
          allowOutsideClick: true,
          allowEscapeKey: true,
        });
      }
    } catch (error) {
      console.error('Verify login code error:', error);
      await Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'حدث خطأ في الاتصال بالخادم',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#00adb5',
        customClass: {
          popup: 'font-ElMessiri',
        },
        allowOutsideClick: true,
        allowEscapeKey: true,
      });
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep(1);
    setOtp(Array(6).fill(""));
    otpInputRefs.current.forEach(ref => {
      if (ref) ref.value = "";
    });
  };

  // دالة للتعامل مع إدخال OTP
  const handleOtpChange = (index: number, value: string) => {
    // قبول الأرقام فقط
    const numericValue = value.replace(/\D/g, '');
    
    if (numericValue.length > 1) {
      // في حالة Paste - توزيع الأرقام على الحقول
      const digits = numericValue.slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit;
        }
      });
      setOtp(newOtp);
      
      // التركيز على آخر حقل مملوء أو الحقل السادس
      const nextIndex = Math.min(index + digits.length, 5);
      otpInputRefs.current[nextIndex]?.focus();
    } else {
      // إدخال رقم واحد
      const newOtp = [...otp];
      newOtp[index] = numericValue;
      setOtp(newOtp);
      
      // الانتقال للحقل التالي إذا تم إدخال رقم
      if (numericValue && index < 5) {
        otpInputRefs.current[index + 1]?.focus();
      }
    }
  };

  // دالة للتعامل مع Backspace
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // إذا كان الحقل فارغاً، الرجوع للحقل السابق
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // التركيز على أول حقل عند الانتقال للخطوة الثانية
  useEffect(() => {
    if (step === 2) {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-primary/5 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo/Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            تسجيل الدخول
          </h1>
          <p className="text-gray-600">
            {step === 1 
              ? "أدخل رقم هاتفك لتسجيل الدخول" 
              : "أدخل كود التحقق المرسل إلى هاتفك"}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                1
              </div>
              <div className={`w-16 h-1 transition-all ${
                step >= 2 ? 'bg-primary' : 'bg-gray-200'
              }`}></div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
            </div>
          </div>

          {/* Step 1: Phone Number */}
          {step === 1 && (
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
                      // قبول الأرقام فقط
                      const value = e.target.value.replace(/\D/g, '');
                      setPhone(value);
                    }}
                    className="w-full pr-12 pl-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-right"
                    dir="ltr"
                    inputMode="numeric"
                  />
                </div>
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
          {step === 2 && (
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
                  تم إرسال الكود إلى: <span className="font-semibold text-primary">{formattedPhone || phone}</span>
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleBack}
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
                      <span>تسجيل الدخول</span>
                      <ArrowLeft className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">أو</span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-gray-600 mb-3">
              ليس لديك حساب؟
            </p>
            <Link to="/register">
              <button className="w-full border-2 border-primary text-primary py-3 rounded-xl font-semibold hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 group">
                <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>إنشاء حساب جديد</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          بالاستمرار، أنت توافق على{" "}
          <Link to="/terms" className="text-primary hover:underline">
            الشروط والأحكام
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
