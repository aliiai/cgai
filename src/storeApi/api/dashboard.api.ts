/**
 * Dashboard API
 * 
 * APIs المتعلقة بالـ Dashboard:
 * - الحصول على بيانات Dashboard الكاملة
 */

import axios from 'axios';
import { API_BASE } from '../config/constants';
import { getAuthToken } from '../utils/auth.utils';
import type { DashboardResponse } from '../../types/types';

/**
 * الحصول على بيانات Dashboard الكاملة
 */
export const getDashboard = async (): Promise<DashboardResponse> => {
  try {
    const token = getAuthToken();
    if (!token || token === 'null' || token === 'undefined' || token.trim() === '') {
      return {
        success: false,
        message: 'يجب تسجيل الدخول أولاً'
      };
    }

    const response = await axios.get(
      `${API_BASE}/customer/dashboard`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token.trim()}`
        },
        timeout: 30000,
      }
    );

    // البيانات تأتي في response.data.data
    console.log('=== DASHBOARD API DEBUG ===');
    console.log('Full response.data:', response.data);
    console.log('response.data.data:', response.data.data);
    console.log('response.data.data?.recent_tickets:', response.data.data?.recent_tickets);
    console.log('Type of response.data.data:', typeof response.data.data);
    console.log('Is response.data.data an object?', response.data.data && typeof response.data.data === 'object');
    
    const apiData = response.data.data || response.data;
    console.log('apiData:', apiData);
    console.log('apiData.recent_tickets:', apiData?.recent_tickets);
    console.log('Is apiData.recent_tickets an array?', Array.isArray(apiData?.recent_tickets));
    
    // تحويل بيانات stats من الـ API إلى الشكل المتوقع
    const apiStats = apiData?.stats || {};
    
    // الحصول على القيم من الـ API (دعم كلا الشكلين: snake_case و nested bookings)
    const totalBookings = apiStats.total_bookings || apiStats.bookings?.total || 0;
    const completedBookings = apiStats.completed_bookings || apiStats.bookings?.completed || 0;
    const pendingBookings = apiStats.pending_bookings || apiStats.bookings?.pending || 0;
    const cancelledBookings = apiStats.cancelled_bookings || apiStats.bookings?.cancelled || 0;
    
    // حساب الحجوزات النشطة (total - completed - cancelled)
    // إذا كانت الحجوزات النشطة غير محددة في الـ API، نحسبها
    const activeBookings = totalBookings - completedBookings - cancelledBookings;
    
    const bookingsStats = {
      total: totalBookings,
      upcoming: apiStats.upcoming_bookings || apiStats.bookings?.upcoming || 0,
      pending: pendingBookings || 0,
      // إذا لم يكن confirmed محدداً، نستخدم الحجوزات النشطة المحسوبة
      confirmed: apiStats.confirmed_bookings || apiStats.bookings?.confirmed || Math.max(0, activeBookings - pendingBookings),
      in_progress: apiStats.in_progress_bookings || apiStats.bookings?.in_progress || 0,
      completed: completedBookings,
      cancelled: cancelledBookings,
      today: apiStats.today_bookings || apiStats.bookings?.today || 0
    };
    
    // التأكد من أن البيانات موجودة وتكون بالشكل الصحيح
    const dashboardData = {
      user: apiData?.user || apiData?.customer || null,
      subscription: apiData?.subscription || null,
      pending_subscription_request: apiData?.pending_subscription_request || null,
      stats: {
        bookings: bookingsStats,
        payments: apiStats.payments || apiData?.stats?.payments || { 
          total_spent: 0, 
          total_invoices: 0,
          paid_invoices: 0,
          this_month_spent: 0,
          average_per_booking: 0,
          paid_bookings: 0, 
          unpaid_bookings: 0 
        },
        tickets: apiStats.tickets || apiData?.stats?.tickets || { total: 0, open: 0, in_progress: 0, resolved: 0 },
        notifications: apiStats.notifications || apiData?.stats?.notifications || { unread_count: 0 },
        wallet: apiStats.wallet || apiData?.stats?.wallet || null,
        ratings: apiStats.ratings || apiData?.stats?.ratings || null,
        ready_apps: apiStats.ready_apps || apiData?.stats?.ready_apps || null,
        services: apiStats.services || apiData?.stats?.services || null
      },
      recent_bookings: Array.isArray(apiData?.recent_bookings) ? apiData.recent_bookings : (apiData?.recent_bookings ? [apiData.recent_bookings] : []),
      recent_tickets: Array.isArray(apiData?.recent_tickets) ? apiData.recent_tickets : (apiData?.recent_tickets ? [apiData.recent_tickets] : []),
      recent_invoices: Array.isArray(apiData?.recent_invoices) ? apiData.recent_invoices : (apiData?.recent_invoices ? [apiData.recent_invoices] : []),
      recent_ratings: Array.isArray(apiData?.recent_ratings) ? apiData.recent_ratings : (apiData?.recent_ratings ? [apiData.recent_ratings] : []),
      recent_activity: Array.isArray(apiData?.recent_activity) ? apiData.recent_activity : (apiData?.recent_activity ? [apiData.recent_activity] : []),
      upcoming_bookings: Array.isArray(apiData?.upcoming_bookings) ? apiData.upcoming_bookings : (apiData?.upcoming_bookings ? [apiData.upcoming_bookings] : [])
    };
    
    console.log('dashboardData after processing:', dashboardData);
    console.log('dashboardData.recent_tickets:', dashboardData.recent_tickets);
    console.log('dashboardData.recent_tickets length:', dashboardData.recent_tickets.length);
    console.log('=== END DASHBOARD API DEBUG ===');

    return {
      success: true,
      data: dashboardData,
    };
  } catch (error: any) {
    console.error('Get dashboard error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'فشل في جلب بيانات Dashboard',
    };
  }
};

