import { ArrowRight } from 'lucide-react';
import type { CategoryWithSubCategories } from '../../types/types';

type ViewMode = 'categories' | 'subcategories' | 'services';

interface SectionsHeaderProps {
  viewMode: ViewMode;
  currentCategory: CategoryWithSubCategories | null;
  onBack: () => void;
}

const SectionsHeader = ({ viewMode, currentCategory, onBack }: SectionsHeaderProps) => {
  const getTitle = () => {
    switch (viewMode) {
      case 'categories':
        return 'خدماتنا';
      case 'subcategories':
        return currentCategory?.name || 'الأقسام الفرعية';
      case 'services':
        return 'الخدمات';
      default:
        return 'خدماتنا';
    }
  };

  const getDescription = () => {
    switch (viewMode) {
      case 'categories':
        return 'خدمات مصممة باحتراف لمساعدتك على النمو والتميز في سوقك.';
      case 'subcategories':
        return currentCategory?.description || 'اختر القسم الفرعي المناسب';
      case 'services':
        return 'اختر الخدمة التي تناسب احتياجاتك';
      default:
        return '';
    }
  };

  return (
    <div className="text-center mb-20">
      <div className="flex items-center justify-center gap-4 mb-4">
        {(viewMode === 'subcategories' || viewMode === 'services') && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
            <span>رجوع</span>
          </button>
        )}
        <h2 className="text-4xl font-extrabold text-gray-800">
          {getTitle()}
        </h2>
      </div>
      <p className="text-gray-500 max-w-xl mx-auto">
        {getDescription()}
      </p>
    </div>
  );
};

export default SectionsHeader;

