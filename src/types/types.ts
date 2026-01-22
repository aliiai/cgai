/**
 * Types
 * 
 * جميع أنواع البيانات (Types & Interfaces) في المشروع
 */

import type { ReactNode } from 'react';

// ============================================
// Routes Types
// ============================================

export interface BaseRoute {
  id: string;
  name: string;
  path: string;
}

export interface RouteWithComponent extends BaseRoute {
  component: string;
}

export interface RouteWithSection extends BaseRoute {
  sectionId: string;
}

export interface RouteWithIcon extends BaseRoute {
  icon?: string;
}

export interface RouteWithAuth extends BaseRoute {
  requiresAuth?: boolean;
  roles?: string[];
}

export interface AppRoute extends BaseRoute {
  component?: string;
  sectionId?: string;
  icon?: string;
  requiresAuth?: boolean;
  roles?: string[];
}

export interface AdminRoute {
  id: string;
  name: string;
  path: string;
  icon?: string;
  component?: string;
  requiresAuth?: boolean;
  roles?: string[];
}

export interface PublicRoute {
  id: string;
  name: string;
  path: string;
  component?: string;
  sectionId?: string;
}

export interface NavLink {
  id: string;
  label: string;
  path: string;
  sectionId: string;
  hasDropdown?: boolean;
}

export interface NavRoute {
  id: string;
  name: string;
  path: string;
  sectionId: string;
}

// ============================================
// Authentication Types
// ============================================

export interface SendVerificationCodeRequest {
  phone: string;
  type?: 'registration' | 'login';
}

export interface SendVerificationCodeResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export interface VerifyRegistrationCodeRequest {
  phone: string;
  code: string;
}

export interface VerifyRegistrationCodeResponse {
  success: boolean;
  message?: string;
  data?: {
    temp_token?: string;
    token?: string;
    [key: string]: any;
  };
}

export interface VerifyLoginCodeRequest {
  phone: string;
  code: string;
}

export interface VerifyLoginCodeResponse {
  success: boolean;
  message?: string;
  data?: {
    token?: string;
    user?: any;
    [key: string]: any;
  };
}

export interface CompleteRegistrationRequest {
  phone: string;
  temp_token: string;
  name: string;
  email?: string;
  birth_date?: string;
  gender?: string;
}

export interface CompleteRegistrationResponse {
  success: boolean;
  message?: string;
  data?: {
    token?: string;
    user?: any;
    [key: string]: any;
  };
}

export interface RegisterRequest {
  phone: string;
  code: string;
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
  data?: any;
}

// ============================================
// User Types
// ============================================

export interface User {
  id?: string;
  name?: string;
  phone?: string;
  email?: string;
  birth_date?: string;
  gender?: 'male' | 'female';
  avatar?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  birth_date?: string;
  gender?: 'male' | 'female';
  avatar?: string;
  notifications?: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  language?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateUserProfileRequest {
  name?: string;
  email?: string;
  birth_date?: string;
  gender?: 'male' | 'female';
  notifications?: {
    email?: boolean;
    sms?: boolean;
    push?: boolean;
  };
  language?: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

// ============================================
// Dashboard Types
// ============================================

export interface DashboardLink {
  id: string;
  name: string;
  path: string;
  icon?: string;
  iconElement: ReactNode;
  component?: string;
  requiresAuth?: boolean;
  roles?: string[];
  children?: DashboardLink[];
  isFeatured?: boolean; // للتمييز بين العناصر المميزة
  section?: string; // اسم القسم (مثل: "الخدمات والحجوزات")
}

export interface StatCardTrend {
  value: number;
  isPositive: boolean;
}

export interface StatCardData {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: StatCardTrend;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: StatCardTrend;
}

export interface StatsCardsProps {
  stats?: StatCardData[];
}

export type TableStatus = string;

export interface TableRowData {
  name: string;
  status: TableStatus;
  date: string;
  [key: string]: any;
}

export interface TableColumn {
  label: string;
  key: string;
  sortable?: boolean;
  align?: 'left' | 'right' | 'center';
}

export interface DashboardTableProps {
  data?: TableRowData[];
  columns?: TableColumn[];
  getStatusColor?: (status: string) => string;
}

export interface DashboardNotification {
  id: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  read?: boolean;
  created_at: string;
}

export interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

// ============================================
// API Types
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message?: string;
  data: T[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
  };
}

export interface ApiError {
  message: string;
  code?: string | number;
  errors?: Record<string, string[]>;
  status?: number;
}

export interface PaginationParams {
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  [key: string]: any;
}

// ============================================
// Common Types
// ============================================

export type Status = 'active' | 'inactive' | 'pending' | 'suspended';
export type Gender = 'male' | 'female';
export type Language = 'ar' | 'en';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'password' | 'date' | 'select' | 'textarea';
  placeholder?: string;
  required?: boolean;
  validation?: (value: any) => string | null;
  options?: Array<{ label: string; value: string }>;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export interface FileUpload {
  file: File;
  preview?: string;
  progress?: number;
  error?: string;
}

export interface DateRange {
  from: string;
  to: string;
}

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  icon?: string;
}

