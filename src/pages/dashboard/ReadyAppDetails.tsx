import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ArrowRight, 
  ShoppingCart, 
  Star, 
  CheckCircle, 
  Package,
  Play,
  Share2,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2
} from 'lucide-react';
import LoadingState from '../../components/dashboard/LoadingState';
import { getReadyAppDetails, purchaseReadyApp, type ReadyApp } from '../../storeApi/api/ready-apps.api';
import { STORAGE_BASE_URL } from '../../storeApi/config/constants';
import { useLocalized } from '../../hooks/useLocalized';
import { createRating } from '../../storeApi/api/ratings.api';
import { useAuthStore } from '../../storeApi/storeApi';
import Swal from 'sweetalert2';

const ReadyAppDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();
  const [app, setApp] = useState<ReadyApp | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [mediaType, setMediaType] = useState<'images' | 'video'>('images');
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  const appId = id ? parseInt(id) : null;

  // Get image URL - handle both full URLs and relative paths
  const getImageUrl = (imagePath?: string | null): string => {
    if (!imagePath) return '';
    
    // If it's already a full URL
    if (typeof imagePath === 'string' && (imagePath.startsWith('http://') || imagePath.startsWith('https://'))) {
      return imagePath;
    }
    
    // If it's a relative path, prepend STORAGE_BASE_URL
    const cleanPath = typeof imagePath === 'string' && imagePath.startsWith('/') 
      ? imagePath.substring(1) 
      : imagePath || '';
    
    if (cleanPath.startsWith('storage/')) {
      return `${STORAGE_BASE_URL}/${cleanPath}`;
    }
    
    return `${STORAGE_BASE_URL}/storage/${cleanPath}`;
  };

  // Convert YouTube URL to embed URL
  const getYouTubeEmbedUrl = (url?: string | null): string | null => {
    if (!url) return null;
    
    // Check if it's already an embed URL
    if (url.includes('youtube.com/embed/')) {
      return url;
    }
    
    // Extract video ID from various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
      }
    }
    
    return null;
  };

  // Fetch app details
  const fetchAppDetails = useCallback(async () => {
    if (!appId) return;
    
    setIsLoading(true);
    try {
      const result = await getReadyAppDetails(appId);
      
      if (result.success && result.data) {
        setApp(result.data);
      }
    } catch (error) {
      console.error('Error fetching app details:', error);
    } finally {
      setIsLoading(false);
    }
  }, [appId, i18n.language]);

  useEffect(() => {
    fetchAppDetails();
  }, [fetchAppDetails]);

  // Re-fetch when language changes
  useEffect(() => {
    const handleLanguageChanged = async (lng: string) => {
      console.log('Language changed to:', lng, '- Refetching app details...');
      await fetchAppDetails();
    };

    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n, fetchAppDetails]);

  // Close rating modal on ESC key
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showRatingModal) {
        setShowRatingModal(false);
        setComment('');
        setRating(5);
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [showRatingModal]);

  // Use localized hook for app data - must always call hooks, even if app is null
  const localizedApp = useLocalized(app, ['name', 'description', 'short_description', 'full_description']);

  // Get images array
  const images = app?.images 
    ? (Array.isArray(app.images) 
        ? app.images.map((img: any) => typeof img === 'string' ? img : img.url)
        : [])
    : [];

  // Get screenshots array
  const screenshots = app?.screenshots 
    ? (Array.isArray(app.screenshots)
        ? app.screenshots.map((ss: any) => typeof ss === 'string' ? ss : ss.url)
        : [])
    : [];

  // Get rating value
  const ratingValue = typeof app?.rating === 'object' && app.rating?.average !== undefined
    ? app.rating.average
    : (typeof app?.rating === 'number' ? app.rating : 0);

  const reviewsCount = typeof app?.rating === 'object' && app.rating?.total_reviews !== undefined
    ? app.rating.total_reviews
    : (app?.reviews_count || 0);

  // Check if current user has already rated this app
  const hasUserRated = app?.reviews && user?.id 
    ? app.reviews.some((review: any) => review.user?.id === user.id)
    : false;

  // Get category name
  const categoryName = app?.category
    ? (i18n.language === 'ar' 
        ? (app.category.name || app.category.name_en || '')
        : (app.category.name_en || app.category.name || ''))
    : '';

  // Get price as number
  const price = typeof app?.price === 'string' ? parseFloat(app.price) : (app?.price || 0);
  const originalPrice = app?.original_price 
    ? (typeof app.original_price === 'string' ? parseFloat(app.original_price) : app.original_price)
    : null;

  // Calculate discount percentage if original price exists
  const discountPercentage = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  // Get video embed URL
  const videoEmbedUrl = getYouTubeEmbedUrl(app?.video_url);

  // Format date
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen || !app || images.length === 0) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setSelectedImageIndex((prev) => 
          prev === images.length - 1 ? 0 : prev + 1
        );
      } else if (e.key === 'ArrowLeft') {
        setSelectedImageIndex((prev) => 
          prev === 0 ? images.length - 1 : prev - 1
        );
      } else if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isLightboxOpen, app, images]);

  const handlePurchase = async () => {
    if (!appId) return;

    const primaryColor = '#114C5A';
    const bgColor = '#ffffff';
    const textColor = '#1e293b';
    const borderColor = '#e2e8f0';
    const inputBg = '#ffffff';
    const labelColor = '#475569';

    const { value: formValues } = await Swal.fire({
      title: `<div style="display: flex; align-items: center; gap: 12px; justify-content: ${i18n.language === 'ar' ? 'flex-end' : 'flex-start'};">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color: ${primaryColor};">
          <path d="M9 2L7.17 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4H16.83L15 2H9ZM12 7C15.31 7 18 9.69 18 13C18 16.31 15.31 19 12 19C8.69 19 6 16.31 6 13C6 9.69 8.69 7 12 7ZM12 9C9.79 9 8 10.79 8 13C8 15.21 9.79 17 12 17C14.21 17 16 15.21 16 13C16 10.79 14.21 9 12 9Z" fill="currentColor"/>
        </svg>
        <span style="font-size: 24px; font-weight: 700; color: ${textColor};">${i18n.language === 'ar' ? 'طلب شراء التطبيق' : 'Purchase Request'}</span>
      </div>`,
      html: `
        <style>
          .purchase-form-container {
            text-align: ${i18n.language === 'ar' ? 'right' : 'left'};
            padding: 8px 0;
          }
          .form-group {
            margin-bottom: 24px;
          }
          .form-label {
            display: block;
            margin-bottom: 10px;
            font-weight: 600;
            font-size: 14px;
            color: ${labelColor};
            letter-spacing: 0.3px;
          }
          .form-label .required {
            color: #ef4444;
            margin-${i18n.language === 'ar' ? 'left' : 'right'}: 4px;
          }
          .form-input {
            width: 100%;
            padding: 14px 16px;
            border-radius: 12px;
            border: 2px solid ${borderColor};
            background: ${inputBg};
            color: ${textColor};
            font-size: 15px;
            transition: all 0.3s ease;
            font-family: inherit;
            box-sizing: border-box;
          }
          .form-input:focus {
            outline: none;
            border-color: ${primaryColor};
            box-shadow: 0 0 0 3px ${primaryColor}20;
          }
          .form-textarea {
            min-height: 120px;
            resize: vertical;
            line-height: 1.6;
          }
          .form-select {
            cursor: pointer;
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='${encodeURIComponent(textColor)}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: ${i18n.language === 'ar' ? 'left' : 'right'} 16px center;
            padding-${i18n.language === 'ar' ? 'left' : 'right'}: 40px;
          }
          .form-input::placeholder {
            color: #94a3b8;
            opacity: 0.7;
          }
        </style>
        <div class="purchase-form-container">
          <div class="form-group">
            <label class="form-label">
              ${i18n.language === 'ar' ? 'ملاحظات' : 'Notes'}
              <span style="color: ${labelColor}; font-weight: 400; font-size: 12px;">(${i18n.language === 'ar' ? 'اختياري' : 'Optional'})</span>
            </label>
            <textarea 
              id="swal-notes" 
              class="form-input form-textarea" 
              placeholder="${i18n.language === 'ar' ? 'أدخل أي ملاحظات إضافية أو متطلبات خاصة...' : 'Enter any additional notes or special requirements...'}"
              dir="${i18n.language === 'ar' ? 'rtl' : 'ltr'}"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label class="form-label">
              ${i18n.language === 'ar' ? 'تفضيل التواصل' : 'Contact Preference'}
              <span class="required">*</span>
            </label>
            <select 
              id="swal-contact-preference" 
              class="form-input form-select"
              dir="${i18n.language === 'ar' ? 'rtl' : 'ltr'}"
            >
              <option value="">${i18n.language === 'ar' ? '-- اختر طريقة التواصل --' : '-- Select Contact Method --'}</option>
              <option value="phone">${i18n.language === 'ar' ? '📞 هاتف' : '📞 Phone'}</option>
              <option value="email">${i18n.language === 'ar' ? '✉️ بريد إلكتروني' : '✉️ Email'}</option>
            </select>
          </div>
        </div>
      `,
      width: '600px',
      padding: '2.5rem',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: `<span style="display: flex; align-items: center; gap: 8px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 13L9 17L19 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        ${i18n.language === 'ar' ? 'إرسال الطلب' : 'Submit Request'}
      </span>`,
      cancelButtonText: i18n.language === 'ar' ? 'إلغاء' : 'Cancel',
      confirmButtonColor: primaryColor,
      cancelButtonColor: '#94a3b8',
      background: bgColor,
      color: textColor,
      backdrop: true,
      allowOutsideClick: false,
      customClass: {
        popup: 'rounded-3xl shadow-2xl border border-gray-200',
        title: 'mb-0',
        htmlContainer: 'mt-4',
        confirmButton: 'px-6 py-3 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all',
        cancelButton: 'px-6 py-3 rounded-xl font-semibold text-base hover:opacity-80 transition-all',
        actions: 'gap-3 mt-6',
      },
      buttonsStyling: false,
      preConfirm: () => {
        const notes = (document.getElementById('swal-notes') as HTMLTextAreaElement)?.value || '';
        const contactPreference = (document.getElementById('swal-contact-preference') as HTMLSelectElement)?.value;
        
        if (!contactPreference) {
          Swal.showValidationMessage(
            `<span style="color: #ef4444; font-weight: 500;">
              ${i18n.language === 'ar' ? '⚠️ يرجى اختيار تفضيل التواصل' : '⚠️ Please select contact preference'}
            </span>`
          );
          return false;
        }

        return {
          notes: notes.trim(),
          contact_preference: contactPreference as 'phone' | 'email',
        };
      },
    });

    if (!formValues) return; // User cancelled

    // Show loading
    Swal.fire({
      title: i18n.language === 'ar' ? 'جاري المعالجة...' : 'Processing...',
      text: i18n.language === 'ar' ? 'يرجى الانتظار' : 'Please wait',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      background: '#ffffff',
      color: '#1e293b',
    });

    try {
      const result = await purchaseReadyApp(appId, formValues);

      if (result.success) {
        const bgColor = '#ffffff';
        const textColor = '#1e293b';
        const cardBg = '#f8fafc';
        const labelColor = '#475569';
        
        await Swal.fire({
          icon: 'success',
          iconColor: '#10b981',
          title: `<div style="font-size: 24px; font-weight: 700; color: ${textColor};">
            ${i18n.language === 'ar' ? '✅ تم إرسال الطلب بنجاح!' : '✅ Request Sent Successfully!'}
          </div>`,
          html: `
            <div style="text-align: ${i18n.language === 'ar' ? 'right' : 'left'};">
              <p style="color: ${textColor}; margin-bottom: 20px; font-size: 16px; line-height: 1.6;">
                ${result.message || (i18n.language === 'ar' ? 'تم إنشاء طلب الشراء بنجاح، سنتواصل معك قريباً' : 'Purchase order created successfully, we will contact you soon')}
              </p>
              <div style="background: ${cardBg}; padding: 20px; border-radius: 16px; margin-top: 16px; border: 1px solid #e2e8f0;">
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                  <span style="color: ${labelColor}; font-size: 14px; font-weight: 500;">
                    ${i18n.language === 'ar' ? 'رقم الطلب' : 'Order ID'}
                  </span>
                  <span style="color: ${textColor}; font-size: 16px; font-weight: 700;">
                    #${result.data.order_id}
                  </span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0;">
                  <span style="color: ${labelColor}; font-size: 14px; font-weight: 500;">
                    ${i18n.language === 'ar' ? 'الحالة' : 'Status'}
                  </span>
                  <span style="background: ${result.data.status === 'pending' ? '#f59e0b' : '#10b981'}; color: white; padding: 6px 12px; border-radius: 8px; font-size: 13px; font-weight: 600; text-transform: capitalize;">
                    ${result.data.status}
                  </span>
                </div>
              </div>
            </div>
          `,
          confirmButtonText: i18n.language === 'ar' ? 'حسناً' : 'OK',
          confirmButtonColor: '#114C5A',
          background: bgColor,
          color: textColor,
          width: '550px',
          padding: '2.5rem',
          customClass: {
            popup: 'rounded-3xl shadow-2xl border border-gray-200',
            confirmButton: 'px-8 py-3 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all',
          },
          buttonsStyling: false,
        });
      } else {
        throw new Error(result.message || 'فشل إنشاء طلب الشراء');
      }
    } catch (error: any) {
      console.error('Purchase error:', error);
      await Swal.fire({
        icon: 'error',
        title: i18n.language === 'ar' ? 'حدث خطأ!' : 'Error!',
        text: error.message || (i18n.language === 'ar' ? 'فشل إنشاء طلب الشراء. يرجى المحاولة مرة أخرى.' : 'Failed to create purchase order. Please try again.'),
        confirmButtonText: i18n.language === 'ar' ? 'حسناً' : 'OK',
        confirmButtonColor: '#ef4444',
        background: '#ffffff',
        color: '#1e293b',
      });
    }
  };

  const handleSubmitRating = async () => {
    if (!appId) return;

    if (rating < 1 || rating > 5) {
      Swal.fire({
        icon: 'warning',
        title: i18n.language === 'ar' ? 'تنبيه!' : 'Warning!',
        text: i18n.language === 'ar' ? 'يرجى اختيار تقييم من 1 إلى 5' : 'Please select a rating from 1 to 5',
        confirmButtonText: i18n.language === 'ar' ? 'حسناً' : 'OK',
        confirmButtonColor: '#114C5A',
      });
      return;
    }

    setIsSubmittingRating(true);
    try {
      const result = await createRating({
        ratable_id: appId,
        ratable_type: 'ready_app',
        rating: rating,
        comment: comment || undefined,
      });

      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: i18n.language === 'ar' ? 'تم بنجاح!' : 'Success!',
          text: result.message || (i18n.language === 'ar' ? 'تم إضافة التقييم بنجاح' : 'Rating added successfully'),
          confirmButtonText: i18n.language === 'ar' ? 'حسناً' : 'OK',
          confirmButtonColor: '#114C5A',
        });
        setShowRatingModal(false);
        setComment('');
        setRating(5);
        // Refresh app details to show updated rating
        await fetchAppDetails();
      } else {
        Swal.fire({
          icon: 'error',
          title: i18n.language === 'ar' ? 'حدث خطأ!' : 'Error!',
          text: result.message || (i18n.language === 'ar' ? 'فشل إضافة التقييم' : 'Failed to add rating'),
          confirmButtonText: i18n.language === 'ar' ? 'حسناً' : 'OK',
          confirmButtonColor: '#ef4444',
        });
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: i18n.language === 'ar' ? 'حدث خطأ!' : 'Error!',
        text: error.message || (i18n.language === 'ar' ? 'فشل إضافة التقييم. يرجى المحاولة مرة أخرى.' : 'Failed to add rating. Please try again.'),
        confirmButtonText: i18n.language === 'ar' ? 'حسناً' : 'OK',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const handleShare = async () => {
    const appName = localizedApp?.name || app?.name_en || 'App';
    const appUrl = window.location.href;
    const shareText = `${appName} - ${localizedApp?.short_description || ''}`;

    // Check if Web Share API is available (mobile devices)
    if (navigator.share) {
      try {
        await navigator.share({
          title: appName,
          text: shareText,
          url: appUrl,
        });
      } catch (error: any) {
        // User cancelled or error occurred
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(appUrl);
        // Show success message
        if (i18n.language === 'ar') {
          alert('تم نسخ الرابط إلى الحافظة');
        } else {
          alert('Link copied to clipboard');
        }
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        // Fallback: Show URL in prompt
        prompt(i18n.language === 'ar' ? 'انسخ الرابط:' : 'Copy this link:', appUrl);
      }
    }
  };

  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set(prev).add(index));
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!app) {
    return (
      <div className="flex items-center justify-center py-20 bg-gray-50">
        <div className="text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-2 text-gray-900">
            {t('dashboard.readyApps.appNotFound') || 'التطبيق غير موجود'}
          </h2>
          <button
            onClick={() => navigate('/admin/ready-apps')}
            className="mt-4 px-6 py-2 bg-[#114C5A] text-white rounded-xl font-semibold hover:bg-[#114C5A]/90 transition"
          >
            {t('dashboard.readyApps.backToList') || 'العودة للقائمة'}
          </button>
        </div>
      </div>
    );
  }

  // Get main image or first image
  const mainImageUrl = getImageUrl(app.main_image || images[0]);

  return (
    <div className="bg-gray-50">
      {/* Hero Section with Background */}
      <div className="relative">
        {/* Background Image/Overlay */}
        {mainImageUrl && (
          <div className="absolute inset-0 h-[60vh] min-h-[400px] max-h-[600px]">
            <img 
              src={mainImageUrl} 
              alt={localizedApp?.name || app?.name_en || 'App'}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90" />
          </div>
        )}
        
        {/* Content Overlay */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          {/* Back Button */}
          <button
            onClick={() => navigate('/admin/ready-apps')}
            className="mb-6 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-xl font-semibold hover:bg-white/20 transition shadow-lg"
          >
            <ArrowRight className="w-5 h-5" />
            {t('dashboard.readyApps.backToList') || 'العودة للقائمة'}
          </button>

          {/* App Info */}
          <div className="max-w-4xl">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {app.is_new && (
                <span className="px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-full shadow-lg backdrop-blur-sm">
                  {t('dashboard.readyApps.new') || 'جديد'}
                </span>
              )}
              {app.is_popular && (
                <span className="px-4 py-2 bg-orange-500 text-white text-sm font-bold rounded-full shadow-lg backdrop-blur-sm">
                  {t('dashboard.readyApps.popular') || 'شائع'}
                </span>
              )}
              {app.is_featured && (
                <span className="px-4 py-2 bg-purple-500 text-white text-sm font-bold rounded-full shadow-lg backdrop-blur-sm">
                  {t('dashboard.readyApps.featured') || 'مميز'}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-lg">
              {localizedApp?.name || app?.name_en || 'Untitled App'}
            </h1>

            {/* Short Description */}
            {localizedApp?.short_description && (
              <p className="text-xl md:text-2xl text-white/90 mb-6 drop-shadow">
                {localizedApp.short_description}
              </p>
            )}

            {/* Price & Rating */}
            <div className="flex flex-wrap items-center gap-6 mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-white drop-shadow-lg">
                  {price.toLocaleString()} {app.currency || 'ر.س'}
                </span>
                {originalPrice && originalPrice > price && (
                  <span className="text-xl line-through text-white/70">
                    {originalPrice.toLocaleString()} {app.currency || 'ر.س'}
                  </span>
                )}
              </div>
              {discountPercentage && (
                <span className="px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-full shadow-lg">
                  {t('dashboard.readyApps.discount') || 'خصم'} {discountPercentage}%
                </span>
              )}
              {ratingValue > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(ratingValue)
                            ? 'text-yellow-400 fill-current'
                            : 'text-white/30'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-white font-semibold">
                    {ratingValue.toFixed(1)} ({reviewsCount})
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handlePurchase}
                className="px-8 py-4 bg-[#114C5A] text-white rounded-xl font-bold text-lg hover:bg-[#114C5A]/90 transition shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                {t('dashboard.readyApps.buyNow') || 'شراء الآن'}
              </button>
              <button
                onClick={handleShare}
                className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-xl font-bold text-lg hover:bg-white/20 transition border-2 border-white/30 flex items-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                {t('dashboard.readyApps.share') || 'مشاركة'}
              </button>
            </div>

            {/* Add Rating Button */}
            {!hasUserRated && (
              <button
                onClick={() => setShowRatingModal(true)}
                className="mt-8 px-6 py-3 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition flex items-center justify-center gap-2"
              >
                <Star className="w-5 h-5" />
                {t('dashboard.readyApps.addRating') || 'أضف تقييم'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">

        {/* Content Card */}
        <div className="rounded-xl shadow-lg overflow-hidden bg-white border border-[#114C5A]/10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 md:p-8 lg:p-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Media Gallery Section */}
              <div className="rounded-xl overflow-hidden border border-[#114C5A]/10 bg-white">
              {/* Media Type Tabs */}
              {(images.length > 0 || app.video_url) && (
                <div className="flex gap-2 p-4 border-b border-[#114C5A]/10">
                  {images.length > 0 && (
                    <button
                      onClick={() => setMediaType('images')}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        mediaType === 'images'
                          ? 'bg-[#114C5A] text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {t('dashboard.readyApps.images') || 'الصور'} ({images.length})
                    </button>
                  )}
                  {app.video_url && (
                    <button
                      onClick={() => setMediaType('video')}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        mediaType === 'video'
                          ? 'bg-[#114C5A] text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {t('dashboard.readyApps.video') || 'فيديو توضيحي'}
                    </button>
                  )}
                </div>
              )}

              {/* Images Gallery */}
              {mediaType === 'images' && images.length > 0 ? (
                <div className="relative">
                  {/* Main Image */}
                  <div className="relative group">
                    {!imageErrors.has(selectedImageIndex) ? (
                      <img 
                        src={getImageUrl(images[selectedImageIndex])} 
                        alt={`${localizedApp?.name || app?.name_en || 'App'} - ${t('dashboard.readyApps.image') || 'صورة'} ${selectedImageIndex + 1}`}
                        className="w-full h-[500px] object-cover cursor-pointer"
                        onClick={() => setIsLightboxOpen(true)}
                        onError={() => handleImageError(selectedImageIndex)}
                      />
                    ) : (
                      <div className="w-full h-[500px] flex items-center justify-center bg-gradient-to-br from-[#114C5A]/10 to-[#114C5A]/5">
                        <Package className="w-32 h-32 text-[#114C5A]/30" />
                      </div>
                    )}
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="bg-white/90 rounded-full p-3">
                        <Maximize2 className="w-6 h-6 text-gray-900" />
                      </div>
                    </div>
                    
                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImageIndex((prev) => 
                              prev === 0 ? images.length - 1 : prev - 1
                            );
                          }}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2 rounded-full shadow-lg transition hover:scale-110"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImageIndex((prev) => 
                              prev === images.length - 1 ? 0 : prev + 1
                            );
                          }}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2 rounded-full shadow-lg transition hover:scale-110"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      {selectedImageIndex + 1} / {images.length}
                    </div>
                  </div>

                  {/* Thumbnails */}
                  {images.length > 1 && (
                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {images.map((image: string, index: number) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition ${
                              selectedImageIndex === index
                                ? 'border-[#114C5A] ring-2 ring-[#114C5A]/50'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            {!imageErrors.has(index) ? (
                              <img 
                                src={getImageUrl(image)} 
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={() => handleImageError(index)}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                <Package className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : mediaType === 'images' ? (
                <div className="h-[500px] flex items-center justify-center bg-gradient-to-br from-[#114C5A]/10 to-[#114C5A]/5">
                  <div className="text-center">
                    <Package className="w-32 h-32 text-[#114C5A]/30 mx-auto mb-4" />
                    <p className="text-lg text-gray-500">
                      {t('dashboard.readyApps.noImages') || 'لا توجد صور متاحة'}
                    </p>
                  </div>
                </div>
              ) : null}

              {/* Video Section */}
              {mediaType === 'video' && videoEmbedUrl ? (
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    src={videoEmbedUrl}
                    className="absolute top-0 left-0 w-full h-full rounded-b-2xl"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : mediaType === 'video' && app.video_url ? (
                <div className="p-6">
                  <a
                    href={app.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 p-6 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition font-bold text-lg"
                  >
                    <Play className="w-6 h-6" />
                    {t('dashboard.readyApps.watchOnYouTube') || 'شاهد على YouTube'}
                  </a>
                </div>
              ) : mediaType === 'video' ? (
                <div className="h-[500px] flex items-center justify-center bg-gradient-to-br from-[#114C5A]/10 to-[#114C5A]/5">
                  <div className="text-center">
                    <Play className="w-32 h-32 text-[#114C5A]/30 mx-auto mb-4" />
                    <p className="text-lg text-gray-500">
                      {t('dashboard.readyApps.noVideo') || 'لا يوجد فيديو متاح'}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Screenshots Section */}
            {screenshots.length > 0 && (
              <div className="rounded-xl p-6 border border-[#114C5A]/10 bg-white">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">
                  {t('dashboard.readyApps.screenshots') || 'لقطات الشاشة'}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {screenshots.map((screenshot: string, index: number) => (
                    <div
                      key={index}
                      className="relative group cursor-pointer rounded-lg overflow-hidden border-2 border-transparent hover:border-[#114C5A] transition"
                      onClick={() => {
                        setMediaType('images');
                        const imageIndex = images.findIndex((img: string) => img === screenshot);
                        if (imageIndex >= 0) {
                          setSelectedImageIndex(imageIndex);
                        }
                      }}
                    >
                      <img 
                        src={getImageUrl(screenshot)} 
                        alt={`Screenshot ${index + 1}`}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Maximize2 className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description Section */}
            <div className="rounded-xl p-6 border border-[#114C5A]/10 bg-white">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                {t('dashboard.readyApps.fullDescription') || 'الوصف الكامل'}
              </h2>
              <p className="leading-relaxed whitespace-pre-line text-gray-600">
                {localizedApp?.full_description || localizedApp?.description || localizedApp?.short_description || 
                 (t('dashboard.readyApps.noDescription') || 'لا يوجد وصف متاح')}
              </p>
            </div>

            {/* Features Section */}
            {app.features && app.features.length > 0 && (
              <div className="rounded-xl p-6 border border-[#114C5A]/10 bg-white">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                  {t('dashboard.readyApps.features') || 'المميزات الرئيسية'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {app.features.map((feature: any, index: number) => {
                    const featureTitle = i18n.language === 'ar' 
                      ? feature.title 
                      : (feature.title_en || feature.title);
                    return (
                      <div key={feature.id || index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">
                          {featureTitle}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="rounded-xl p-6 border border-[#114C5A]/10 bg-white">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                {t('dashboard.readyApps.ratings') || 'التقييمات'}
              </h2>
              {ratingValue > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-6 h-6 ${
                              i < Math.floor(ratingValue)
                                ? 'text-[#FFB200] fill-current'
                                : i < ratingValue
                                  ? 'text-[#FFB200] fill-current opacity-50'
                                  : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xl font-bold text-gray-900">
                        {ratingValue.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-gray-500">
                      ({reviewsCount} {t('dashboard.readyApps.reviews') || 'تقييم'})
                    </span>
                  </div>
                  {app.rating && typeof app.rating === 'object' && app.rating.breakdown && (
                    <div className="space-y-2 pt-4 border-t border-gray-200/50">
                      {Object.entries(app.rating.breakdown).reverse().map(([stars, count]: [string, any]) => (
                        <div key={stars} className="flex items-center gap-3">
                          <span className="text-sm font-semibold w-12 text-gray-700">
                            {stars} {t('dashboard.readyApps.stars') || 'نجمة'}
                          </span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#FFB200] rounded-full"
                              style={{
                                width: `${reviewsCount > 0 ? (count / reviewsCount) * 100 : 0}%`
                              }}
                            />
                          </div>
                          <span className="text-sm w-12 text-right text-gray-500">
                            {count}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Star className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg text-gray-500">
                    {t('dashboard.readyApps.noRatings') || 'لا توجد تقييمات بعد'}
                  </p>
                </div>
              )}
            </div>

            {/* Reviews List Section */}
            {app.reviews && app.reviews.length > 0 && (
              <div className="rounded-xl p-6 border border-[#114C5A]/10 bg-white mt-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">
                  {t('dashboard.readyApps.reviewsList') || 'التقييمات والتعليقات'} ({app.reviews.length})
                </h2>
                <div className="space-y-4">
                  {app.reviews.map((review: any) => {
                    // Get avatar URL
                    const avatarUrl = review.user?.avatar 
                      ? (review.user.avatar.startsWith('http') 
                          ? review.user.avatar 
                          : `${STORAGE_BASE_URL}/${review.user.avatar.replace(/^\//, '')}`)
                      : null;
                    
                    // Format date
                    const reviewDate = review.created_at 
                      ? new Date(review.created_at).toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : '';

                    // Get comment based on language
                    const reviewComment = i18n.language === 'ar' 
                      ? review.comment 
                      : (review.comment_en || review.comment);

                    return (
                      <div key={review.id} className="p-4 bg-gray-50 rounded-lg border border-[#114C5A]/10">
                        <div className="flex items-start gap-3 mb-3">
                          {/* User Avatar */}
                          {avatarUrl ? (
                            <img 
                              src={avatarUrl} 
                              alt={review.user?.name || 'User'} 
                              className="w-10 h-10 rounded-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                if (target.nextElementSibling) {
                                  (target.nextElementSibling as HTMLElement).style.display = 'flex';
                                }
                              }}
                            />
                          ) : null}
                          <div 
                            className={`w-10 h-10 rounded-full bg-[#114C5A] text-white flex items-center justify-center font-bold text-sm ${avatarUrl ? 'hidden' : 'flex'}`}
                          >
                            {review.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          
                          {/* User Info and Rating */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-semibold text-gray-900 text-sm">
                                {review.user?.name || t('dashboard.readyApps.anonymous') || 'مجهول'}
                              </p>
                              {reviewDate && (
                                <span className="text-xs text-gray-500">
                                  {reviewDate}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= (review.rating || 0)
                                      ? 'fill-[#FFB200] text-[#FFB200]'
                                      : 'fill-gray-200 text-gray-200'
                                  }`}
                                />
                              ))}
                            </div>
                            {reviewComment && (
                              <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                                {reviewComment}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

            {/* Sidebar - Purchase Section */}
            <div className="space-y-6">
              {/* Purchase Card */}
              <div className="rounded-xl p-6 border border-[#114C5A]/10 sticky top-8 shadow-lg bg-white">
              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-black text-gray-900">
                    {price.toLocaleString()} {app.currency || 'ر.س'}
                  </span>
                  {originalPrice && originalPrice > price && (
                    <span className="text-lg line-through text-gray-400">
                      {originalPrice.toLocaleString()} {app.currency || 'ر.س'}
                    </span>
                  )}
                </div>
                {discountPercentage && (
                  <span className="inline-block px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-full">
                    {t('dashboard.readyApps.discount') || 'خصم'} {discountPercentage}%
                  </span>
                )}
              </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={handlePurchase}
                    className="w-full flex items-center justify-center gap-2 bg-[#114C5A] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#114C5A]/90 transition shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {t('dashboard.readyApps.buyNow') || 'شراء الآن'}
                  </button>
                </div>

                {/* Share Button */}
                <div className="mt-6 pt-6 border-t border-gray-200/50">
                  <button
                    onClick={handleShare}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition hover:scale-105 bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    <Share2 className="w-5 h-5" />
                    {t('dashboard.readyApps.share') || 'مشاركة'}
                  </button>
                </div>

                {/* Add Rating Button */}
                {!hasUserRated && (
                  <div className="mt-6 pt-6 border-t border-gray-200/50">
                    <button
                      onClick={() => setShowRatingModal(true)}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition hover:scale-105 bg-[#FFB200] text-white hover:bg-[#FFB200]/90"
                    >
                      <Star className="w-5 h-5" />
                      {t('dashboard.readyApps.addRating') || 'أضف تقييم'}
                    </button>
                  </div>
                )}

              {/* Info */}
              <div className="mt-6 pt-6 border-t border-gray-200/50 space-y-3 text-gray-500 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>{t('dashboard.readyApps.qualityGuarantee') || 'ضمان الجودة'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>{t('dashboard.readyApps.oneYearSupport') || 'دعم فني لمدة سنة'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>{t('dashboard.readyApps.freeUpdates') || 'تحديثات مجانية'}</span>
                </div>
              </div>
            </div>

              {/* Category Badge */}
              {categoryName && (
                <div className="rounded-xl p-4 border border-[#114C5A]/10 shadow-md bg-white">
                  <span className="text-sm font-semibold text-gray-500">
                    {t('dashboard.readyApps.category') || 'الفئة'}:
                  </span>
                  <span className="block mt-1 text-lg font-bold text-gray-900">
                    {categoryName}
                  </span>
                </div>
              )}

              {/* Statistics */}
              <div className="rounded-xl p-4 border border-[#114C5A]/10 shadow-md bg-white">
              <h3 className="text-lg font-bold mb-3 text-gray-900">
                {t('dashboard.readyApps.statistics') || 'الإحصائيات'}
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">
                    {t('dashboard.readyApps.views') || 'المشاهدات'}:
                  </span>
                  <span className="font-semibold text-gray-900">
                    {app.statistics?.views || app.views_count || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">
                    {t('dashboard.readyApps.purchases') || 'المشتريات'}:
                  </span>
                  <span className="font-semibold text-gray-900">
                    {app.statistics?.purchases || app.purchases_count || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">
                    {t('dashboard.readyApps.favorites') || 'المفضلة'}:
                  </span>
                  <span className="font-semibold text-gray-900">
                    {app.statistics?.favorites || app.favorites_count || 0}
                  </span>
                </div>
                {app.reviews_count !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">
                      {t('dashboard.readyApps.reviews') || 'التقييمات'}:
                    </span>
                    <span className="font-semibold text-gray-900">
                      {app.reviews_count || 0}
                    </span>
                  </div>
                )}
              </div>
            </div>

              {/* Additional Info */}
              <div className="rounded-xl p-4 border border-[#114C5A]/10 shadow-md bg-white">
              <h3 className="text-lg font-bold mb-3 text-gray-900">
                {t('dashboard.readyApps.additionalInfo') || 'معلومات إضافية'}
              </h3>
              <div className="space-y-2">
                {app.created_at && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">
                      {t('dashboard.readyApps.createdAt') || 'تاريخ الإضافة'}:
                    </span>
                    <span className="text-sm font-semibold text-gray-700">
                      {formatDate(app.created_at)}
                    </span>
                  </div>
                )}
                {app.updated_at && app.updated_at !== app.created_at && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">
                      {t('dashboard.readyApps.updatedAt') || 'آخر تحديث'}:
                    </span>
                    <span className="text-sm font-semibold text-gray-700">
                      {formatDate(app.updated_at)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">
                    {t('dashboard.readyApps.status') || 'الحالة'}:
                  </span>
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    app.is_active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {app.is_active 
                      ? (t('dashboard.readyApps.active') || 'نشط')
                      : (t('dashboard.readyApps.inactive') || 'غير نشط')
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Lightbox Modal */}
        {isLightboxOpen && images.length > 0 && (
          <div 
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            <div className="relative max-w-7xl w-full h-full flex items-center">
              {/* Close Button */}
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Main Image */}
              <div 
                className="relative w-full h-full flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                {!imageErrors.has(selectedImageIndex) ? (
                  <img 
                    src={getImageUrl(images[selectedImageIndex])} 
                    alt={`${localizedApp?.name} - ${t('dashboard.readyApps.image') || 'صورة'} ${selectedImageIndex + 1}`}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-32 h-32 text-white/30" />
                  </div>
                )}

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImageIndex((prev) => 
                        prev === 0 ? images.length - 1 : prev - 1
                      )}
                      className="absolute right-4 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition"
                    >
                      <ChevronRight className="w-8 h-8" />
                    </button>
                    <button
                      onClick={() => setSelectedImageIndex((prev) => 
                        prev === images.length - 1 ? 0 : prev + 1
                      )}
                      className="absolute left-4 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition"
                    >
                      <ChevronLeft className="w-8 h-8" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-6 py-3 rounded-full text-lg font-semibold">
                  {selectedImageIndex + 1} / {images.length}
                </div>

                {/* Thumbnails Strip */}
                {images.length > 1 && (
                  <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-4xl overflow-x-auto px-4">
                    {images.map((image: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                          selectedImageIndex === index
                            ? 'border-[#114C5A] ring-2 ring-[#114C5A]/50'
                            : 'border-white/30 hover:border-white/50'
                        }`}
                      >
                        {!imageErrors.has(index) ? (
                          <img 
                            src={getImageUrl(image)} 
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={() => handleImageError(index)}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-800">
                            <Package className="w-8 h-8 text-white/30" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowRatingModal(false);
              setComment('');
              setRating(5);
            }
          }}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#114C5A] text-white p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {t('dashboard.readyApps.rateApp') || 'قيم التطبيق'}
              </h2>
              <button
                onClick={() => {
                  setShowRatingModal(false);
                  setComment('');
                  setRating(5);
                }}
                className="text-white hover:text-gray-200 transition-colors p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Rating Stars */}
              <div className="space-y-3">
                <label className="block text-gray-700 font-semibold text-lg">
                  {t('dashboard.readyApps.rating') || 'التقييم'}:
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none transform hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-10 h-10 transition ${
                            star <= rating
                              ? 'text-[#FFB200] fill-[#FFB200]'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xl font-bold text-gray-700">({rating}/5)</span>
                </div>
              </div>

              {/* Comment */}
              <div className="space-y-2">
                <label className="block text-gray-700 font-semibold text-lg">
                  {t('dashboard.readyApps.comment') || 'التعليق'}:
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t('dashboard.readyApps.commentPlaceholder') || 'اكتب تعليقك هنا...'}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#114C5A] resize-none"
                  rows={5}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSubmitRating}
                  disabled={isSubmittingRating}
                  className="flex-1 px-6 py-3 bg-[#114C5A] text-white rounded-lg font-semibold hover:bg-[#114C5A]/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmittingRating
                    ? (i18n.language === 'ar' ? 'جاري الإرسال...' : 'Submitting...')
                    : (t('dashboard.readyApps.submitRating') || 'إرسال التقييم')}
                </button>
                <button
                  onClick={() => {
                    setShowRatingModal(false);
                    setComment('');
                    setRating(5);
                  }}
                  disabled={isSubmittingRating}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('dashboard.readyApps.cancel') || 'إلغاء'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadyAppDetails;
