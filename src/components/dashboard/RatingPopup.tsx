import { useState } from 'react';
import { Star, X, Loader2 } from 'lucide-react';
import { createRating } from '../../storeApi/storeApi';
import Swal from 'sweetalert2';

interface RatingPopupProps {
  bookingId: number;
  bookingName: string;
  onClose: () => void;
  onSuccess: () => void;
}

const RatingPopup = ({ bookingId, bookingName, onClose, onSuccess }: RatingPopupProps) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      await Swal.fire({
        icon: 'warning',
        title: 'تنبيه',
        text: 'يرجى اختيار عدد النجوم',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#114C5A',
        customClass: { popup: 'font-ElMessiri' },
        allowOutsideClick: true,
        allowEscapeKey: true,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createRating({
        booking_id: bookingId,
        rating: rating,
        comment: comment.trim(),
      });

      if (result.success) {
        await Swal.fire({
          icon: 'success',
          title: 'تم بنجاح',
          text: result.message || 'تم إضافة التقييم بنجاح',
          confirmButtonText: 'حسناً',
          confirmButtonColor: '#114C5A',
          customClass: { popup: 'font-ElMessiri' },
          allowOutsideClick: true,
          allowEscapeKey: true,
        });
        onSuccess();
        onClose();
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: result.message || 'فشل في إضافة التقييم',
          confirmButtonText: 'حسناً',
          confirmButtonColor: '#dc2626',
          customClass: { popup: 'font-ElMessiri' },
          allowOutsideClick: true,
          allowEscapeKey: true,
        });
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      await Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'حدث خطأ أثناء إضافة التقييم',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#dc2626',
        customClass: { popup: 'font-ElMessiri' },
        allowOutsideClick: true,
        allowEscapeKey: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative bg-white rounded-3xl w-[90%] max-w-2xl p-8 shadow-2xl animate-scaleIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 left-6 text-gray-400 hover:text-red-500 text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-50 transition-all duration-200 z-30"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-8 pb-6 border-b border-gray-200">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-right text-gray-900">
            تقييم الخدمة
          </h2>
          <p className="text-lg text-primary font-semibold text-right">
            {bookingName}
          </p>
        </div>

        {/* Rating Stars */}
        <div className="mb-8">
          <label className="block text-right mb-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">كم نجمة تعطي لهذه الخدمة؟</h3>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-125 active:scale-95"
                >
                  <Star
                    className={`w-12 h-12 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-slate-200 text-slate-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center mt-4 text-lg font-bold text-amber-600">
                {rating} من 5 نجوم
              </p>
            )}
          </label>
        </div>

        {/* Comment */}
        <div className="mb-8">
          <label htmlFor="rating-comment" className="block text-right mb-3">
            <h3 className="text-xl font-bold text-gray-800 mb-1">تعليقك (اختياري)</h3>
            <p className="text-sm text-gray-500">شاركنا رأيك في هذه الخدمة</p>
          </label>
          <textarea
            id="rating-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="اكتب تعليقك هنا..."
            rows={4}
            maxLength={500}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300 resize-none text-right placeholder:text-gray-400 bg-white shadow-sm hover:shadow-md"
          />
          <div className="flex justify-end mt-2">
            <span className="text-xs text-gray-400">
              {comment.length} / 500 حرف
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-4">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all disabled:opacity-50"
          >
            إلغاء
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
            className={`
              px-8 py-3
              rounded-xl
              text-white
              text-lg
              font-bold
              shadow-lg
              transition-all duration-300
              active:scale-95
              flex items-center justify-center gap-2
              ${isSubmitting || rating === 0
                ? 'bg-primary/70 cursor-not-allowed'
                : 'bg-primary hover:bg-primary-dark shadow-primary/30'
              }
            `}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                جاري الإرسال...
              </>
            ) : (
              'إرسال التقييم'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingPopup;

