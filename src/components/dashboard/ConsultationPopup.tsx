import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { Loader2, ChevronRight, ChevronLeft, Coins } from "lucide-react";
import { getConsultationAvailableDates, createConsultationBooking, useThemeStore, getWallet } from "../../storeApi/storeApi";
import Swal from "sweetalert2";
import type { Consultation, AvailableDate, TimeSlot } from "../../types/types";

interface ConsultationPopupProps {
  consultation: Consultation;
  onClose: () => void;
}

interface BookingData {
  consultation_id: number;
  booking_date: string;
  time_slot_id: number;
  notes: string;
  use_points?: boolean;
}

const ConsultationPopup = ({ consultation, onClose }: ConsultationPopupProps) => {
  const { t, i18n } = useTranslation();
  const { isDarkMode } = useThemeStore();
  const navigate = useNavigate();
  
  // تحديد الاتجاه بناءً على اللغة
  const isRTL = i18n.language === 'ar';
  const textAlign = isRTL ? 'text-right' : 'text-left';
  const flexDirection = isRTL ? 'flex-row' : 'flex-row-reverse';

  const PrevArrow = ({ onClick }: any) => (
    <button
      onClick={onClick}
      className={`absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 border hover:border-primary group ${
        isDarkMode 
          ? 'bg-slate-800/90 border-slate-600' 
          : 'bg-white/90 border-gray-100'
      }`}
      aria-label={t('dashboard.booking.previousDay')}
      type="button"
    >
      <ChevronLeft className={`w-5 h-5 group-hover:text-white transition-colors ${
        isDarkMode ? 'text-slate-300' : 'text-gray-600'
      }`} />
    </button>
  );

  const NextArrow = ({ onClick }: any) => (
    <button
      onClick={onClick}
      className={`absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 border hover:border-primary group ${
        isDarkMode 
          ? 'bg-slate-800/90 border-slate-600' 
          : 'bg-white/90 border-gray-100'
      }`}
      aria-label={t('dashboard.booking.nextDay')}
      type="button"
    >
      <ChevronRight className={`w-5 h-5 group-hover:text-white transition-colors ${
        isDarkMode ? 'text-slate-300' : 'text-gray-600'
      }`} />
    </button>
  );
  const [availableDates, setAvailableDates] = useState<AvailableDate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState<number | null>(null);
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [usePoints, setUsePoints] = useState<boolean>(true); // افتراضياً مفعّل
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [pointsPerRiyal, setPointsPerRiyal] = useState<number>(10);

  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  const sliderRef = useRef<any>(null);
  const isManualSelection = useRef(false);

  // ======= Load Wallet Data =======
  useEffect(() => {
    const loadWallet = async () => {
      try {
        const result = await getWallet();
        if (result.success && result.data) {
          setWalletBalance(result.data.wallet.balance || 0);
          setPointsPerRiyal(result.data.settings.points_per_riyal || 10);
        }
      } catch (error) {
        console.error("Error loading wallet:", error);
      }
    };
    loadWallet();
  }, []);

  // ======= Load Dates =======
  useEffect(() => {
    const loadAvailableDates = async () => {
      setIsLoading(true);
      try {
        const result = await getConsultationAvailableDates(consultation.id);
        if (result.success && result.data) {
          const sortedDates = result.data.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          setAvailableDates(sortedDates);

          const today = new Date().toISOString().split("T")[0];
          const todayIndex = sortedDates.findIndex(
            (date) => date.date === today || date.formatted_date === today
          );
          setSelectedDayIndex(todayIndex !== -1 ? todayIndex : 0);
        }
      } catch (error) {
        console.error("Error loading dates:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAvailableDates();
  }, [consultation.id]);

  // تحديث bookingData عند تغيير selectedTimeSlotId أو selectedDayIndex أو notes أو usePoints
  useEffect(() => {
    if (availableDates.length === 0 || selectedDayIndex < 0 || selectedDayIndex >= availableDates.length) {
      setBookingData(null);
      return;
    }
    
    const selectedDate = availableDates[selectedDayIndex];
    if (selectedDate && selectedTimeSlotId) {
      const newBookingData = {
        consultation_id: consultation.id,
        booking_date: selectedDate.date,
        time_slot_id: selectedTimeSlotId,
        notes,
        use_points: usePoints,
      };
      
      // تحديث فقط إذا تغيرت البيانات
      setBookingData(prev => {
        if (prev && 
            prev.consultation_id === newBookingData.consultation_id &&
            prev.booking_date === newBookingData.booking_date &&
            prev.time_slot_id === newBookingData.time_slot_id &&
            prev.notes === newBookingData.notes &&
            prev.use_points === newBookingData.use_points) {
          return prev;
        }
        return newBookingData;
      });
    } else {
      setBookingData(null);
    }
  }, [selectedTimeSlotId, selectedDayIndex, availableDates.length, consultation.id, notes, usePoints]);

  // إعادة تعيين الوقت عند تغيير اليوم
  useEffect(() => {
    setSelectedTimeSlotId(null);
    setSubmitError(null);
    setSubmitSuccess(false);
  }, [selectedDayIndex]);

  // التأكد من أن السلايدر ينتقل إلى اليوم الصحيح بعد التحميل
  useEffect(() => {
    if (!isLoading && availableDates.length > 0 && sliderRef.current) {
      const timer = setTimeout(() => {
        sliderRef.current.slickGoTo(selectedDayIndex);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading, availableDates.length, selectedDayIndex]);

  // ======= إرسال الحجز =======
  const handleSubmitBooking = async () => {
    // التحقق من أن الخدمة محددة
    if (!consultation || !consultation.id) {
      setSubmitError(t('dashboard.consultation.selectServiceFirst'));
      return;
    }

    // التحقق من أن bookingData موجود
    if (!bookingData) {
      setSubmitError(t('dashboard.consultation.bookingDataError'));
      return;
    }

    // التحقق من أن consultation_id موجود
    if (!bookingData.consultation_id) {
      setSubmitError(t('dashboard.consultation.selectServiceFirst'));
      return;
    }

    // التحقق من أن اليوم محدد
    if (!bookingData.booking_date) {
      setSubmitError(t('dashboard.consultation.selectDayFirst'));
      return;
    }

    // التحقق من اختيار وقت واحد فقط
    if (!bookingData.time_slot_id) {
      setSubmitError(t('dashboard.consultation.selectTimeFirst'));
      return;
    }

    // حساب السعر والنقاط المطلوبة
    const consultationPrice = consultation.price || parseFloat(consultation.fixed_price || '0');

    // إذا كان المستخدم يريد استخدام النقاط، تحقق من كفايتها
    if (usePoints) {
      const requiredPoints = Math.ceil(consultationPrice * pointsPerRiyal);
      
      // التحقق من كفاية النقاط
      if (walletBalance < requiredPoints) {
      const result = await Swal.fire({
        icon: 'warning',
        title: t('dashboard.consultation.result.insufficientPoints.title'),
        html: `
          <div style="text-align: ${isRTL ? 'right' : 'left'}; direction: ${isRTL ? 'rtl' : 'ltr'};" class="font-ElMessiri">
            <p class="text-gray-700 text-base mb-4">${t('dashboard.wallet.insufficientPointsMessage')}</p>
            <div class="bg-amber-50 ${isRTL ? 'border-r-4' : 'border-l-4'} border-amber-400 p-4 rounded-lg mb-4">
              <p class="text-amber-800 text-sm font-semibold mb-2">${t('dashboard.wallet.requiredPoints')} ${requiredPoints.toLocaleString()} ${t('dashboard.wallet.point')}</p>
              <p class="text-amber-700 text-sm">${t('dashboard.wallet.yourBalance')} ${walletBalance.toLocaleString()} ${t('dashboard.wallet.point')}</p>
            </div>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: t('dashboard.wallet.goToWalletToPurchase'),
        cancelButtonText: t('dashboard.consultation.result.insufficientPoints.cancel'),
        confirmButtonColor: '#00adb5',
        cancelButtonColor: '#6b7280',
        customClass: {
          popup: 'font-ElMessiri',
        },
        allowOutsideClick: true,
        allowEscapeKey: true,
      });
      
        if (result.isConfirmed) {
          // إغلاق نافذة الحجز والذهاب إلى المحفظة
          onClose();
          navigate('/admin/wallet');
        }
        return;
      }
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      console.log("Sending consultation booking data:", bookingData);
      
      // إنشاء حجز للخدمة الاستشارية
      const bookingResult = await createConsultationBooking({
        consultation_id: bookingData.consultation_id,
        booking_date: bookingData.booking_date,
        time_slot_id: bookingData.time_slot_id,
        notes: bookingData.notes || '',
        use_points: usePoints,
      });
      
      if (!bookingResult.success) {
        // التحقق من نوع الخطأ
        const errorMessage = bookingResult.message || t('dashboard.consultation.error');
        const isInsufficientPoints = errorMessage.toLowerCase().includes('نقاط') || 
                                     errorMessage.toLowerCase().includes('points') ||
                                     errorMessage.toLowerCase().includes('insufficient') ||
                                     errorMessage.toLowerCase().includes('غير كافية') ||
                                     (bookingResult.data && bookingResult.data.error && 
                                      (bookingResult.data.error.toLowerCase().includes('points') || 
                                       bookingResult.data.error.toLowerCase().includes('نقاط')));
        
        setIsSubmitting(false);
        
        if (isInsufficientPoints) {
          // عرض نافذة عدم كفاية النقاط مع خيار للذهاب إلى المحفظة
          const result = await Swal.fire({
            icon: 'warning',
            title: t('dashboard.consultation.result.insufficientPoints.title'),
            html: `
              <div style="text-align: ${isRTL ? 'right' : 'left'}; direction: ${isRTL ? 'rtl' : 'ltr'};" class="font-ElMessiri">
                <p class="text-gray-700 text-base mb-4">${t('dashboard.consultation.result.insufficientPoints.message')}</p>
              </div>
            `,
            showCancelButton: true,
            confirmButtonText: t('dashboard.consultation.result.insufficientPoints.goToWallet'),
            cancelButtonText: t('dashboard.consultation.result.insufficientPoints.cancel'),
            confirmButtonColor: '#00adb5',
            cancelButtonColor: '#6b7280',
            customClass: {
              popup: 'font-ElMessiri',
            },
            allowOutsideClick: true,
            allowEscapeKey: true,
          });
          
          if (result.isConfirmed) {
            // إغلاق نافذة الحجز والذهاب إلى المحفظة
            onClose();
            navigate('/admin/wallet');
          }
        } else {
          // عرض نافذة خطأ عادية
          await Swal.fire({
            icon: 'error',
            title: t('dashboard.consultation.result.error.title'),
            html: `
              <div style="text-align: ${isRTL ? 'right' : 'left'}; direction: ${isRTL ? 'rtl' : 'ltr'};" class="font-ElMessiri">
                <p class="text-gray-700 text-base">${errorMessage}</p>
              </div>
            `,
            confirmButtonText: t('dashboard.consultation.result.error.ok'),
            confirmButtonColor: '#dc2626',
            customClass: {
              popup: 'font-ElMessiri',
            },
          });
        }
        return;
      }

      console.log("Consultation booking created:", bookingResult.data);
      
      // إعادة تعيين حالة الإرسال قبل عرض النافذة
      setIsSubmitting(false);
      
      // حساب السعر
      const consultationPrice = consultation.price || parseFloat(consultation.fixed_price || '0');
      
      // استخراج payment_url من الرد
      const paymentUrl = bookingResult.data?.payment_url || bookingResult.data?.data?.payment_url;
      
      // إذا كان المستخدم يستخدم النقاط، تحديث المحفظة
      if (usePoints) {
        const requiredPoints = Math.ceil(consultationPrice * pointsPerRiyal);
        // تحديث النقاط في المحفظة المحلية
        setWalletBalance(prev => Math.max(0, prev - requiredPoints));
        
        // إرسال event لتحديث النقاط في الـ header
        window.dispatchEvent(new CustomEvent('wallet-updated'));
      }
      
      // عرض نافذة نجاح الحجز
      if (usePoints && !paymentUrl) {
        // الدفع تم بالنقاط مباشرة
        await Swal.fire({
          icon: 'info',
          title: t('dashboard.consultation.result.success.title'),
          html: `
            <div style="text-align: ${isRTL ? 'right' : 'left'}; direction: ${isRTL ? 'rtl' : 'ltr'};" class="font-ElMessiri">
              <p class="text-gray-700 text-base mb-4">${t('dashboard.consultation.result.success.message')}</p>
              <div class="bg-green-50 ${isRTL ? 'border-r-4' : 'border-l-4'} border-green-400 p-4 rounded-lg">
                <p class="text-green-800 text-sm font-semibold">${t('dashboard.wallet.pointsPayment')}</p>
                <p class="text-green-700 text-sm mt-2">${t('dashboard.wallet.pointsUsed')} ${Math.ceil(consultationPrice * pointsPerRiyal).toLocaleString()} ${t('dashboard.wallet.point')}</p>
              </div>
            </div>
          `,
          confirmButtonText: t('dashboard.consultation.result.success.ok'),
          confirmButtonColor: '#00adb5',
          customClass: {
            popup: 'font-ElMessiri',
          },
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        
        // إغلاق النافذة بعد النجاح
        onClose();
      } else if (paymentUrl) {
        // الدفع بالفيزا أو جزء من المبلغ بالفيزا
        const successResult = await Swal.fire({
          icon: 'info',
          title: t('dashboard.consultation.result.success.title'),
          html: `
            <div style="text-align: ${isRTL ? 'right' : 'left'}; direction: ${isRTL ? 'rtl' : 'ltr'};" class="font-ElMessiri">
              <p class="text-gray-700 text-base mb-4">${t('dashboard.consultation.redirectToPayment')}</p>
              ${usePoints ? `
                <div class="bg-blue-50 ${isRTL ? 'border-r-4' : 'border-l-4'} border-blue-400 p-4 rounded-lg mb-4">
                  <p class="text-blue-800 text-sm font-semibold">${t('dashboard.wallet.pointsUsed')} ${Math.ceil(consultationPrice * pointsPerRiyal).toLocaleString()} ${t('dashboard.wallet.point')}</p>
                  <p class="text-blue-700 text-sm mt-2">${t('dashboard.wallet.remainingAmount')} ${(consultationPrice - (Math.min(walletBalance, Math.ceil(consultationPrice * pointsPerRiyal)) / pointsPerRiyal)).toFixed(2)} ${t('dashboard.stats.currency')}</p>
                </div>
              ` : ''}
            </div>
          `,
          confirmButtonText: t('dashboard.consultation.continueToPayment'),
          confirmButtonColor: '#00adb5',
          showCancelButton: true,
          cancelButtonText: t('dashboard.booking.cancel'),
          cancelButtonColor: '#dc2626',
          customClass: {
            popup: 'font-ElMessiri',
          },
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        
        if (successResult.isConfirmed) {
          // توجيه المستخدم إلى صفحة الدفع
          window.location.href = paymentUrl;
        } else {
          // إغلاق النافذة إذا ألغى المستخدم
          onClose();
        }
      } else {
        // نجاح بدون payment_url (دفع كامل بالنقاط)
        await Swal.fire({
          icon: 'success',
          title: t('dashboard.consultation.result.success.title'),
          html: `
            <div style="text-align: ${isRTL ? 'right' : 'left'}; direction: ${isRTL ? 'rtl' : 'ltr'};" class="font-ElMessiri">
              <p class="text-gray-700 text-base mb-4">${t('dashboard.consultation.result.success.message')}</p>
            </div>
          `,
          confirmButtonText: t('dashboard.consultation.result.success.ok'),
          confirmButtonColor: '#00adb5',
          customClass: {
            popup: 'font-ElMessiri',
          },
        });
        
        // إغلاق النافذة بعد النجاح
        onClose();
      }
    } catch (error: any) {
      console.error("Consultation booking submission error:", error);
      setIsSubmitting(false);
      await Swal.fire({
        icon: 'error',
        title: t('dashboard.consultation.result.error.title'),
        html: `
          <div style="text-align: ${isRTL ? 'right' : 'left'}; direction: ${isRTL ? 'rtl' : 'ltr'};" class="font-ElMessiri">
            <p class="text-gray-700 text-base">${error.message || t('dashboard.consultation.result.error.message')}</p>
          </div>
        `,
        confirmButtonText: t('dashboard.consultation.result.error.ok'),
        confirmButtonColor: '#dc2626',
        customClass: {
          popup: 'font-ElMessiri',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ======= Select Time Slot (واحد فقط) =======
  const selectTimeSlot = (timeSlot: TimeSlot) => {
    const slotId = timeSlot.id || (timeSlot as any).time_slot_id;
    
    if (!timeSlot.is_available || !slotId) return;

    // إذا كان نفس الوقت محدد، قم بإلغاء التحديد
    if (selectedTimeSlotId === slotId) {
      setSelectedTimeSlotId(null);
    } else {
      // حدد الوقت الجديد (سيتم إلغاء التحديد السابق تلقائياً)
      setSelectedTimeSlotId(slotId);
    }
  };

  const isTimeSlotSelected = (timeSlot: TimeSlot) => {
    const slotId = timeSlot.id || (timeSlot as any).time_slot_id;
    return slotId ? selectedTimeSlotId === slotId : false;
  };

  const isToday = (date: AvailableDate) => {
    const today = new Date().toISOString().split("T")[0];
    return date.date === today || date.formatted_date === today;
  };

  const getFutureTimeSlots = (timeSlots: TimeSlot[], date: AvailableDate) => {
    if (!timeSlots || timeSlots.length === 0) return [];

    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const isSelectedToday = (date.date || date.formatted_date) === today;

    if (!isSelectedToday) return timeSlots;

    const [currentHour, currentMinute] = now
      .toTimeString()
      .slice(0, 5)
      .split(":")
      .map(Number);
    const currentMinutes = currentHour * 60 + currentMinute;

    return timeSlots.filter((slot) => {
      if (!slot.start_time) return false;
      const [slotHour, slotMinute] = slot.start_time.split(":").map(Number);
      return slotHour * 60 + slotMinute > currentMinutes;
    });
  };

  const selectedDay = availableDates[selectedDayIndex];
  
  const validFutureTimeSlots =
    selectedDay && selectedDay.time_slots
      ? getFutureTimeSlots(selectedDay.time_slots, selectedDay)
          .filter(timeSlot => {
            const slotId = timeSlot.id || (timeSlot as any).time_slot_id;
            return slotId !== null && slotId !== undefined;
          })
      : [];

  const sliderSettings = {
    rtl: isRTL,
    infinite: false,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true,
    centerMode: true,
    centerPadding: "0px",
    beforeChange: (_current: number, next: number) => {
      if (!isManualSelection.current) setSelectedDayIndex(next);
    },
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    swipe: true,
    swipeToSlide: true,
    draggable: true,
    touchMove: true,
    touchThreshold: 5,
    speed: 300,
    easing: "ease-in-out",
    cssEase: "ease-in-out",
    useCSS: true,
    useTransform: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 640, settings: { slidesToShow: 2 } },
    ],
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={`relative rounded-3xl w-[90%]  h-[90vh] p-8 overflow-y-auto shadow-2xl ${
        isDarkMode ? 'bg-slate-800' : 'bg-white'
      }`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-6 ${isRTL ? 'left-6' : 'right-6'} hover:text-red-500 text-2xl w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 z-30 ${
            isDarkMode 
              ? 'text-slate-400 hover:bg-red-900/30' 
              : 'text-gray-400 hover:bg-red-50'
          }`}
        >
          ✕
        </button>

        {/* Header */}
        <div className={`mb-8 pb-6 border-b ${
          isDarkMode ? 'border-slate-700' : 'border-gray-200'
        }`}>
          <h2 className={`text-3xl md:text-4xl font-bold mb-2 ${textAlign} ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {t('dashboard.consultation.title')}
          </h2>
          <p className={`text-lg text-primary font-semibold ${textAlign}`}>
            {consultation.name}
          </p>
        </div>

        {/* Loading or No Dates */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : availableDates.length === 0 ? (
          <div className="text-center py-20">
            <p className={`text-lg ${
              isDarkMode ? 'text-slate-400' : 'text-gray-500'
            }`}>
              {t('dashboard.consultation.noDates')}
            </p>
          </div>
        ) : (
          <>
            {/* Days Slider */}
            <div className="mb-10">
              <h3 className={`text-xl font-bold mb-6 ${textAlign} ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                {t('dashboard.consultation.selectDay')}
              </h3>
              <div className="px-14 h-80 flex flex-col justify-center ">
                <Slider ref={sliderRef} {...sliderSettings}>
                  {availableDates.map((date, index) => {
                    const active = selectedDayIndex === index;
                    return (
                      <div key={index} className="px-2 py-8">
                        <button
                          onClick={() => {
                            isManualSelection.current = true;
                            setSelectedDayIndex(index);
                            sliderRef.current?.slickGoTo(index);
                            setTimeout(() => {
                              isManualSelection.current = false;
                            }, 500);
                          }}
                          className={`group relative w-full rounded-[2rem] transition-all duration-500 ease-out flex flex-col justify-center items-center gap-2 overflow-hidden ${
                            active
                              ? "h-40 bg-primary text-white shadow-sm shadow-primary/40 scale-110 z-10"
                              : isDarkMode
                                ? "h-32 bg-slate-700 text-slate-400 border border-slate-600 hover:border-slate-500 hover:shadow-lg scale-90 opacity-60 hover:opacity-100 mt-5"
                                : "h-32 bg-white text-gray-400 border border-gray-800 hover:border-gray-200 hover:shadow-lg scale-90 opacity-60 hover:opacity-100 mt-5"
                          }`}
                        >
                          {active && (
                            <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dark opacity-100" />
                          )}
                          <div className="relative z-10 flex flex-col items-center">
                            <span
                              className={`text-4xl font-medium ${
                                active
                                  ? "text-white/90"
                                  : isDarkMode
                                    ? "text-white group-hover:text-primary transition-colors"
                                    : "text-gray-800 group-hover:text-primary transition-colors"
                              }`}
                            >
                              {date.day_name}
                            </span>
                            <span
                              className={`text-xl ${
                                active ? "text-white/75" : isDarkMode ? "text-slate-300" : "text-gray-800"
                              }`}
                            >
                              {date.formatted_date}
                            </span>
                            {isToday(date) && (
                              <span
                                className={`mt-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  active
                                    ? "bg-white/20 text-white backdrop-blur-sm"
                                    : "bg-primary/10 text-primary"
                                }`}
                              >
                                {t('dashboard.consultation.today')}
                              </span>
                            )}
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </Slider>
              </div>
            </div>

            {/* Time Slots Section */}
            {selectedDay && (
              <>
                <div className="mb-6">
                  <h3 className={`text-xl font-bold mb-2 ${textAlign} ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    {t('dashboard.consultation.selectTime')}
                  </h3>
                  <p className={`text-sm ${textAlign} mb-4 ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-500'
                  }`}>
                    {t('dashboard.consultation.selectTimeSlot')}
                  </p>
                </div>

                {validFutureTimeSlots.length === 0 ? (
                  <div className={`text-center py-12 rounded-2xl border-2 border-dashed ${
                    isDarkMode 
                      ? 'bg-slate-700 border-slate-600' 
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    <p className={`text-lg font-medium ${
                      isDarkMode ? 'text-slate-400' : 'text-gray-500'
                    }`}>
                      {t('dashboard.consultation.noTimeSlots')}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <p className={`text-sm ${textAlign} ${
                        isDarkMode ? 'text-slate-400' : 'text-gray-500'
                      }`}>
                        {t('dashboard.consultation.availableTimes', { date: selectedDay.formatted_date })}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
                      {validFutureTimeSlots.map((timeSlot) => {
                        const isSelected = isTimeSlotSelected(timeSlot);
                        const slotId = timeSlot.id || (timeSlot as any).time_slot_id;
                        const uniqueKey = `timeSlot-${slotId}-${timeSlot.start_time}-${timeSlot.end_time}`;
                        
                        return (
                          <button
                            key={uniqueKey}
                            onClick={() => selectTimeSlot(timeSlot)}
                            disabled={!timeSlot.is_available}
                            className={`
                              relative overflow-hidden group flex flex-col items-center justify-center py-3 px-4 rounded-2xl border transition-all duration-300
                              ${
                                isSelected
                                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/25 scale-[1.02] ring-2 ring-primary/20"
                                  : isDarkMode
                                    ? "bg-slate-700 text-slate-300 border-slate-600 hover:border-primary/50 hover:bg-primary/10 hover:shadow-md"
                                    : "bg-white text-gray-600 border-gray-100 hover:border-primary/50 hover:bg-primary/5 hover:shadow-md"
                              }
                              ${
                                !timeSlot.is_available
                                  ? isDarkMode
                                    ? "opacity-40 cursor-not-allowed bg-slate-800"
                                    : "opacity-40 cursor-not-allowed bg-gray-50"
                                  : "cursor-pointer"
                              }
                            `}
                          >
                            <span
                              className={`text-xl font-bold tracking-wide ${
                                isSelected ? "text-white" : isDarkMode ? "text-white" : "text-gray-800"
                              }`}
                            >
                              {timeSlot.start_time}
                            </span>
                            <span
                              className={`text-xl mt-0.5 font-medium ${
                                isSelected ? "text-white/80" : isDarkMode ? "text-slate-400" : "text-gray-400"
                              }`}
                            >
                              {t('dashboard.consultation.to')} {timeSlot.end_time}
                            </span>
                            {isSelected && (
                              <div className={`absolute top-2 ${isRTL ? 'right-2' : 'left-2'} w-1.5 h-1.5 rounded-full bg-white shadow-sm`} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* Use Points Section */}
                {walletBalance > 0 && selectedTimeSlotId && (
                  <div className={`mt-8 pt-6 border-t ${
                    isDarkMode ? 'border-slate-700' : 'border-gray-200'
                  }`}>
                    <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      usePoints 
                        ? isDarkMode 
                          ? 'bg-primary/10 border-primary/30' 
                          : 'bg-primary/5 border-primary/20'
                        : isDarkMode
                          ? 'bg-slate-700/50 border-slate-600'
                          : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className={`flex items-center justify-between mb-4 ${flexDirection}`}>
                        <div className={`flex items-center gap-3 ${flexDirection}`}>
                          <Coins className={`w-6 h-6 ${usePoints ? 'text-primary' : isDarkMode ? 'text-slate-400' : 'text-gray-500'}`} />
                          <div>
                            <h3 className={`text-lg font-bold ${textAlign} ${
                              isDarkMode ? 'text-white' : 'text-gray-800'
                            }`}>
                              {t('dashboard.wallet.useYourPoints')}
                            </h3>
                            <p className={`text-sm ${textAlign} ${
                              isDarkMode ? 'text-slate-400' : 'text-gray-600'
                            }`}>
                              {t('dashboard.wallet.yourBalance')} <span className="font-bold text-primary">{walletBalance.toLocaleString()}</span> {t('dashboard.wallet.point')}
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={usePoints}
                            onChange={(e) => setUsePoints(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className={`relative w-14 h-7 rounded-full peer transition-colors duration-300 ${
                            usePoints ? 'bg-primary' : isDarkMode ? 'bg-slate-600' : 'bg-gray-300'
                          }`}>
                            <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                              usePoints ? 'translate-x-7' : 'translate-x-0'
                            }`} />
                          </div>
                        </label>
                      </div>
                      
                      {usePoints && (() => {
                        // حساب السعر والنقاط
                        const consultationPrice = consultation.price || parseFloat(consultation.fixed_price || '0');
                        const originalPrice = consultationPrice;
                        const pointsDiscountInRiyal = walletBalance / pointsPerRiyal;
                        const maxDiscount = Math.min(pointsDiscountInRiyal, originalPrice);
                        const pointsToUse = Math.min(walletBalance, Math.floor(originalPrice * pointsPerRiyal));
                        const finalPriceWithPoints = Math.max(0, originalPrice - maxDiscount);
                        
                        return (
                          <div className="mt-4 pt-4 border-t border-primary/20 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className={`flex items-center justify-between ${flexDirection}`}>
                              <span className={`text-sm ${textAlign} ${
                                isDarkMode ? 'text-slate-300' : 'text-gray-700'
                              }`}>
                                {t('dashboard.wallet.originalPrice')}
                              </span>
                              <span className={`text-base font-bold ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                {originalPrice.toFixed(2)} {t('dashboard.stats.currency')}
                              </span>
                            </div>
                            <div className={`flex items-center justify-between ${flexDirection}`}>
                              <span className={`text-sm ${textAlign} ${
                                isDarkMode ? 'text-slate-300' : 'text-gray-700'
                              }`}>
                                {t('dashboard.wallet.pointsUsed')}
                              </span>
                              <span className="text-base font-bold text-primary">
                                - {pointsToUse.toLocaleString()} {t('dashboard.wallet.point')}
                              </span>
                            </div>
                            <div className={`flex items-center justify-between pt-2 border-t border-primary/20 ${flexDirection}`}>
                              <span className={`text-base font-bold ${textAlign} ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                {t('dashboard.wallet.finalPrice')}
                              </span>
                              <span className="text-xl font-black text-primary">
                                {finalPriceWithPoints.toFixed(2)} {t('dashboard.stats.currency')}
                              </span>
                            </div>
                            {maxDiscount > 0 && (
                              <div className="mt-2 p-2 rounded-lg bg-green-50 border border-green-200">
                                <p className={`text-xs text-center text-green-700`}>
                                  {t('dashboard.wallet.savings')} {maxDiscount.toFixed(2)} {t('dashboard.stats.currency')}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* Notes Section */}
                <div className={`mt-8 pt-6 border-t ${
                  isDarkMode ? 'border-slate-700' : 'border-gray-200'
                }`}>
                  <label htmlFor="consultation-notes" className={`block ${textAlign} mb-3`}>
                    <h3 className={`text-xl font-bold mb-1 ${textAlign} ${
                      isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      {t('dashboard.consultation.notes')}
                    </h3>
                    <p className={`text-sm ${textAlign} ${
                      isDarkMode ? 'text-slate-400' : 'text-gray-500'
                    }`}>
                      {t('dashboard.consultation.notesPlaceholder')}
                    </p>
                  </label>
                  <textarea
                    id="consultation-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t('dashboard.consultation.notesPlaceholder')}
                    rows={4}
                    maxLength={500}
                    dir={isRTL ? 'rtl' : 'ltr'}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 resize-none ${textAlign} shadow-sm hover:shadow-md ${
                      isDarkMode 
                        ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' 
                        : 'bg-white border-gray-200 placeholder:text-gray-400'
                    }`}
                  />
                  <div className={`flex ${isRTL ? 'justify-end' : 'justify-start'} mt-2`}>
                    <span className={`text-xs ${
                      isDarkMode ? 'text-slate-400' : 'text-gray-400'
                    }`}>
                      {notes.length} / 500 {t('dashboard.consultation.characters')}
                    </span>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* زر التأكيد وأجزاء الإرسال */}
        <div className="mt-10">
          {submitError && (
            <div className={`mb-4 p-4 bg-red-50 border border-red-200 rounded-xl ${textAlign}`}>
              <p className="text-red-600 font-medium">{submitError}</p>
            </div>
          )}
          
          {submitSuccess && (
            <div className={`mb-4 p-4 bg-green-50 border border-green-200 rounded-xl ${textAlign}`}>
              <p className="text-green-600 font-medium">
                {t('dashboard.consultation.bookingSuccess')}
              </p>
            </div>
          )}

          {selectedTimeSlotId && bookingData && (
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={handleSubmitBooking}
                disabled={isSubmitting}
                className={`
                  px-10 py-4
                  rounded-2xl
                  text-white
                  text-lg
                  font-bold
                  shadow-lg
                  transition-all duration-300
                  active:scale-95
                  flex items-center justify-center gap-2
                  ${isSubmitting 
                    ? 'bg-primary/70 cursor-not-allowed' 
                    : 'bg-primary hover:bg-primary-dark shadow-primary/30'
                  }
                `}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t('dashboard.consultation.bookingInProgress')}
                  </>
                ) : (
                  t('dashboard.consultation.confirmBooking')
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultationPopup;