// ============================================
// Services Types
// ============================================

export interface ServiceCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  icon: string | null;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceSubCategory {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  icon: string | null;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: ServiceCategory;
}

export interface ServiceDuration {
  id: number;
  service_id: number;
  duration_type: string;
  duration_value: number;
  price: string;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceSpecialization {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: number;
  sub_category_id: number;
  specialization_id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  icon: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  price?: number; // السعر الأساسي للخدمة
  points_price?: number; // سعر النقاط
  points_pricing?: {
    id: number;
    service_id: number;
    points_price: string;
    is_active: boolean;
  };
  sub_category?: ServiceSubCategory;
  specialization?: ServiceSpecialization;
  durations?: ServiceDuration[];
}

export interface Consultation {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  fixed_price: string;
  price: number;
  category: {
    id: number;
    name: string;
  };
}

export interface GetConsultationsResponse {
  success: boolean;
  data: Consultation[];
}

export interface GetConsultationAvailableDatesResponse {
  success: boolean;
  data: AvailableDate[];
}

export interface CategoryWithSubCategories extends ServiceCategory {
  sub_categories: ServiceSubCategory[];
}

export interface GetCategoriesResponse {
  success: boolean;
  data: ServiceCategory[];
}

export interface GetCategoryResponse {
  success: boolean;
  data: CategoryWithSubCategories;
}

export interface GetServicesResponse {
  success: boolean;
  data: Service[];
}

export interface GetServicesParams {
  sub_category_id?: number;
  specialization_id?: number;
}

export interface TimeSlot {
  id: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
  time_slot_id: number | null; // add this line

}

export interface AvailableDate {
  date: string;
  formatted_date: string;
  day_name: string;
  time_slots: TimeSlot[];
}

export interface GetAvailableDatesResponse {
  success: boolean;
  data: AvailableDate[];
}

export interface CustomerBooking {
  id: number;
  customer_id?: number;
  employee_id?: number | null;
  service_id?: number | null;
  consultation_id?: number | null;
  booking_type?: 'service' | 'consultation';
  booking_date: string;
  start_time: string;
  end_time: string;
  total_price: string;
  status: string;
  actual_status?: string;
  payment_status: string;
  payment_id?: string | null;
  payment_data?: {
    paymob_order_id: number;
    payment_key: string;
    payment_url?: string;
  };
  paid_at?: string | null;
  notes?: string | null;
  created_at?: string | null;
  updated_at?: string;
  service?: {
    id?: number;
    name: string;
    description?: string;
    price?: number;
    sub_category?: {
      name: string;
    };
  };
  consultation?: {
    id?: number;
    name: string;
    description?: string;
    price?: number;
    category?: {
      id: number;
      name: string;
    };
  };
  employee?: {
    name?: string;
    user?: {
      name: string;
    };
  };
  time_slots?: Array<{
    id: number;
    date: string;
    start_time: string;
    end_time: string;
  }>;
  time_slot?: {
    date: string;
    start_time: string;
    end_time: string;
  };
  has_rating?: boolean;
  rating?: number | null;
}

// ============================================
// Notifications Types
// ============================================

export interface Notification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  data?: {
    booking_id?: number;
    service_id?: number;
    booking_date?: string;
    [key: string]: any;
  };
  read: boolean;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationsResponse {
  success: boolean;
  data: {
    current_page: number;
    data: Notification[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      page: number | null;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
  unread_count: number;
}

export interface GetNotificationsParams {
  read?: boolean;
  type?: string;
  per_page?: number;
  page?: number;
}

// ============================================
// Tickets Types
// ============================================

export interface Ticket {
  id: number;
  user_id: number;
  subject: string;
  description: string;
  status: 'open' | 'pending' | 'closed' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  attachments?: Array<{
    id: number;
    file_name: string;
    file_path: string;
    file_size: number;
    mime_type: string;
  }>;
  messages?: TicketMessage[];
  created_at: string;
  updated_at: string;
  closed_at?: string | null;
}

export interface TicketMessage {
  id: number;
  ticket_id: number;
  user_id: number;
  message: string;
  attachments?: Array<{
    id: number;
    file_name: string;
    file_path: string;
    file_size: number;
    mime_type: string;
  }>;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface GetTicketsParams {
  status?: 'open' | 'pending' | 'closed' | 'resolved';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  per_page?: number;
  page?: number;
}

export interface TicketsResponse {
  success: boolean;
  data: {
    current_page: number;
    data: Ticket[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      page: number | null;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

export interface CreateTicketRequest {
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  attachments?: File[];
}

export interface CreateTicketResponse {
  success: boolean;
  message?: string;
  data?: Ticket;
}

export interface CreateTicketMessageRequest {
  message: string;
  attachments?: File[];
}

export interface CreateTicketMessageResponse {
  success: boolean;
  message?: string;
  data?: TicketMessage;
}

// ============================================
// Subscriptions Types
// ============================================

export interface SubscriptionFeature {
  name: string;
  name_en?: string | null;
}

export interface Subscription {
  id: number;
  name?: string | null; // Optional for backward compatibility
  name_en?: string | null;
  description?: string | null;
  description_en?: string | null;
  features: string[] | SubscriptionFeature[]; // Support both string array and object array
  features_en?: string[] | null;
  price: string; // Decimal as string
  duration_type: 'monthly' | '3months' | '6months' | 'yearly' | 'month' | 'year';
  max_debtors?: number;
  max_messages?: number;
  ai_enabled?: boolean;
  is_active: boolean;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}

export interface SubscriptionRequest {
  id: number;
  user_id: number;
  subscription_id: number;
  payment_proof: string; // Path to image
  status: 'pending' | 'approved' | 'rejected';
  admin_notes: string | null;
  approved_at: string | null; // ISO 8601
  rejected_at: string | null; // ISO 8601
  approved_by: number | null;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
  subscription?: Subscription;
  approver?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface ActiveSubscription {
  id: number;
  user_id: number;
  subscription_id: number;
  subscription_request_id: number | null;
  status: 'active' | 'expired' | 'cancelled';
  started_at: string; // ISO 8601
  expires_at: string | null; // ISO 8601 (null for lifetime subscriptions)
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
  subscription?: Subscription;
  is_active?: boolean;
}

export interface SubscriptionsResponse {
  success: boolean;
  data: Subscription[];
  message?: string;
}

export interface SubscriptionRequestResponse {
  success: boolean;
  message?: string;
  data?: SubscriptionRequest;
}

export interface ActiveSubscriptionResponse {
  success: boolean;
  message?: string;
  data?: ActiveSubscription;
}

export interface SubscriptionRequestsResponse {
  success: boolean;
  data: SubscriptionRequest[];
  message?: string;
}

export interface CreateSubscriptionRequestRequest {
  subscription_id: number;
  payment_proof: File;
}

// ============================================
// Dashboard Types
// ============================================

export interface DashboardUser {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface DashboardSubscription {
  id: number;
  subscription: {
    id: number;
    name: string;
    description: string | null;
    price: string;
    duration_type: 'monthly' | '3months' | '6months' | 'yearly';
    features: Array<{ name: string }>;
  };
  status: 'active' | 'expired' | 'cancelled';
  started_at: string;
  expires_at: string | null;
  is_active: boolean;
}

export interface DashboardPendingRequest {
  id: number;
  subscription: {
    id: number;
    name: string;
  };
  status: 'pending';
  created_at: string;
}

export interface DashboardBookingsStats {
  total: number;
  pending: number;
  confirmed: number;
  in_progress: number;
  completed: number;
  cancelled: number;
  today: number;
  upcoming: number;
}

export interface DashboardPaymentsStats {
  total_spent: number;
  paid_bookings: number;
  unpaid_bookings: number;
}

// ============================================
// Ratings Types
// ============================================

export interface Rating {
  id: number;
  booking_id: number;
  customer_id: number;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  customer: {
    id: number;
    name: string;
    email: string;
    phone: string;
    phone_verified_at: string | null;
    role: string;
    date_of_birth: string | null;
    gender: string | null;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
  };
  booking: {
    id: number;
    customer_id: number;
    employee_id: number | null;
    service_id: number | null;
    consultation_id: number | null;
    booking_type: 'service' | 'consultation';
    time_slot_id: number;
    booking_date: string;
    start_time: string;
    end_time: string;
    total_price: string;
    status: string;
    payment_status: string;
    payment_id: string | null;
    payment_data: any;
    paid_at: string | null;
    notes: string | null;
    created_at: string | null;
    updated_at: string;
  };
}

export interface RatingsResponse {
  success: boolean;
  data: {
    current_page: number;
    data: Rating[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      page: number | null;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
  message?: string;
}

export interface GetRatingsParams {
  rating?: number;
  per_page?: number;
  page?: number;
  search?: string;
}

export interface CreateRatingRequest {
  booking_id?: number;
  ratable_id: number;
  ratable_type: 'service' | 'consultation' | 'ai_service' | 'ready_app';
  rating: number;
  comment?: string;
}

export interface CreateRatingResponse {
  success: boolean;
  message?: string;
  data?: Rating;
}

export interface DashboardTicketsStats {
  total: number;
  open: number;
  in_progress: number;
  resolved: number;
}

export interface DashboardNotificationsStats {
  unread_count: number;
}

export interface DashboardStats {
  bookings: DashboardBookingsStats;
  payments: DashboardPaymentsStats;
  tickets: DashboardTicketsStats;
  notifications: DashboardNotificationsStats;
}

export interface DashboardRecentBooking {
  id: number;
  booking_type: 'service' | 'consultation';
  service: {
    id: number;
    name: string;
    sub_category: {
      id: number;
      name: string;
      category: {
        id: number;
        name: string;
      } | null;
    } | null;
  } | null;
  consultation: {
    id: number;
    name: string;
    category: {
      id: number;
      name: string;
    } | null;
  } | null;
  employee: {
    id: number;
    user: {
      id: number;
      name: string;
    } | null;
  } | null;
  booking_date: string;
  start_time: string;
  end_time: string;
  total_price: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  actual_status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  payment_status: 'paid' | 'unpaid';
  created_at: string;
}

export interface DashboardRecentTicket {
  id: number;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to: {
    id: number;
    name: string;
  } | null;
  latest_message: {
    id: number;
    message: string;
    created_at: string;
  } | null;
  created_at: string;
  resolved_at: string | null;
}

export interface DashboardData {
  user: DashboardUser;
  subscription: DashboardSubscription | null;
  pending_subscription_request: DashboardPendingRequest | null;
  stats: DashboardStats;
  recent_bookings: DashboardRecentBooking[];
  recent_tickets: DashboardRecentTicket[];
}

export interface DashboardResponse {
  success: boolean;
  message?: string;
  data?: DashboardData;
}

// ============================================
// Invoices Types
// ============================================

export interface InvoiceService {
  id: number;
  name: string;
  name_en: string;
  type: 'service' | 'consultation';
}

export interface InvoiceEmployee {
  id: number;
  name: string;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  booking_id: number;
  service: InvoiceService;
  employee: InvoiceEmployee;
  booking_date: string;
  start_time: string;
  end_time: string;
  total_price: string;
  status: string;
  payment_status: 'paid' | 'unpaid' | 'pending';
  paid_at: string | null;
  payment_id: string | null;
  payment_data: any;
  created_at: string | null;
}

export interface InvoicesPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface InvoicesResponse {
  success: boolean;
  data: {
    invoices: Invoice[];
    pagination: InvoicesPagination;
  };
  message?: string;
}

export interface GetInvoicesParams {
  status?: string;
  date_from?: string;
  date_to?: string;
  per_page?: number;
  page?: number;
}


