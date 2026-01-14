import { useState } from 'react';
import { X, Calendar, Clock, User, FileText, CreditCard, CheckCircle2, XCircle, Clock as ClockIcon, Download, Loader2 } from 'lucide-react';
import { useThemeStore } from '../../storeApi/store/theme.store';
import type { Invoice } from '../../types/types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface InvoicePopupProps {
  invoice: Invoice;
  onClose: () => void;
}

const InvoicePopup = ({ invoice, onClose }: InvoicePopupProps) => {
  const { isDarkMode } = useThemeStore();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  const formatDateTime = (dateTimeString: string | null) => {
    if (!dateTimeString) return 'غير متوفر';
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentStatusBadge = (status: string) => {
    const baseClasses = "px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2";
    
    switch (status) {
      case 'paid':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-700 ${isDarkMode ? 'bg-green-900/30 text-green-400' : ''}`}>
            <CheckCircle2 className="w-5 h-5" />
            مدفوع
          </span>
        );
      case 'unpaid':
        return (
          <span className={`${baseClasses} bg-red-100 text-red-700 ${isDarkMode ? 'bg-red-900/30 text-red-400' : ''}`}>
            <XCircle className="w-5 h-5" />
            غير مدفوع
          </span>
        );
      case 'pending':
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-700 ${isDarkMode ? 'bg-yellow-900/30 text-yellow-400' : ''}`}>
            <ClockIcon className="w-5 h-5" />
            قيد الانتظار
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-700 ${isDarkMode ? 'bg-gray-700 text-gray-300' : ''}`}>
            {status}
          </span>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-4 py-2 rounded-xl text-sm font-bold";
    
    switch (status) {
      case 'completed':
        return (
          <span className={`${baseClasses} bg-blue-100 text-blue-700 ${isDarkMode ? 'bg-blue-900/30 text-blue-400' : ''}`}>
            مكتمل
          </span>
        );
      case 'pending':
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-700 ${isDarkMode ? 'bg-yellow-900/30 text-yellow-400' : ''}`}>
            قيد الانتظار
          </span>
        );
      case 'cancelled':
        return (
          <span className={`${baseClasses} bg-red-100 text-red-700 ${isDarkMode ? 'bg-red-900/30 text-red-400' : ''}`}>
            ملغي
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-700 ${isDarkMode ? 'bg-gray-700 text-gray-300' : ''}`}>
            {status}
          </span>
        );
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'مدفوع';
      case 'unpaid':
        return 'غير مدفوع';
      case 'pending':
        return 'قيد الانتظار';
      default:
        return status;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'مكتمل';
      case 'pending':
        return 'قيد الانتظار';
      case 'cancelled':
        return 'ملغي';
      default:
        return status;
    }
  };

  const downloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      // إنشاء عنصر HTML للفاتورة
      const invoiceElement = document.createElement('div');
      invoiceElement.style.width = '210mm';
      invoiceElement.style.padding = '20mm';
      invoiceElement.style.backgroundColor = '#ffffff';
      invoiceElement.style.fontFamily = 'Arial, sans-serif';
      invoiceElement.style.direction = 'rtl';
      invoiceElement.style.textAlign = 'right';
      invoiceElement.innerHTML = `
        <div style="margin-bottom: 30px;">
          <div style="background: linear-gradient(135deg, #00adb5 0%, #0099a1 100%); padding: 30px; border-radius: 10px; margin-bottom: 30px;">
            <h1 style="color: #ffffff; font-size: 36px; font-weight: bold; margin: 0; text-align: center;">فاتورة</h1>
            <p style="color: #ffffff; font-size: 18px; margin: 10px 0 0 0; text-align: center;">INVOICE</p>
          </div>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 30px; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 200px;">
              <h3 style="color: #333; font-size: 16px; font-weight: bold; margin-bottom: 10px; border-bottom: 2px solid #00adb5; padding-bottom: 5px;">معلومات الفاتورة</h3>
              <p style="color: #666; font-size: 14px; margin: 5px 0;"><strong>رقم الفاتورة:</strong> ${invoice.invoice_number}</p>
              <p style="color: #666; font-size: 14px; margin: 5px 0;"><strong>تاريخ الفاتورة:</strong> ${formatDate(invoice.booking_date)}</p>
              <p style="color: #666; font-size: 14px; margin: 5px 0;"><strong>رقم الحجز:</strong> #${invoice.booking_id}</p>
            </div>
            <div style="flex: 1; min-width: 200px; text-align: left;">
              <h3 style="color: #333; font-size: 16px; font-weight: bold; margin-bottom: 10px; border-bottom: 2px solid #00adb5; padding-bottom: 5px;">العميل</h3>
              <p style="color: #666; font-size: 14px; margin: 5px 0;">عميل</p>
            </div>
          </div>

          <div style="margin-bottom: 30px;">
            <h3 style="color: #333; font-size: 16px; font-weight: bold; margin-bottom: 15px; border-bottom: 2px solid #00adb5; padding-bottom: 5px;">تفاصيل الخدمة</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f5f5f5;">
                  <th style="padding: 12px; text-align: right; border: 1px solid #ddd; color: #333; font-size: 14px;">الوصف</th>
                  <th style="padding: 12px; text-align: right; border: 1px solid #ddd; color: #333; font-size: 14px;">التفاصيل</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd; color: #666; font-size: 14px;"><strong>نوع الخدمة</strong></td>
                  <td style="padding: 10px; border: 1px solid #ddd; color: #333; font-size: 14px;">${invoice.service.type === 'service' ? 'خدمة' : 'استشارة'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd; color: #666; font-size: 14px;"><strong>اسم الخدمة</strong></td>
                  <td style="padding: 10px; border: 1px solid #ddd; color: #333; font-size: 14px;">${invoice.service.name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd; color: #666; font-size: 14px;"><strong>الموظف</strong></td>
                  <td style="padding: 10px; border: 1px solid #ddd; color: #333; font-size: 14px;">${invoice.employee.name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd; color: #666; font-size: 14px;"><strong>تاريخ الحجز</strong></td>
                  <td style="padding: 10px; border: 1px solid #ddd; color: #333; font-size: 14px;">${formatDate(invoice.booking_date)}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd; color: #666; font-size: 14px;"><strong>وقت الحجز</strong></td>
                  <td style="padding: 10px; border: 1px solid #ddd; color: #333; font-size: 14px;">${formatTime(invoice.start_time)} - ${formatTime(invoice.end_time)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style="margin-bottom: 30px;">
            <h3 style="color: #333; font-size: 16px; font-weight: bold; margin-bottom: 15px; border-bottom: 2px solid #00adb5; padding-bottom: 5px;">معلومات الدفع</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; color: #666; font-size: 14px; width: 50%;"><strong>حالة الدفع</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd; color: #333; font-size: 14px;">${getPaymentStatusText(invoice.payment_status)}</td>
              </tr>
              ${invoice.payment_id ? `
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; color: #666; font-size: 14px;"><strong>رقم المعاملة</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd; color: #333; font-size: 14px;">${invoice.payment_id}</td>
              </tr>
              ` : ''}
              ${invoice.paid_at ? `
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; color: #666; font-size: 14px;"><strong>تاريخ الدفع</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd; color: #333; font-size: 14px;">${formatDateTime(invoice.paid_at)}</td>
              </tr>
              ` : ''}
            </table>
          </div>

          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 10px; border: 2px solid #00adb5; margin-bottom: 30px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <p style="color: #666; font-size: 14px; margin: 5px 0;"><strong>حالة الفاتورة:</strong> ${getStatusText(invoice.status)}</p>
              </div>
              <div style="text-align: left;">
                <p style="color: #666; font-size: 16px; margin: 5px 0;"><strong>المبلغ الإجمالي:</strong></p>
                <p style="color: #00adb5; font-size: 32px; font-weight: bold; margin: 5px 0;">${parseFloat(invoice.total_price).toLocaleString('ar-SA')} ر.س</p>
              </div>
            </div>
          </div>

          <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px; text-align: center; color: #999; font-size: 12px;">
            <p style="margin: 5px 0;">هذه فاتورة إلكترونية تم إنشاؤها تلقائياً</p>
            <p style="margin: 5px 0;">شكراً لتعاملك معنا!</p>
          </div>
        </div>
      `;

      // إضافة العنصر إلى DOM مؤقتاً
      invoiceElement.style.position = 'absolute';
      invoiceElement.style.left = '-9999px';
      invoiceElement.style.top = '0';
      document.body.appendChild(invoiceElement);

      // انتظار تحميل الخطوط والصور
      await new Promise(resolve => setTimeout(resolve, 500));

      // تحويل HTML إلى Canvas
      const canvas = await html2canvas(invoiceElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      // إنشاء PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgScaledWidth = imgWidth * ratio;
      const imgScaledHeight = imgHeight * ratio;

      pdf.addImage(imgData, 'PNG', 0, 0, imgScaledWidth, imgScaledHeight);

      // حفظ PDF
      pdf.save(`Invoice-${invoice.invoice_number}.pdf`);

      // إزالة العنصر المؤقت
      document.body.removeChild(invoiceElement);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('حدث خطأ أثناء إنشاء الفاتورة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={`relative rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl ${
        isDarkMode ? 'bg-slate-800' : 'bg-white'
      }`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-6 left-6 hover:text-red-500 text-2xl w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 z-30 ${
            isDarkMode 
              ? 'text-slate-400 hover:bg-red-900/30' 
              : 'text-gray-400 hover:bg-red-50'
          }`}
        >
          ✕
        </button>

        {/* Header */}
        <div className={`p-6 sm:p-8 border-b ${
          isDarkMode ? 'border-slate-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
              isDarkMode ? 'bg-primary/20' : 'bg-primary/10'
            }`}>
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className={`text-2xl sm:text-3xl font-black mb-1 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                تفاصيل الفاتورة
              </h2>
              <p className={`text-lg font-bold ${
                isDarkMode ? 'text-slate-400' : 'text-gray-600'
              }`}>
                {invoice.invoice_number}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Service Info */}
          <div className={`p-6 rounded-2xl border ${
            isDarkMode 
              ? 'bg-slate-700/50 border-slate-600' 
              : 'bg-slate-50 border-slate-200'
          }`}>
            <h3 className={`text-lg font-black mb-4 flex items-center gap-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <FileText className="w-5 h-5 text-primary" />
              معلومات الخدمة
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-bold ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-600'
                }`}>
                  نوع الخدمة:
                </span>
                <span className={`text-sm font-black ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {invoice.service.type === 'service' ? 'خدمة' : 'استشارة'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-bold ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-600'
                }`}>
                  اسم الخدمة:
                </span>
                <span className={`text-sm font-black ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {invoice.service.name}
                </span>
              </div>
            </div>
          </div>

          {/* Employee Info */}
          <div className={`p-6 rounded-2xl border ${
            isDarkMode 
              ? 'bg-slate-700/50 border-slate-600' 
              : 'bg-slate-50 border-slate-200'
          }`}>
            <h3 className={`text-lg font-black mb-4 flex items-center gap-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <User className="w-5 h-5 text-primary" />
              معلومات الموظف
            </h3>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-bold ${
                isDarkMode ? 'text-slate-400' : 'text-gray-600'
              }`}>
                اسم الموظف:
              </span>
              <span className={`text-sm font-black ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {invoice.employee.name}
              </span>
            </div>
          </div>

          {/* Booking Details */}
          <div className={`p-6 rounded-2xl border ${
            isDarkMode 
              ? 'bg-slate-700/50 border-slate-600' 
              : 'bg-slate-50 border-slate-200'
          }`}>
            <h3 className={`text-lg font-black mb-4 flex items-center gap-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <Calendar className="w-5 h-5 text-primary" />
              تفاصيل الحجز
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-bold ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-600'
                }`}>
                  تاريخ الحجز:
                </span>
                <span className={`text-sm font-black ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {formatDate(invoice.booking_date)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-bold ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-600'
                }`}>
                  وقت الحجز:
                </span>
                <span className={`text-sm font-black flex items-center gap-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <Clock className="w-4 h-4" />
                  {formatTime(invoice.start_time)} - {formatTime(invoice.end_time)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-bold ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-600'
                }`}>
                  رقم الحجز:
                </span>
                <span className={`text-sm font-black ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  #{invoice.booking_id}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className={`p-6 rounded-2xl border ${
            isDarkMode 
              ? 'bg-slate-700/50 border-slate-600' 
              : 'bg-slate-50 border-slate-200'
          }`}>
            <h3 className={`text-lg font-black mb-4 flex items-center gap-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <CreditCard className="w-5 h-5 text-primary" />
              معلومات الدفع
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-bold ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-600'
                }`}>
                  المبلغ الإجمالي:
                </span>
                <span className={`text-xl font-black text-primary ${
                  isDarkMode ? 'text-primary-400' : 'text-primary'
                }`}>
                  {parseFloat(invoice.total_price).toLocaleString('ar-SA')} ر.س
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-bold ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-600'
                }`}>
                  حالة الدفع:
                </span>
                {getPaymentStatusBadge(invoice.payment_status)}
              </div>
              {invoice.payment_id && (
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-bold ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-600'
                  }`}>
                    رقم المعاملة:
                  </span>
                  <span className={`text-sm font-black ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {invoice.payment_id}
                  </span>
                </div>
              )}
              {invoice.paid_at && (
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-bold ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-600'
                  }`}>
                    تاريخ الدفع:
                  </span>
                  <span className={`text-sm font-black ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {formatDateTime(invoice.paid_at)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div className={`p-6 rounded-2xl border ${
            isDarkMode 
              ? 'bg-slate-700/50 border-slate-600' 
              : 'bg-slate-50 border-slate-200'
          }`}>
            <h3 className={`text-lg font-black mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              حالة الفاتورة
            </h3>
            <div className="flex items-center justify-end">
              {getStatusBadge(invoice.status)}
            </div>
          </div>

          {/* Additional Info */}
          {invoice.created_at && (
            <div className={`p-6 rounded-2xl border ${
              isDarkMode 
                ? 'bg-slate-700/50 border-slate-600' 
                : 'bg-slate-50 border-slate-200'
            }`}>
              <h3 className={`text-lg font-black mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                معلومات إضافية
              </h3>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-bold ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-600'
                }`}>
                  تاريخ الإنشاء:
                </span>
                <span className={`text-sm font-black ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {formatDateTime(invoice.created_at)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className={`p-6 sm:p-8 border-t flex items-center justify-between gap-4 ${
          isDarkMode ? 'border-slate-700' : 'border-gray-200'
        }`}>
          <button
            onClick={onClose}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
              isDarkMode
                ? 'bg-slate-700 hover:bg-slate-600 text-gray-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            إغلاق
          </button>
          <button
            onClick={downloadPDF}
            disabled={isGeneratingPDF}
            className="px-6 py-3 bg-primary text-white hover:bg-primary-dark rounded-xl font-bold text-sm transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingPDF ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                جاري التحميل...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                تحميل الفاتورة
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoicePopup;

