import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ServiceSubCategory } from '../../types/types';
import CategoryIcon from './CategoryIcon';
import { useLocalized } from '../../hooks/useLocalized';
import { useThemeStore } from '../../storeApi/store/theme.store';

interface SubCategoryCardProps {
  subCategory: ServiceSubCategory;
  onClick: (subCategory: ServiceSubCategory) => void;
}

const SubCategoryCard = ({ subCategory, onClick }: SubCategoryCardProps) => {
  const { t } = useTranslation();
  const { isDarkMode } = useThemeStore();
  const localizedSubCategory = useLocalized(subCategory, ['name', 'description']);

  return (
    <div
      onClick={() => onClick(subCategory)}
      className={`group relative backdrop-blur-xl rounded-3xl p-7 border shadow-lg hover:shadow-xl transition cursor-pointer ${
        isDarkMode 
          ? 'bg-slate-800/60 border-slate-700/40 hover:border-primary/40' 
          : 'bg-white/60 border-white/40 hover:border-primary/40'
      }`}
    >
      <CategoryIcon item={subCategory} />

      <h3 className={`text-xl font-bold mt-5 mb-3 ${
        isDarkMode ? 'text-white' : 'text-gray-800'
      }`}>
        {localizedSubCategory.name}
      </h3>

      <p className={`text-sm mb-6 ${
        isDarkMode ? 'text-slate-300' : 'text-gray-600'
      }`}>
        {localizedSubCategory.description || ''}
      </p>

      <div className="flex items-center justify-between text-primary font-semibold">
        <span>{t('dashboard.services.viewServices')}</span>
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
      </div>
    </div>
  );
};

export default SubCategoryCard;

