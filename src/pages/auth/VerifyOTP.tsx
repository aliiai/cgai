import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Shield, ArrowRight, ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";
import { verifyRegistrationCode } from "../../services/auth.service";

const VerifyOTP = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const phone = searchParams.get('phone') || '';
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

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
  }, [phone, navigate]);

  const verifyOtp = async () => {
    const otpString = otp.join("");
    
    if (otpString.length !== 6) {
      Swal.fire({
        icon: 'warning',
        title: 'تنبيه',
        text: 'الرجاء إدخال كود التحقق المكون من 6 أرقام',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#00adb5',
        customClass: {
          popup: 'font-ElMessiri',
        },
      });
      return;
    }

    if (!phone) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'لم يتم العثور على رقم الهاتف',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#00adb5',
        customClass: {
          popup: 'font-ElMessiri',
        },
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // API call للتحقق من كود التسجيل
      const result = await verifyRegistrationCode({
        phone: phone, // الرقم المنسق الذي تم إرساله
        code: otpString,
      });

      if (result.success) {
        // استخراج temp_token من response
        // temp_token موجود مباشرة في response.data أو في result.data
        const tempToken = result.data?.temp_token || result.temp_token || result.data?.token || '';
        
        console.log('Received temp_token:', tempToken, 'Full result:', result);
        
        // حفظ temp_token في localStorage
        if (tempToken) {
          localStorage.setItem('temp-token', tempToken);
          console.log('Temp token saved to localStorage:', tempToken);
        } else {
          console.warn('No temp_token found in response:', result);
        }
        
        Swal.fire({
          icon: 'success',
          title: 'تم التحقق!',
          text: result.message || 'تم التحقق من كود التحقق بنجاح',
          confirmButtonText: 'حسناً',
          confirmButtonColor: '#00adb5',
          customClass: {
            popup: 'font-ElMessiri',
          },
        }).then(() => {
          // التحويل إلى صفحة إكمال بيانات التسجيل مع temp_token
          const params = new URLSearchParams({
            phone: phone,
            ...(tempToken && { temp_token: tempToken }),
          });
          navigate(`/complete-registration?${params.toString()}`);
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: result.message || 'حدث خطأ أثناء التسجيل',
          confirmButtonText: 'حسناً',
          confirmButtonColor: '#00adb5',
          customClass: {
            popup: 'font-ElMessiri',
          },
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
        customClass: {
          popup: 'font-ElMessiri',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // دالة للتعامل مع إدخال OTP
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
    if (phone) {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    }
  }, [phone]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-primary/5 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            التحقق من الكود
          </h1>
          <p className="text-gray-600">
            أدخل كود التحقق المرسل إلى هاتفك
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="space-y-6">
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
                تم إرسال الكود إلى: <span className="font-semibold text-primary">{phone}</span>
              </p>
            </div>

            <button
              onClick={verifyOtp}
              disabled={isLoading || otp.join("").length !== 6}
              className="w-full bg-primary text-white py-4 rounded-xl font-semibold hover:bg-primary-dark transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
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

            <button
              onClick={() => navigate('/register')}
              className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-5 h-5" />
              <span>رجوع</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;

