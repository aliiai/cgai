import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ArrowRight, 
  Star, 
  CheckCircle, 
  Sparkles,
  Play,
  Share2,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Eye,
  Heart,
  Image as ImageIcon
} from 'lucide-react';
import LoadingState from '../../components/dashboard/LoadingState';
import EmptyState from '../../components/dashboard/EmptyState';
import { getAIServiceDetails, purchaseAIService, type AIServiceDetails } from '../../storeApi/api/ai-services.api';
import { STORAGE_BASE_URL } from '../../storeApi/config/constants';
import Swal from 'sweetalert2';

const AIServiceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [service, setService] = useState<AIServiceDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const serviceId = id ? parseInt(id) : null;

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

  // Fetch service details
  const fetchServiceDetails = useCallback(async () => {
    if (!serviceId) return;
    
    setIsLoading(true);
    try {
      const locale = i18n.language === 'ar' ? 'ar' : 'en';
      const result = await getAIServiceDetails(serviceId, locale);
      
      if (result.success && result.data) {
        setService(result.data);
      }
    } catch (error) {
      console.error('Error fetching service details:', error);
    } finally {
      setIsLoading(false);
    }
  }, [serviceId, i18n.language]);

  useEffect(() => {
    fetchServiceDetails();
  }, [fetchServiceDetails]);

  // Re-fetch when language changes
  useEffect(() => {
    const handleLanguageChanged = async (lng: string) => {
      await fetchServiceDetails();
    };

    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n, fetchServiceDetails]);

  // Get service name based on current language
  const getServiceName = (service: AIServiceDetails) => {
    return i18n.language === 'ar' ? service.name : (service.name_en || service.name);
  };

  // Get service description based on current language
  const getServiceDescription = (service: AIServiceDetails, type: 'short' | 'full' = 'short') => {
    if (type === 'full') {
      return i18n.language === 'ar' 
        ? service.full_description || service.description
        : (service.full_description_en || service.description_en || service.full_description || service.description);
    }
    return i18n.language === 'ar' 
      ? service.short_description || service.description
      : (service.short_description_en || service.description_en || service.short_description || service.description);
  };

  // Get category name based on current language
  const getCategoryName = (category: AIServiceDetails['category']) => {
    return i18n.language === 'ar' 
      ? category.name 
      : (category.name_en || category.name);
  };

  // Get images array
  const images = service?.images 
    ? service.images
        .filter(img => img.type === 'main' || img.type === 'gallery')
        .sort((a, b) => a.order - b.order)
        .map(img => img.url)
    : [];

  // Get screenshots array
  const screenshots = service?.screenshots 
    ? service.screenshots
        .sort((a, b) => a.order - b.order)
        .map(ss => ss.url)
    : [];

  // Get rating value
  const ratingValue = typeof service?.rating === 'object' && service.rating?.average !== undefined
    ? service.rating.average
    : (typeof service?.rating === 'number' ? service.rating : 0);

  const reviewsCount = typeof service?.rating === 'object' && service.rating?.total_reviews !== undefined
    ? service.rating.total_reviews
    : (service?.reviews_count || 0);

  // Get price as number
  const price = typeof service?.price === 'string' ? parseFloat(service.price) : (service?.price || 0);
  const originalPrice = service?.original_price 
    ? (typeof service.original_price === 'string' ? parseFloat(service.original_price) : service.original_price)
    : null;

  // Calculate discount percentage if original price exists
  const discountPercentage = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  // Get video embed URL
  const videoEmbedUrl = getYouTubeEmbedUrl(service?.video_url);

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
    if (!isLightboxOpen || !service || images.length === 0) return;

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
  }, [isLightboxOpen, service, images]);

  const handleUseService = async () => {
    if (!service || !serviceId) return;

    const primaryColor = '#114C5A';
    const bgColor = '#ffffff';
    const textColor = '#1e293b';
    const borderColor = '#e2e8f0';
    const inputBg = '#ffffff';
    const labelColor = '#475569';

    const { value: formValues } = await Swal.fire({
      title: `<div style="display: flex; align-items: center; gap-10px; justify-content: ${isRTL ? 'flex-end' : 'flex-start'}; margin-bottom: 8px;">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color: ${primaryColor};">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span style="font-size: 20px; font-weight: 700; color: ${textColor};">${t('dashboard.aiServiceDetails.purchaseRequest') || 'طلب استخدام الخدمة'}</span>
      </div>`,
      html: `
        <style>
          .purchase-form-container {
            text-align: ${isRTL ? 'right' : 'left'};
            padding: 4px 0;
          }
          .form-group {
            margin-bottom: 20px;
          }
          .form-label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            font-size: 13px;
            color: ${labelColor};
            letter-spacing: 0.2px;
          }
          .form-label .required {
            color: #ef4444;
            margin-${isRTL ? 'left' : 'right'}: 4px;
          }
          .form-input {
            width: 100%;
            padding: 12px 14px;
            border-radius: 10px;
            border: 2px solid ${borderColor};
            background: ${inputBg};
            color: ${textColor};
            font-size: 14px;
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
            min-height: 100px;
            resize: vertical;
            line-height: 1.6;
          }
          .form-select {
            cursor: pointer;
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='${encodeURIComponent(textColor)}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: ${isRTL ? 'left' : 'right'} 14px center;
            padding-${isRTL ? 'left' : 'right'}: 36px;
          }
          .form-input::placeholder {
            color: #94a3b8;
            opacity: 0.7;
          }
        </style>
        <div class="purchase-form-container">
          <div class="form-group">
            <label class="form-label">
              ${t('dashboard.aiServiceDetails.notes') || 'ملاحظات'}
              <span style="color: ${labelColor}; font-weight: 400; font-size: 11px;">(${t('dashboard.aiServiceDetails.optional') || 'اختياري'})</span>
            </label>
            <textarea 
              id="swal-notes" 
              class="form-input form-textarea" 
              placeholder="${t('dashboard.aiServiceDetails.notesPlaceholder') || 'أدخل أي ملاحظات إضافية أو متطلبات خاصة...'}"
              dir="${isRTL ? 'rtl' : 'ltr'}"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label class="form-label">
              ${t('dashboard.aiServiceDetails.contactPreference') || 'تفضيل التواصل'}
              <span class="required">*</span>
            </label>
            <select 
              id="swal-contact-preference" 
              class="form-input form-select"
              dir="${isRTL ? 'rtl' : 'ltr'}"
            >
              <option value="">${t('dashboard.aiServiceDetails.selectContactMethod') || '-- اختر طريقة التواصل --'}</option>
              <option value="phone">${t('dashboard.aiServiceDetails.phone') || '📞 هاتف'}</option>
              <option value="email">${t('dashboard.aiServiceDetails.email') || '✉️ بريد إلكتروني'}</option>
            </select>
          </div>
        </div>
      `,
      width: '520px',
      padding: '2rem',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: `<span style="display: flex; align-items: center; gap: 6px;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 13L9 17L19 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        ${t('dashboard.aiServiceDetails.submitRequest') || 'إرسال الطلب'}
      </span>`,
      cancelButtonText: t('dashboard.aiServiceDetails.cancel') || 'إلغاء',
      confirmButtonColor: primaryColor,
      cancelButtonColor: '#94a3b8',
      background: bgColor,
      color: textColor,
      backdrop: true,
      allowOutsideClick: false,
      customClass: {
        popup: 'rounded-xl shadow-xl border border-gray-200 font-ElMessiri',
        title: 'mb-2',
        htmlContainer: 'mt-2',
        confirmButton: 'px-5 py-2.5 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all',
        cancelButton: 'px-5 py-2.5 rounded-lg font-semibold text-sm hover:opacity-80 transition-all',
        actions: 'gap-2.5 mt-5',
      },
      buttonsStyling: false,
      preConfirm: () => {
        const notes = (document.getElementById('swal-notes') as HTMLTextAreaElement)?.value || '';
        const contactPreference = (document.getElementById('swal-contact-preference') as HTMLSelectElement)?.value;
        
        if (!contactPreference) {
          Swal.showValidationMessage(
            `<span style="color: #ef4444; font-weight: 500; font-size: 13px;">
              ${t('dashboard.aiServiceDetails.pleaseSelectContact') || '⚠️ يرجى اختيار تفضيل التواصل'}
            </span>`
          );
          return false;
        }

        return {
          notes: notes.trim() || undefined,
          contact_preference: contactPreference as 'phone' | 'email',
        };
      },
    });

    if (!formValues) return; // User cancelled

    // Show loading
    Swal.fire({
      title: t('dashboard.aiServiceDetails.processing') || 'جاري المعالجة...',
      text: t('dashboard.aiServiceDetails.pleaseWait') || 'يرجى الانتظار',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      background: '#ffffff',
      color: '#1e293b',
      customClass: {
        popup: 'font-ElMessiri',
      },
    });

    try {
      const result = await purchaseAIService(serviceId, formValues);

      if (result.success && result.data) {
        const bgColor = '#ffffff';
        const textColor = '#1e293b';
        const cardBg = '#f8fafc';
        const labelColor = '#475569';
        
        await Swal.fire({
          icon: 'success',
          iconColor: '#10b981',
          title: `<div style="font-size: 24px; font-weight: 700; color: ${textColor};">
            ${t('dashboard.aiServiceDetails.requestSentSuccessfully') || '✅ تم إرسال الطلب بنجاح!'}
          </div>`,
          html: `
            <div style="text-align: ${isRTL ? 'right' : 'left'};">
              <p style="color: ${textColor}; margin-bottom: 20px; font-size: 16px; line-height: 1.6;">
                ${result.message || (t('dashboard.aiServiceDetails.requestCreatedSuccessfully') || 'تم إنشاء طلب الخدمة بنجاح، سنتواصل معك قريباً')}
              </p>
              <div style="background: ${cardBg}; padding: 20px; border-radius: 16px; margin-top: 16px; border: 1px solid #e2e8f0;">
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                  <span style="color: ${labelColor}; font-size: 14px; font-weight: 500;">
                    ${t('dashboard.aiServiceDetails.orderId') || 'رقم الطلب'}
                  </span>
                  <span style="color: ${textColor}; font-size: 16px; font-weight: 700;">
                    #${result.data.order_id}
                  </span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                  <span style="color: ${labelColor}; font-size: 14px; font-weight: 500;">
                    ${t('dashboard.aiServiceDetails.serviceName') || 'اسم الخدمة'}
                  </span>
                  <span style="color: ${textColor}; font-size: 16px; font-weight: 700;">
                    ${result.data.service_name}
                  </span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                  <span style="color: ${labelColor}; font-size: 14px; font-weight: 500;">
                    ${t('dashboard.aiServiceDetails.price') || 'السعر'}
                  </span>
                  <span style="color: ${textColor}; font-size: 16px; font-weight: 700;">
                    ${result.data.price.toLocaleString()} ${service.currency || 'SAR'}
                  </span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0;">
                  <span style="color: ${labelColor}; font-size: 14px; font-weight: 500;">
                    ${t('dashboard.aiServiceDetails.status') || 'الحالة'}
                  </span>
                  <span style="background: ${result.data.status === 'pending' ? '#f59e0b' : result.data.status === 'completed' ? '#10b981' : '#ef4444'}; color: white; padding: 6px 12px; border-radius: 8px; font-size: 13px; font-weight: 600; text-transform: capitalize;">
                    ${result.data.status}
                  </span>
                </div>
              </div>
            </div>
          `,
          confirmButtonText: t('dashboard.ticketDetails.ok') || 'حسناً',
          confirmButtonColor: '#114C5A',
          background: bgColor,
          color: textColor,
          width: '550px',
          padding: '2.5rem',
          customClass: {
            popup: 'rounded-3xl shadow-2xl border border-gray-200 font-ElMessiri',
            confirmButton: 'px-8 py-3 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all',
          },
          buttonsStyling: false,
        });
      } else {
        throw new Error(result.message || t('dashboard.aiServiceDetails.failedToCreateRequest') || 'فشل إنشاء طلب الخدمة');
      }
    } catch (error: any) {
      console.error('Purchase error:', error);
      await Swal.fire({
        icon: 'error',
        title: t('dashboard.aiServiceDetails.error') || 'حدث خطأ!',
        text: error.message || (t('dashboard.aiServiceDetails.failedToCreateRequestMessage') || 'فشل إنشاء طلب الخدمة. يرجى المحاولة مرة أخرى.'),
        confirmButtonText: t('dashboard.ticketDetails.ok') || 'حسناً',
        confirmButtonColor: '#ef4444',
        background: '#ffffff',
        color: '#1e293b',
        customClass: {
          popup: 'font-ElMessiri',
        },
      });
    }
  };

  const handleShare = async () => {
    if (!service) return;

    const serviceName = getServiceName(service);
    const serviceUrl = window.location.href;
    const shareText = `${serviceName} - ${getServiceDescription(service)}`;

    // Check if Web Share API is available (mobile devices)
    if (navigator.share) {
      try {
        await navigator.share({
          title: serviceName,
          text: shareText,
          url: serviceUrl,
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
        await navigator.clipboard.writeText(serviceUrl);
        await Swal.fire({
          icon: 'success',
          title: t('dashboard.aiServiceDetails.linkCopied') || 'تم نسخ الرابط',
          text: t('dashboard.aiServiceDetails.linkCopiedMessage') || 'تم نسخ رابط الخدمة إلى الحافظة',
          confirmButtonText: t('dashboard.ticketDetails.ok') || 'حسناً',
          confirmButtonColor: '#114C5A',
          customClass: {
            popup: 'font-ElMessiri',
          },
        });
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <EmptyState
          icon={Sparkles}
          title={t('dashboard.aiServiceDetails.notFound') || 'الخدمة غير موجودة'}
          message={t('dashboard.aiServiceDetails.notFoundMessage') || 'لم يتم العثور على الخدمة المطلوبة'}
        />
      </div>
    );
  }

  const serviceName = getServiceName(service);
  const serviceDescription = getServiceDescription(service);
  const serviceFullDescription = getServiceDescription(service, 'full');
  const categoryName = getCategoryName(service.category);

  return (
    <div className="space-y-3 pb-4 max-w-7xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/admin/ai-services')}
        className="flex items-center gap-1.5 text-[#114C5A] hover:text-[#114C5A]/80 transition-colors font-medium text-xs mb-2"
      >
        <ChevronRight className="w-3.5 h-3.5" />
        <span>{t('dashboard.aiServiceDetails.backToList') || 'العودة للقائمة'}</span>
      </button>

      {/* Hero Section - Very Compact */}
      <div className="bg-gradient-to-r from-[#114C5A] to-[#114C5A]/95 rounded-lg p-3 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Image - Very Small */}
          <div className="sm:w-24 flex-shrink-0">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-white/10 border border-white/20">
              {service.main_image ? (
                <img
                  src={getImageUrl(service.main_image)}
                  alt={serviceName}
                  className="w-full h-full object-cover"
                  onError={() => {
                    setImageErrors(prev => new Set(prev).add(0));
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-white/40" />
                </div>
              )}
              {service.is_free && (
                <div className="absolute top-1 right-1 bg-[#FFB200] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  {t('dashboard.aiServiceDetails.free') || 'مجاني'}
                </div>
              )}
              {discountPercentage && (
                <div className="absolute top-1 left-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  -{discountPercentage}%
                </div>
              )}
            </div>
          </div>

          {/* Info - Very Compact */}
          <div className="flex-1 space-y-1.5">
            <div>
              <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                {service.category && (
                  <span className="px-1.5 py-0.5 bg-white/20 text-white rounded text-[10px] font-medium">
                    {categoryName}
                  </span>
                )}
                {service.is_popular && (
                  <span className="px-1.5 py-0.5 bg-[#FFB200]/20 text-[#FFB200] rounded text-[10px] font-medium border border-[#FFB200]/30">
                    {t('dashboard.aiServiceDetails.popular') || 'شائع'}
                  </span>
                )}
                {service.is_new && (
                  <span className="px-1.5 py-0.5 bg-green-500/20 text-green-300 rounded text-[10px] font-medium border border-green-500/30">
                    {t('dashboard.aiServiceDetails.new') || 'جديد'}
                  </span>
                )}
              </div>
              <h1 className="text-base sm:text-lg font-bold text-white mb-1">
                {serviceName}
              </h1>
              {serviceDescription && (
                <p className="text-white/90 text-xs leading-snug line-clamp-2">
                  {serviceDescription}
                </p>
              )}
            </div>

            {/* Rating & Price - Inline */}
            <div className="flex items-center gap-3 flex-wrap">
              {ratingValue > 0 && (
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${
                          star <= Math.round(ratingValue)
                            ? 'fill-[#FFB200] text-[#FFB200]'
                            : 'fill-white/20 text-white/20'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-white text-xs font-medium">
                    {ratingValue.toFixed(1)} ({reviewsCount})
                  </span>
                </div>
              )}

              {service.is_free ? (
                <span className="text-sm font-bold text-white">
                  {t('dashboard.aiServiceDetails.free') || 'مجاني'}
                </span>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white">
                    {price.toLocaleString()} {service.currency || 'SAR'}
                  </span>
                  {originalPrice && originalPrice > price && (
                    <span className="text-xs text-white/60 line-through">
                      {originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Actions - Very Compact */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={handleUseService}
                className="px-3 py-1.5 bg-[#FFB200] text-white rounded-lg font-medium hover:bg-[#FFB200]/90 transition-colors flex items-center gap-1 text-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {t('dashboard.aiServiceDetails.useService') || 'استخدم الخدمة'}
              </button>
              <button
                onClick={handleShare}
                className="px-3 py-1.5 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-colors flex items-center gap-1 text-xs border border-white/30"
              >
                <Share2 className="w-3.5 h-3.5" />
                {t('dashboard.aiServiceDetails.share') || 'مشاركة'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-3">
          {/* Media Gallery */}
          {(images.length > 0 || screenshots.length > 0 || videoEmbedUrl) && (
            <div className="bg-white rounded-lg border border-[#114C5A]/10 shadow-sm p-3">
              <h2 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[#114C5A]" />
                {t('dashboard.aiServiceDetails.media') || 'المعرض'}
              </h2>

              {/* Video */}
              {videoEmbedUrl && (
                <div className="mb-3">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <iframe
                      src={videoEmbedUrl}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Images */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedImageIndex(idx);
                        setIsLightboxOpen(true);
                      }}
                      className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-90 transition-opacity group"
                    >
                      <img
                        src={getImageUrl(img)}
                        alt={`${serviceName} - ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={() => {
                          setImageErrors(prev => new Set(prev).add(idx));
                        }}
                      />
                      {!imageErrors.has(idx) && (
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <Maximize2 className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Screenshots */}
              {screenshots.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-900 mb-2">
                    {t('dashboard.aiServiceDetails.screenshots') || 'لقطات الشاشة'}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {screenshots.map((ss, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg overflow-hidden bg-gray-100"
                      >
                        <img
                          src={getImageUrl(ss)}
                          alt={`${serviceName} - Screenshot ${idx + 1}`}
                          className="w-full h-auto"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Full Description */}
          {serviceFullDescription && (
            <div className="bg-white rounded-lg border border-[#114C5A]/10 shadow-sm p-4">
              <h2 className="text-base font-bold text-gray-900 mb-2">
                {t('dashboard.aiServiceDetails.fullDescription') || 'الوصف الكامل'}
              </h2>
              <div className="text-sm text-gray-700 leading-relaxed">
                <p className="whitespace-pre-line">{serviceFullDescription}</p>
              </div>
            </div>
          )}

          {/* Features */}
          {service.features && service.features.length > 0 && (
            <div className="bg-white rounded-lg border border-[#114C5A]/10 shadow-sm p-4">
              <h2 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-[#114C5A]" />
                {t('dashboard.aiServiceDetails.features') || 'المميزات'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 bg-[#114C5A]/5 rounded-lg border border-[#114C5A]/10">
                    <CheckCircle className="w-3.5 h-3.5 text-[#114C5A] flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-700 font-medium">
                      {i18n.language === 'ar' ? feature.title : (feature.title_en || feature.title)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          {service.reviews && service.reviews.length > 0 && (
            <div className="bg-white rounded-lg border border-[#114C5A]/10 shadow-sm p-4">
              <h2 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-1.5">
                <Star className="w-4 h-4 text-[#FFB200]" />
                {t('dashboard.aiServiceDetails.reviews') || 'التقييمات'} ({reviewsCount})
              </h2>
              <div className="space-y-2">
                {service.reviews.map((review: any, idx: number) => (
                  <div key={idx} className="p-2.5 bg-gray-50 rounded-lg border border-[#114C5A]/10">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-8 h-8 rounded-full bg-[#114C5A] text-white flex items-center justify-center font-bold text-xs">
                        {review.user?.name?.charAt(0) || 'U'}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-xs">{review.user?.name || t('dashboard.aiServiceDetails.anonymous') || 'مجهول'}</p>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= (review.rating || 0)
                                  ? 'fill-[#FFB200] text-[#FFB200]'
                                  : 'fill-gray-200 text-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-xs text-gray-700 mt-1.5">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-3">
          {/* Purchase Card */}
          <div className="bg-white rounded-lg border border-[#114C5A]/10 shadow-sm p-4 sticky top-4">
            <div className="text-center mb-4">
              {service.is_free ? (
                <div className="text-2xl font-bold text-[#114C5A] mb-1">
                  {t('dashboard.aiServiceDetails.free') || 'مجاني'}
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-[#114C5A] mb-1">
                    {price.toLocaleString()} {service.currency || 'SAR'}
                  </div>
                  {originalPrice && originalPrice > price && (
                    <div className="text-sm text-gray-400 line-through">
                      {originalPrice.toLocaleString()} {service.currency || 'SAR'}
                    </div>
                  )}
                </>
              )}
            </div>

            <button
              onClick={handleUseService}
              className="w-full px-4 py-2.5 bg-[#114C5A] text-white rounded-lg font-semibold hover:bg-[#114C5A]/90 transition-colors flex items-center justify-center gap-1.5 shadow-lg mb-3 text-sm"
            >
              <Sparkles className="w-4 h-4" />
              {t('dashboard.aiServiceDetails.useService') || 'استخدم الخدمة'}
            </button>

            <div className="space-y-2 pt-3 border-t border-[#114C5A]/10">
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{t('dashboard.aiServiceDetails.qualityGuarantee') || 'ضمان الجودة'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{t('dashboard.aiServiceDetails.instantAccess') || 'وصول فوري'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{t('dashboard.aiServiceDetails.support') || 'دعم فني'}</span>
              </div>
            </div>
          </div>

          {/* Related Services */}
          {service.related_services && service.related_services.length > 0 && (
            <div className="bg-white rounded-lg border border-[#114C5A]/10 shadow-sm p-4">
              <h3 className="text-sm font-bold text-gray-900 mb-3">
                {t('dashboard.aiServiceDetails.relatedServices') || 'خدمات ذات صلة'}
              </h3>
              <div className="space-y-2">
                {service.related_services.map((related) => (
                  <div
                    key={related.id}
                    onClick={() => navigate(`/admin/ai-services/${related.id}`)}
                    className="flex items-center gap-2 p-2 rounded-lg border border-[#114C5A]/10 hover:border-[#114C5A]/30 hover:bg-[#114C5A]/5 transition-all cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {related.main_image ? (
                        <img
                          src={getImageUrl(related.main_image)}
                          alt={related.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate text-xs">{related.name}</p>
                      <p className="text-[10px] text-gray-600">
                        {related.is_free 
                          ? t('dashboard.aiServiceDetails.free') || 'مجاني'
                          : `${related.price} ${service.currency || 'SAR'}`
                        }
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#114C5A] flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {isLightboxOpen && images.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors p-2"
          >
            <X className="w-8 h-8" />
          </button>
          <button
            onClick={() => setSelectedImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
            className="absolute left-4 text-white hover:text-gray-300 transition-colors p-2"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={() => setSelectedImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
            className="absolute right-4 text-white hover:text-gray-300 transition-colors p-2"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
          <div className="max-w-7xl max-h-full">
            <img
              src={getImageUrl(images[selectedImageIndex])}
              alt={`${serviceName} - ${selectedImageIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain rounded-xl"
            />
          </div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
            {selectedImageIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIServiceDetails;

