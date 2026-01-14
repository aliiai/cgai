/**
 * SweetAlert2 Configuration Helper
 * 
 * هذا الملف يحتوي على إعدادات عامة لـ SweetAlert2
 * لضمان عمل النوافذ بشكل صحيح وإغلاقها بعد الضغط على الأزرار
 */

import Swal from 'sweetalert2';

/**
 * إعدادات افتراضية لـ SweetAlert2
 * تضمن إغلاق النافذة بشكل صحيح بعد الضغط على الأزرار
 */
export const swalDefaultConfig = {
  allowOutsideClick: true,
  allowEscapeKey: true,
  allowEnterKey: true,
  showClass: {
    popup: 'animate-fadeIn',
  },
  hideClass: {
    popup: 'animate-fadeOut',
  },
  customClass: {
    popup: 'font-ElMessiri',
  },
  // إضافة didClose لضمان إغلاق النافذة
  didClose: () => {
    // تنظيف أي عناصر متبقية
    const container = document.querySelector('.swal2-container');
    if (container) {
      container.remove();
    }
  },
};

/**
 * Helper function لإنشاء SweetAlert2 مع الإعدادات الافتراضية
 * يضمن إغلاق النافذة بشكل صحيح
 */
export const swalFire = async (options: any) => {
  const result = await Swal.fire({
    ...swalDefaultConfig,
    ...options,
    didClose: () => {
      // تنظيف أي عناصر متبقية
      setTimeout(() => {
        const container = document.querySelector('.swal2-container');
        if (container) {
          container.remove();
        }
      }, 100);
      // استدعاء didClose الأصلي إذا كان موجوداً
      if (options.didClose) {
        options.didClose();
      }
    },
  });
  
  return result;
};

/**
 * Helper function لـ SweetAlert2 مع preConfirm
 * يضيف الإعدادات المطلوبة لمنع إغلاق النافذة قبل التحقق
 */
export const swalFireWithPreConfirm = async (options: any) => {
  const result = await Swal.fire({
    ...swalDefaultConfig,
    allowOutsideClick: false,
    allowEscapeKey: false,
    ...options,
    didClose: () => {
      // تنظيف أي عناصر متبقية
      setTimeout(() => {
        const container = document.querySelector('.swal2-container');
        if (container) {
          container.remove();
        }
      }, 100);
      // استدعاء didClose الأصلي إذا كان موجوداً
      if (options.didClose) {
        options.didClose();
      }
    },
  });
  
  return result;
};

/**
 * Helper function لإغلاق SweetAlert2 بشكل صحيح
 */
export const swalClose = () => {
  Swal.close();
  // تنظيف أي عناصر متبقية
  setTimeout(() => {
    const container = document.querySelector('.swal2-container');
    if (container) {
      container.remove();
    }
  }, 100);
};

/**
 * Helper function لإعادة تعيين SweetAlert2
 */
export const swalResetValidationMessage = () => {
  Swal.resetValidationMessage();
};

