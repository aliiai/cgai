/**
 * Date Utility Functions
 * 
 * دوال مساعدة للتعامل مع التواريخ
 */

/**
 * استخراج التاريخ من كائن أو string
 * @param date - يمكن أن يكون string أو object يحتوي على formatted
 * @returns string التاريخ بصيغة يمكن استخدامها مع new Date()
 */
export const extractDateString = (date: any): string => {
  if (!date) return '';
  
  // إذا كان string، استخدمه مباشرة
  if (typeof date === 'string') {
    return date;
  }
  
  // إذا كان object، استخرج formatted
  if (typeof date === 'object') {
    // إذا كان يحتوي على formatted مباشرة
    if (date.formatted) {
      return date.formatted;
    }
    
    // إذا كان يحتوي على date.formatted
    if (date.date && date.date.formatted) {
      return date.date.formatted;
    }
    
    // إذا كان يحتوي على timestamp
    if (date.timestamp) {
      return new Date(date.timestamp * 1000).toISOString();
    }
  }
  
  return '';
};

/**
 * تنسيق التاريخ للعرض
 * @param date - يمكن أن يكون string أو object
 * @param locale - اللغة (افتراضي: 'ar-SA')
 * @param options - خيارات التنسيق
 * @returns string التاريخ المنسق
 */
export const formatDate = (
  date: any,
  locale: string = 'ar-SA',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
): string => {
  const dateString = extractDateString(date);
  if (!dateString) return '';
  
  try {
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    return dateObj.toLocaleDateString(locale, options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * تنسيق التاريخ والوقت للعرض
 * @param date - يمكن أن يكون string أو object
 * @param locale - اللغة (افتراضي: 'ar-SA')
 * @returns string التاريخ والوقت المنسق
 */
export const formatDateTime = (
  date: any,
  locale: string = 'ar-SA'
): string => {
  const dateString = extractDateString(date);
  if (!dateString) return '';
  
  try {
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    return dateObj.toLocaleString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting date time:', error);
    return '';
  }
};

/**
 * الحصول على Date object من كائن أو string
 * @param date - يمكن أن يكون string أو object
 * @returns Date object أو null
 */
export const getDateObject = (date: any): Date | null => {
  const dateString = extractDateString(date);
  if (!dateString) return null;
  
  try {
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) {
      return null;
    }
    return dateObj;
  } catch (error) {
    console.error('Error creating date object:', error);
    return null;
  }
};

/**
 * Parse date from various formats (alias for getDateObject for backward compatibility)
 * @param date - يمكن أن يكون string أو object
 * @returns Date object أو null
 */
export const parseDate = (date: any): Date | null => {
  if (!date) return null;

  if (typeof date === 'string') {
    // Handle ISO strings directly
    if (date.includes('T') && date.endsWith('Z')) {
      return new Date(date);
    }
    // Handle YYYY-MM-DD HH:MM:SS format
    if (date.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
      return new Date(date.replace(' ', 'T') + 'Z'); // Assume UTC if no timezone
    }
    // Fallback for other string formats
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  }

  if (typeof date === 'object') {
    if (date.timestamp) {
      return new Date(date.timestamp * 1000); // Convert seconds to milliseconds
    }
    if (date.formatted) {
      return parseDate(date.formatted);
    }
    if (date.date?.formatted) {
      return parseDate(date.date.formatted);
    }
    // Fallback for object with year, month, day
    if (date.year && date.month && date.day) {
      // Month is 1-indexed from API, Date constructor is 0-indexed
      return new Date(Date.UTC(date.year, date.month - 1, date.day, date.hour || 0, date.minute || 0, date.second || 0));
    }
  }
  return null;
};

