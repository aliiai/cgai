import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { Loader2, ChevronRight, ChevronLeft, Coins, X } from "lucide-react";
import { getAvailableDates, createBooking, getWallet } from "../../storeApi/storeApi";
import Swal from "sweetalert2";
import type { Service, AvailableDate, TimeSlot } from "../../types/types";

interface ServicePopupProps {
  service: Service;
  onClose: () => void;
  onOpenConsultations?: () => void;
}

interface BookingData {
  service_id: number;
  booking_date: string;
  time_slot_ids: number[];
  notes: string;
  use_points?: boolean;
}

const ServicePopup = ({ service, onClose, onOpenConsultations }: ServicePopupProps) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  
  // تحديد الاتجاه بناءً على اللغة
  const isRTL = i18n.language === 'ar';
  const textAlign = isRTL ? 'text-right' : 'text-left';
  const flexDirection = isRTL ? 'flex-row' : 'flex-row-reverse';

  const PrevArrow = ({ onClick }: any) => (
    <button
      onClick={onClick}
      className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white border border-[#114C5A]/20 rounded-full shadow-sm flex items-center justify-center hover:bg-[#114C5A] hover:text-white hover:border-[#114C5A] transition-all duration-300 group"
      aria-label={t('dashboard.booking.previousDay')}
      type="button"
    >
      <ChevronLeft className="w-5 h-5 text-[#114C5A] group-hover:text-white transition-colors" />
    </button>
  );

  const NextArrow = ({ onClick }: any) => (
    <button
      onClick={onClick}
      className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white border border-[#114C5A]/20 rounded-full shadow-sm flex items-center justify-center hover:bg-[#114C5A] hover:text-white hover:border-[#114C5A] transition-all duration-300 group"
      aria-label={t('dashboard.booking.nextDay')}
      type="button"
    >
      <ChevronRight className="w-5 h-5 text-[#114C5A] group-hover:text-white transition-colors" />
    </button>
  );
  const [availableDates, setAvailableDates] = useState<AvailableDate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedTimeSlotIds, setSelectedTimeSlotIds] = useState<number[]>([]);
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
        const result = await getAvailableDates(service.id);
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
  }, [service.id]);

  // تحديث bookingData عند تغيير selectedTimeSlotIds أو selectedDayIndex أو notes أو usePoints
  useEffect(() => {
    if (availableDates.length === 0 || selectedDayIndex < 0 || selectedDayIndex >= availableDates.length) {
      setBookingData(null);
      return;
    }
    
    const selectedDate = availableDates[selectedDayIndex];
    if (selectedDate) {
      const newBookingData = {
        service_id: service.id,
        booking_date: selectedDate.date,
        time_slot_ids: selectedTimeSlotIds,
        notes,
        use_points: usePoints,
      };
      
      // تحديث فقط إذا تغيرت البيانات
      setBookingData(prev => {
        if (prev && 
            prev.service_id === newBookingData.service_id &&
            prev.booking_date === newBookingData.booking_date &&
            JSON.stringify(prev.time_slot_ids) === JSON.stringify(newBookingData.time_slot_ids) &&
            prev.notes === newBookingData.notes &&
            prev.use_points === newBookingData.use_points) {
          return prev;
        }
        return newBookingData;
      });
    } else {
      setBookingData(null);
    }
  }, [selectedTimeSlotIds, selectedDayIndex, availableDates.length, service.id, notes, usePoints]);

  // إعادة تعيين الأوقات عند تغيير اليوم
  useEffect(() => {
    setSelectedTimeSlotIds([]);
    setNotes("");
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
    if (!service || !service.id) {
      setSubmitError(t('dashboard.consultation.selectServiceFirst'));
      return;
    }

    // التحقق من أن bookingData موجود
    if (!bookingData) {
      setSubmitError(t('dashboard.consultation.bookingDataError'));
      return;
    }

    // التحقق من أن service_id موجود
    if (!bookingData.service_id) {
      setSubmitError(t('dashboard.consultation.selectServiceFirst'));
      return;
    }

    // التحقق من أن اليوم محدد
    if (!bookingData.booking_date) {
      setSubmitError(t('dashboard.consultation.selectDayFirst'));
      return;
    }

    // التحقق من اختيار وقت واحد على الأقل
    if (!bookingData.time_slot_ids || bookingData.time_slot_ids.length === 0) {
      setSubmitError(t('dashboard.booking.selectAtLeastOne'));
      return;
    }

    // حساب السعر والنقاط المطلوبة
    // استخدام service.price أولاً، ثم service.durations[0].price، ثم service.points_price
    let servicePrice = 100; // سعر افتراضي
    if (service.price) {
      servicePrice = parseFloat(String(service.price));
    } else if (service.durations && service.durations.length > 0 && service.durations[0].price) {
      servicePrice = parseFloat(String(service.durations[0].price));
    } else if (service.points_price) {
      // إذا لم يكن هناك سعر، استخدم points_price ولكن نحوله إلى ريال
      servicePrice = parseFloat(String(service.points_price)) / pointsPerRiyal;
    }
    const totalPrice = servicePrice * bookingData.time_slot_ids.length;

    // إذا كان المستخدم يريد استخدام النقاط، تحقق من كفايتها
    if (usePoints) {
      const requiredPoints = Math.ceil(totalPrice * pointsPerRiyal);
      
      // التحقق من كفاية النقاط
      if (walletBalance < requiredPoints) {
        const result = await Swal.fire({
          icon: 'warning',
          title: t('dashboard.booking.result.insufficientPoints.title'),
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
          cancelButtonText: t('dashboard.booking.result.insufficientPoints.cancel'),
          confirmButtonColor: '#114C5A',
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

    // عرض تحذير أخير قبل إنشاء الحجز
    const warningConfirm = await Swal.fire({
      icon: 'warning',
      title: t('dashboard.booking.warning.title'),
      html: `
        <div style="text-align: ${isRTL ? 'right' : 'left'}; direction: ${isRTL ? 'rtl' : 'ltr'};">
          <p class="text-gray-700 text-base mb-4 leading-relaxed">
            ${t('dashboard.booking.warning.message')}
          </p>
          <div class="bg-amber-50 ${isRTL ? 'border-r-4' : 'border-l-4'} border-amber-400 p-4 rounded-lg mb-4">
            <p class="text-amber-800 text-sm font-semibold">
              ${t('dashboard.consultation.consultationHelps')}
            </p>
            <ul class="text-amber-700 text-sm mt-2 space-y-1 ${isRTL ? 'list-disc' : 'list-disc'} ${isRTL ? 'list-inside' : 'list-outside'}">
              <li>${t('dashboard.consultation.identifyNeeds')}</li>
              <li>${t('dashboard.consultation.chooseServices')}</li>
              <li>${t('dashboard.consultation.saveTimeMoney')}</li>
            </ul>
          </div>
        </div>
      `,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: t('dashboard.booking.warning.continue'),
      denyButtonText: t('dashboard.booking.warning.bookConsultation'),
      cancelButtonText: t('dashboard.booking.warning.cancel'),
      confirmButtonColor: '#114C5A',
      denyButtonColor: '#FFB200',
      cancelButtonColor: '#dc2626',
      customClass: {
        popup: 'font-ElMessiri',
      },
      reverseButtons: true,
      allowOutsideClick: true,
      allowEscapeKey: true,
      didClose: () => {
        // تنظيف أي عناصر متبقية
        setTimeout(() => {
          const container = document.querySelector('.swal2-container');
          if (container) {
            container.remove();
          }
        }, 100);
      },
    });

    // إذا اختار المستخدم حجز استشارة
    if (warningConfirm.isDenied) {
      Swal.close();
      if (onOpenConsultations) {
        onClose();
        onOpenConsultations();
      }
      return;
    }

    // إذا ألغى المستخدم
    if (warningConfirm.isDismissed) {
      Swal.close();
      return;
    }

    // إذا اختار متابعة الحجز
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      console.log("Sending booking data:", bookingData);
      
      // الخطوة 1: إنشاء حجز مؤقت (pending) - الحجز لا يتم تأكيده إلا بعد الدفع
      const bookingResult = await createBooking(bookingData);
      
      if (!bookingResult.success) {
        // التحقق من نوع الخطأ
        const errorMessage = bookingResult.message || t('dashboard.booking.error');
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
            title: t('dashboard.booking.result.insufficientPoints.title'),
            html: `
              <div style="text-align: ${isRTL ? 'right' : 'left'}; direction: ${isRTL ? 'rtl' : 'ltr'};" class="font-ElMessiri">
                <p class="text-gray-700 text-base mb-4">${t('dashboard.booking.result.insufficientPoints.message')}</p>
              </div>
            `,
            showCancelButton: true,
            confirmButtonText: t('dashboard.booking.result.insufficientPoints.goToWallet'),
            cancelButtonText: t('dashboard.booking.result.insufficientPoints.cancel'),
            confirmButtonColor: '#114C5A',
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
            title: t('dashboard.booking.result.error.title'),
            html: `
              <div style="text-align: ${isRTL ? 'right' : 'left'}; direction: ${isRTL ? 'rtl' : 'ltr'};" class="font-ElMessiri">
                <p class="text-gray-700 text-base">${errorMessage}</p>
              </div>
            `,
            confirmButtonText: t('dashboard.booking.result.error.ok'),
            confirmButtonColor: '#dc2626',
            customClass: {
              popup: 'font-ElMessiri',
            },
          });
        }
        return;
      }

      console.log("Booking created:", bookingResult.data);
      
      // إعادة تعيين حالة الإرسال قبل عرض النافذة
      setIsSubmitting(false);
      
      // استخراج payment_url من الرد
      const paymentUrl = bookingResult.data?.payment_url || bookingResult.data?.data?.payment_url;
      
      // استخراج معلومات الدفع من الرد - التحقق من جميع المسارات المحتملة
      const booking = bookingResult.data?.booking || bookingResult.data?.data?.booking;
      const paymentMethod = booking?.payment_method || bookingResult.data?.payment_method;
      const paymentStatus = booking?.payment_status || bookingResult.data?.payment_status;
      const pointsUsed = booking?.points_used || bookingResult.data?.points_used;
      
      // بناءً على البيانات الفعلية من الـ response:
      // - payment_method = "points" في data.booking.payment_method
      // - payment_status = "paid" في data.booking.payment_status
      // - لا يوجد payment_url عند الدفع بالنقاط
      
      const hasPaymentUrl = paymentUrl && paymentUrl !== null && paymentUrl !== '';
      const isPointsPayment = paymentMethod === 'points';
      const isPaid = paymentStatus === 'paid' || paymentStatus === 'confirmed';
      
      // الشرط المنطقي بناءً على البيانات الفعلية:
      // 1. إذا payment_method = 'points' و payment_status = 'paid' → عرض النافذة
      // 2. أو إذا usePoints مفعّل وليس هناك paymentUrl → عرض النافذة
      const condition1 = isPointsPayment && isPaid; // الشرط الأساسي من البيانات
      const condition2 = usePoints && !hasPaymentUrl; // الشرط الاحتياطي
      
      const showSuccessDialog = condition1 || condition2;
      
      console.log("=== BOOKING SUCCESS CHECK ===");
      console.log("usePoints:", usePoints);
      console.log("paymentUrl:", paymentUrl);
      console.log("hasPaymentUrl:", hasPaymentUrl);
      console.log("paymentMethod:", paymentMethod);
      console.log("paymentStatus:", paymentStatus);
      console.log("isPointsPayment:", isPointsPayment);
      console.log("isPaid:", isPaid);
      console.log("condition1 (points && paid):", condition1);
      console.log("condition2 (usePoints && !hasPaymentUrl):", condition2);
      console.log("showSuccessDialog:", showSuccessDialog);
      console.log("booking object:", booking);
      console.log("Full bookingResult.data:", bookingResult.data);
      console.log("=============================");
      
      // إذا كان المستخدم يستخدم النقاط، تحديث المحفظة
      if (usePoints) {
        const requiredPoints = pointsUsed ? parseFloat(pointsUsed) : Math.ceil(totalPrice * pointsPerRiyal);
        // تحديث النقاط في المحفظة المحلية
        setWalletBalance(prev => Math.max(0, prev - requiredPoints));
        
        // إرسال event لتحديث النقاط في الـ header
        window.dispatchEvent(new CustomEvent('wallet-updated'));
      }
      
      // عرض نافذة نجاح الحجز - الشرط البسيط
      if (showSuccessDialog) {
        console.log("✅ SHOWING SUCCESS DIALOG FOR POINTS PAYMENT");
        // الدفع تم بالنقاط مباشرة
        const pointsUsedValue = pointsUsed ? parseFloat(pointsUsed) : Math.ceil(totalPrice * pointsPerRiyal);
        
        await Swal.fire({
          icon: 'success',
          title: t('dashboard.booking.result.success.title'),
          html: `
            <div style="text-align: ${isRTL ? 'right' : 'left'}; direction: ${isRTL ? 'rtl' : 'ltr'};" class="font-ElMessiri">
              <p class="text-gray-700 text-base mb-4">${t('dashboard.booking.result.success.message')}</p>
              <div class="bg-green-50 ${isRTL ? 'border-r-4' : 'border-l-4'} border-green-400 p-4 rounded-lg">
                <p class="text-green-800 text-sm font-semibold">${t('dashboard.wallet.pointsPayment')}</p>
                <p class="text-green-700 text-sm mt-2">${t('dashboard.wallet.pointsUsed')} ${pointsUsedValue.toLocaleString()} ${t('dashboard.wallet.point')}</p>
              </div>
            </div>
          `,
          confirmButtonText: t('dashboard.booking.result.success.ok'),
          confirmButtonColor: '#114C5A',
          customClass: {
            popup: 'font-ElMessiri',
          },
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        
        console.log("✅ SUCCESS DIALOG SHOWN AND CLOSED");
        
        // إغلاق النافذة بعد النجاح
        onClose();
      } else if (paymentUrl) {
        // الدفع بالفيزا أو جزء من المبلغ بالفيزا - الحجز لم يتم بعد، يحتاج دفع
        const successResult = await Swal.fire({
          icon: 'info',
          title: t('dashboard.booking.pendingPayment.title'),
          html: `
            <div style="text-align: ${isRTL ? 'right' : 'left'}; direction: ${isRTL ? 'rtl' : 'ltr'};" class="font-ElMessiri">
              <p class="text-gray-700 text-base mb-4">${t('dashboard.booking.pendingPayment.message')}</p>
              ${usePoints ? `
                <div class="bg-blue-50 ${isRTL ? 'border-r-4' : 'border-l-4'} border-blue-400 p-4 rounded-lg mb-4">
                  <p class="text-blue-800 text-sm font-semibold">${t('dashboard.wallet.pointsUsed')} ${Math.ceil(totalPrice * pointsPerRiyal).toLocaleString()} ${t('dashboard.wallet.point')}</p>
                  <p class="text-blue-700 text-sm mt-2">${t('dashboard.wallet.remainingAmount')} ${(totalPrice - (Math.min(walletBalance, Math.ceil(totalPrice * pointsPerRiyal)) / pointsPerRiyal)).toFixed(2)} ${t('dashboard.stats.currency')}</p>
                </div>
              ` : ''}
            </div>
          `,
          confirmButtonText: t('dashboard.booking.pendingPayment.continue'),
          confirmButtonColor: '#114C5A',
          showCancelButton: true,
          cancelButtonText: t('dashboard.booking.pendingPayment.cancel'),
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
          title: t('dashboard.booking.result.success.title'),
          html: `
            <div style="text-align: ${isRTL ? 'right' : 'left'}; direction: ${isRTL ? 'rtl' : 'ltr'};" class="font-ElMessiri">
              <p class="text-gray-700 text-base mb-4">${t('dashboard.booking.result.success.message')}</p>
            </div>
          `,
          confirmButtonText: t('dashboard.booking.result.success.ok'),
          confirmButtonColor: '#114C5A',
          customClass: {
            popup: 'font-ElMessiri',
          },
        });
        
        // إغلاق النافذة بعد النجاح
        onClose();
      }
    } catch (error: any) {
      console.error("Booking submission error:", error);
      setIsSubmitting(false);
      await Swal.fire({
        icon: 'error',
        title: t('dashboard.booking.result.error.title'),
        html: `
          <div style="text-align: ${isRTL ? 'right' : 'left'}; direction: ${isRTL ? 'rtl' : 'ltr'};" class="font-ElMessiri">
            <p class="text-gray-700 text-base">${error.message || t('dashboard.booking.result.error.message')}</p>
          </div>
        `,
        confirmButtonText: t('dashboard.booking.result.error.ok'),
        confirmButtonColor: '#dc2626',
        customClass: {
          popup: 'font-ElMessiri',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ======= Toggle Time Slot =======
  const toggleTimeSlot = (timeSlot: TimeSlot) => {
    // استخدم id إذا كان موجوداً، أو time_slot_id من البيانات
    const slotId = timeSlot.id || (timeSlot as any).time_slot_id;
    
    if (!timeSlot.is_available || !slotId) return;

    console.log("Toggling time slot ID:", slotId);

    setSelectedTimeSlotIds((prev) => {
      const newIds = prev.includes(slotId!)
        ? prev.filter((id) => id !== slotId!)
        : [...prev, slotId!];
      
      console.log("Updated IDs array:", newIds);
      return newIds;
    });
  };

  const isTimeSlotSelected = (timeSlot: TimeSlot) => {
    const slotId = timeSlot.id || (timeSlot as any).time_slot_id;
    return slotId ? selectedTimeSlotIds.includes(slotId) : false;
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
  
  // تصفية الأوقات التي لديها id أو time_slot_id (وليس null)
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
    slidesToShow: 3,
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
      <div className="relative rounded-xl w-[90%] max-w-6xl h-[90vh] p-6 overflow-y-auto shadow-2xl bg-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-6 ${isRTL ? 'left-6' : 'right-6'} text-gray-400 hover:text-red-500 w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-50 transition-all duration-200 z-30`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6 pb-6 border-b border-[#114C5A]/10">
          <h2 className={`text-2xl md:text-3xl font-bold mb-2 text-[#114C5A] ${textAlign}`}>
            {t('dashboard.services.book')}
          </h2>
          <p className={`text-lg text-[#114C5A] font-semibold ${textAlign}`}>
            {service.name}
          </p>
        </div>

        {/* Loading or No Dates */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#114C5A] animate-spin" />
          </div>
        ) : availableDates.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-gray-600">
              {t('dashboard.booking.noDates')}
            </p>
          </div>
        ) : (
          <>
            {/* Days Slider */}
            <div className="mb-8">
              <h3 className={`text-xl font-semibold mb-6 text-[#114C5A] ${textAlign}`}>
                {t('dashboard.booking.selectDate')}
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
                          className={`group relative w-full rounded-xl transition-all duration-300 ease-out flex flex-col justify-center items-center gap-2 overflow-hidden ${
                            active
                              ? "h-36 bg-[#114C5A] text-white shadow-md shadow-[#114C5A]/30 scale-105 z-10"
                              : "h-32 bg-white text-gray-600 border border-[#114C5A]/20 hover:border-[#114C5A]/40 hover:shadow-md scale-95 opacity-70 hover:opacity-100 mt-4"
                          }`}
                        >
                          <div className="relative z-10 flex flex-col items-center">
                            <span
                              className={`text-3xl font-semibold ${
                                active
                                  ? "text-white"
                                  : "text-gray-800 group-hover:text-[#114C5A] transition-colors"
                              }`}
                            >
                              {date.day_name}
                            </span>
                            <span
                              className={`text-lg mt-1 ${
                                active ? "text-white/90" : "text-gray-600"
                              }`}
                            >
                              {date.formatted_date}
                            </span>
                            {isToday(date) && (
                              <span
                                className={`mt-2 px-3 py-1 rounded-lg text-xs font-medium ${
                                  active
                                    ? "bg-white/20 text-white"
                                    : "bg-[#114C5A]/10 text-[#114C5A]"
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
                  <h3 className={`text-xl font-semibold mb-2 text-[#114C5A] ${textAlign}`}>
                    {t('dashboard.booking.selectTime')}
                  </h3>
                  <p className={`text-sm text-gray-600 ${textAlign} mb-4`}>
                    {t('dashboard.booking.selectTime')}
                  </p>
                </div>

                {validFutureTimeSlots.length === 0 ? (
                  <div className="text-center py-12 rounded-xl border-2 border-dashed bg-gray-50 border-[#114C5A]/20">
                    <p className="text-lg font-medium text-gray-600">
                      {t('dashboard.booking.noTimeSlots')}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <p className={`text-sm text-gray-600 ${textAlign}`}>
                        {t('dashboard.consultation.availableTimes', { date: selectedDay.formatted_date })}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {validFutureTimeSlots.map((timeSlot) => {
                        const isSelected = isTimeSlotSelected(timeSlot);
                        const slotId = timeSlot.id || (timeSlot as any).time_slot_id;
                        const uniqueKey = `timeSlot-${slotId}-${timeSlot.start_time}-${timeSlot.end_time}`;
                        
                        return (
                          <button
                            key={uniqueKey}
                            onClick={() => toggleTimeSlot(timeSlot)}
                            disabled={!timeSlot.is_available}
                            className={`
                              relative overflow-hidden group flex flex-col items-center justify-center py-3 px-4 rounded-xl border transition-all duration-300
                              ${
                                isSelected
                                  ? "bg-[#114C5A] text-white border-[#114C5A] shadow-md shadow-[#114C5A]/25 scale-[1.02]"
                                  : "bg-white text-gray-700 border-[#114C5A]/20 hover:border-[#114C5A]/40 hover:bg-[#114C5A]/5 hover:shadow-sm"
                              }
                              ${
                                !timeSlot.is_available
                                  ? "opacity-40 cursor-not-allowed bg-gray-50"
                                  : "cursor-pointer"
                              }
                            `}
                          >
                            <span
                              className={`text-lg font-semibold ${
                                isSelected ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {timeSlot.start_time}
                            </span>
                            <span
                              className={`text-sm mt-0.5 ${
                                isSelected ? "text-white/90" : "text-gray-600"
                              }`}
                            >
                              {t('dashboard.consultation.to')} {timeSlot.end_time}
                            </span>
                            {isSelected && (
                              <div className={`absolute top-2 ${isRTL ? 'right-2' : 'left-2'} w-2 h-2 rounded-full bg-white shadow-sm`} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* Use Points Section */}
                {walletBalance > 0 && selectedTimeSlotIds.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-[#114C5A]/10">
                    <div className={`p-5 rounded-xl border-2 transition-all duration-300 ${
                      usePoints 
                        ? 'bg-[#114C5A]/5 border-[#114C5A]/20' 
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className={`flex items-center justify-between mb-4 ${flexDirection}`}>
                        <div className={`flex items-center gap-3 ${flexDirection}`}>
                          <Coins className={`w-6 h-6 ${usePoints ? 'text-[#114C5A]' : 'text-gray-500'}`} />
                          <div>
                            <h3 className={`text-lg font-semibold text-[#114C5A] ${textAlign}`}>
                              {t('dashboard.wallet.useYourPoints')}
                            </h3>
                            <p className={`text-sm text-gray-600 ${textAlign}`}>
                              {t('dashboard.wallet.yourBalance')} <span className="font-bold text-[#114C5A]">{walletBalance.toLocaleString()}</span> {t('dashboard.wallet.point')}
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
                            usePoints ? 'bg-[#114C5A]' : 'bg-gray-300'
                          }`}>
                            <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                              usePoints ? 'translate-x-7' : 'translate-x-0'
                            }`} />
                          </div>
                        </label>
                      </div>
                      
                      {usePoints && (() => {
                        // حساب السعر والنقاط
                        let servicePrice = 100;
                        if (service.price) {
                          servicePrice = parseFloat(String(service.price));
                        } else if (service.durations && service.durations.length > 0 && service.durations[0].price) {
                          servicePrice = parseFloat(String(service.durations[0].price));
                        } else if (service.points_price) {
                          servicePrice = parseFloat(String(service.points_price)) / pointsPerRiyal;
                        }
                        const originalPrice = servicePrice * selectedTimeSlotIds.length;
                        const pointsDiscountInRiyal = walletBalance / pointsPerRiyal;
                        const maxDiscount = Math.min(pointsDiscountInRiyal, originalPrice);
                        const pointsToUse = Math.min(walletBalance, Math.floor(originalPrice * pointsPerRiyal));
                        const finalPriceWithPoints = Math.max(0, originalPrice - maxDiscount);
                        
                        return (
                          <div className="mt-4 pt-4 border-t border-[#114C5A]/20 space-y-3">
                            <div className={`flex items-center justify-between ${flexDirection}`}>
                              <span className={`text-sm text-gray-700 ${textAlign}`}>
                                {t('dashboard.wallet.originalPrice')}
                              </span>
                              <span className="text-base font-semibold text-gray-900">
                                {originalPrice.toFixed(2)} {t('dashboard.stats.currency')}
                              </span>
                            </div>
                            <div className={`flex items-center justify-between ${flexDirection}`}>
                              <span className={`text-sm text-gray-700 ${textAlign}`}>
                                {t('dashboard.wallet.pointsUsed')}
                              </span>
                              <span className="text-base font-semibold text-[#114C5A]">
                                - {pointsToUse.toLocaleString()} {t('dashboard.wallet.point')}
                              </span>
                            </div>
                            <div className={`flex items-center justify-between pt-2 border-t border-[#114C5A]/10 ${flexDirection}`}>
                              <span className={`text-base font-semibold text-gray-900 ${textAlign}`}>
                                {t('dashboard.wallet.finalPrice')}
                              </span>
                              <span className="text-xl font-bold text-[#114C5A]">
                                {finalPriceWithPoints.toFixed(2)} {t('dashboard.stats.currency')}
                              </span>
                            </div>
                            {maxDiscount > 0 && (
                              <div className="mt-2 p-3 rounded-lg bg-green-50 border border-green-200">
                                <p className="text-xs text-center text-green-700">
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
                <div className="mt-8 pt-6 border-t border-[#114C5A]/10">
                  <label htmlFor="booking-notes" className={`block ${textAlign} mb-3`}>
                    <h3 className={`text-xl font-semibold mb-1 text-[#114C5A] ${textAlign}`}>
                      {t('dashboard.booking.notes')}
                    </h3>
                    <p className={`text-sm text-gray-600 ${textAlign}`}>
                      {t('dashboard.booking.notesPlaceholder')}
                    </p>
                  </label>
                  <textarea
                    id="booking-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t('dashboard.booking.notesPlaceholder')}
                    rows={4}
                    maxLength={500}
                    dir={isRTL ? 'rtl' : 'ltr'}
                    className={`w-full px-4 py-3 rounded-xl border-2 border-[#114C5A]/20 focus:border-[#114C5A] focus:ring-2 focus:ring-[#114C5A]/20 outline-none transition-all duration-300 resize-none ${textAlign} shadow-sm hover:shadow-md bg-white text-gray-900 placeholder:text-gray-400`}
                  />
                  <div className={`flex ${isRTL ? 'justify-end' : 'justify-start'} mt-2`}>
                    <span className="text-xs text-gray-500">
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
          {/* رسائل الخطأ والنجاح */}
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

          {/* زر التأكيد */}
          {selectedTimeSlotIds.length > 0 && bookingData && (
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={handleSubmitBooking}
                disabled={isSubmitting}
                className={`
                  px-10 py-4
                  rounded-xl
                  text-white
                  text-lg
                  font-semibold
                  shadow-md
                  transition-all duration-300
                  active:scale-95
                  flex items-center justify-center gap-2
                  ${isSubmitting 
                    ? 'bg-[#114C5A]/70 cursor-not-allowed' 
                    : 'bg-[#114C5A] hover:bg-[#114C5A]/90 shadow-[#114C5A]/30'
                  }
                `}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t('dashboard.consultation.bookingInProgress')}
                  </>
                ) : (
                  `${t('dashboard.consultation.confirmBooking')} (${selectedTimeSlotIds.length})`
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServicePopup;