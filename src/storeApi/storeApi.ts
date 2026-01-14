/**
 * Store API
 * 
 * ملف موحد يحتوي على re-exports لجميع APIs والـ stores
 * 
 * هذا الملف موجود للتوافق مع الكود القديم
 * يُنصح باستخدام الاستيراد المباشر من الملفات الجديدة
 */

// Re-export جميع APIs
export * from './api';

// Re-export Auth Store
export { useAuthStore } from './store/auth.store';

// Re-export Theme Store
export { useThemeStore } from './store/theme.store';

// Re-export Axios Instance
export { axiosInstance } from './config/axios';

// Re-export Types
export type {
  SendVerificationCodeRequest,
  SendVerificationCodeResponse,
  VerifyRegistrationCodeRequest,
  VerifyRegistrationCodeResponse,
  VerifyLoginCodeRequest,
  VerifyLoginCodeResponse,
  CompleteRegistrationRequest,
  CompleteRegistrationResponse,
  GetCategoriesResponse,
  GetCategoryResponse,
  GetServicesResponse,
  GetServicesParams,
  GetAvailableDatesResponse,
  GetConsultationsResponse,
  GetConsultationAvailableDatesResponse,
  Consultation,
  NotificationsResponse,
  GetNotificationsParams,
  TicketsResponse,
  GetTicketsParams,
  CreateTicketRequest,
  CreateTicketResponse,
  Ticket,
  CreateTicketMessageRequest,
  CreateTicketMessageResponse,
  InvoicesResponse,
  GetInvoicesParams,
  Invoice,
} from '../types/types';
