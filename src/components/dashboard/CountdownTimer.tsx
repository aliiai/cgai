/**
 * Countdown Timer Component
 * 
 * عداد تنازلي للوقت المتبقي حتى بداية الحجز
 */

import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock } from 'lucide-react';
import { memo } from 'react';

interface CountdownTimerProps {
  bookingDate: string;
  startTime: string;
}

const CountdownTimer = ({ bookingDate, startTime }: CountdownTimerProps) => {
  const { t } = useTranslation();
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  } | null>(null);
  
  // حساب التاريخ والوقت مرة واحدة فقط عند تغيير bookingDate أو startTime
  const bookingDateTime = useMemo(() => {
    if (!bookingDate || !startTime) {
      return null;
    }

    try {
      // استخراج التاريخ من كائن أو string
      let dateString = bookingDate;
      let dateObj: any = null;
      
      // إذا كان bookingDate كائن، حاول استخراج timestamp أو formatted
      if (typeof bookingDate === 'object') {
        // إذا كان هناك timestamp مباشرة، استخدمه
        if (bookingDate.timestamp) {
          dateObj = new Date(bookingDate.timestamp * 1000);
          if (!isNaN(dateObj.getTime())) {
            // استخراج التاريخ فقط (بدون وقت)
            const year = dateObj.getUTCFullYear();
            const month = dateObj.getUTCMonth();
            const day = dateObj.getUTCDate();
            
            // استخراج الوقت من startTime
            const timeParts = startTime.split(':');
            const hours = parseInt(timeParts[0] || '0', 10);
            const minutes = parseInt(timeParts[1] || '0', 10);
            
            // إنشاء تاريخ جديد في UTC
            dateObj = new Date(Date.UTC(year, month, day, hours, minutes, 0));
            return dateObj;
          }
        }
        
        // إذا لم يكن هناك timestamp، استخدم formatted
        dateString = bookingDate?.formatted || bookingDate?.date?.formatted || '';
      }
      
      if (!dateString) {
        return null;
      }
      
      // تنظيف bookingDate (إزالة الوقت إذا كان موجوداً)
      let dateOnly = dateString;
      if (dateOnly.includes('T')) {
        dateOnly = dateOnly.split('T')[0];
      } else if (dateOnly.includes(' ')) {
        dateOnly = dateOnly.split(' ')[0];
      }
      
      // تنظيف startTime (إزالة الثواني إذا كانت موجودة)
      let timeOnly = startTime;
      if (timeOnly.includes(':')) {
        const timeParts = timeOnly.split(':');
        if (timeParts.length >= 2) {
          timeOnly = `${timeParts[0].padStart(2, '0')}:${timeParts[1].padStart(2, '0')}`; // HH:MM
        }
      }
      
      // تقسيم التاريخ إلى أجزاء
      const dateParts = dateOnly.split('-');
      if (dateParts.length !== 3) {
        return null;
      }
      
      const year = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1; // الشهر يبدأ من 0
      const day = parseInt(dateParts[2], 10);
      
      // تقسيم الوقت إلى أجزاء
      const timeParts = timeOnly.split(':');
      const hours = parseInt(timeParts[0] || '0', 10);
      const minutes = parseInt(timeParts[1] || '0', 10);
      
      // إنشاء تاريخ في UTC (لأن البيانات من الـ API في UTC)
      const date = new Date(Date.UTC(year, month, day, hours, minutes, 0));
      
      // التحقق من صحة التاريخ
      if (isNaN(date.getTime())) {
        console.error('Invalid date:', { dateOnly, timeOnly, year, month, day, hours, minutes });
        return null;
      }
      
      return date;
    } catch (error) {
      console.error('Error parsing booking date:', error, { bookingDate, startTime });
      return null;
    }
  }, [bookingDate, startTime]);

  useEffect(() => {
    if (!bookingDateTime) {
      setTimeRemaining({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isPast: true,
      });
      return;
    }

    const calculateTimeRemaining = () => {
      try {
        const now = new Date();
        const bookingTime = bookingDateTime.getTime();
        const nowTime = now.getTime();
        const diff = bookingTime - nowTime;
        
        // Debug logging (يمكن حذفه لاحقاً)
        if (diff < 0 && diff > -86400000) { // إذا كان الفرق أقل من يوم واحد في الماضي
          console.log('Countdown Timer Debug:', {
            bookingDateTime: bookingDateTime.toISOString(),
            now: now.toISOString(),
            diff: diff,
            diffInHours: diff / (1000 * 60 * 60),
            bookingDate: bookingDate,
            startTime: startTime
          });
        }
        
        if (diff <= 0) {
          setTimeRemaining({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            isPast: true,
          });
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeRemaining({
          days,
          hours,
          minutes,
          seconds,
          isPast: false,
        });
      } catch (error) {
        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isPast: true,
        });
      }
    };

    // حساب الوقت فوراً
    calculateTimeRemaining();

    // تحديث كل ثانية
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [bookingDateTime]);

  if (!timeRemaining) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <Clock size={16} className="animate-spin" />
        <span className="text-sm">{t('dashboard.countdown.calculating')}</span>
      </div>
    );
  }

  if (timeRemaining.isPast) {
    return (
      <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
        <Clock size={16} />
        <span className="text-sm font-semibold">{t('dashboard.countdown.timeExpired')}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-primary bg-primary/5 px-3 py-2 rounded-lg border border-primary/20">
      <Clock size={16} className="animate-pulse" />
      <div className="flex items-center gap-1 text-sm font-bold" dir="ltr">
        {timeRemaining.days > 0 && (
          <>
            <span className="bg-white px-2 py-1 rounded font-mono">{String(timeRemaining.days).padStart(2, '0')}</span>
            <span className="text-xs text-gray-500 mx-1">{t('dashboard.countdown.day')}</span>
          </>
        )}
        <span className="bg-white px-2 py-1 rounded font-mono">{String(timeRemaining.hours).padStart(2, '0')}</span>
        <span className="text-xs text-gray-500 mx-1">:</span>
        <span className="bg-white px-2 py-1 rounded font-mono">{String(timeRemaining.minutes).padStart(2, '0')}</span>
        <span className="text-xs text-gray-500 mx-1">:</span>
        <span className="bg-white px-2 py-1 rounded font-mono">{String(timeRemaining.seconds).padStart(2, '0')}</span>
      </div>
    </div>
  );
};

export default memo(CountdownTimer);

