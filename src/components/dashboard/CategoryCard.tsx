import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ServiceCategory } from '../../types/types';
import CategoryIcon from './CategoryIcon';
import { useLocalized } from '../../hooks/useLocalized';
import { useThemeStore } from '../../storeApi/storeApi';

interface CategoryCardProps {
  category: ServiceCategory;
  onClick: (category: ServiceCategory) => void;
}

const CategoryCard = ({ category, onClick }: CategoryCardProps) => {
  const { t } = useTranslation();
  const { isDarkMode } = useThemeStore();
  const localizedCategory = useLocalized(category, ['name', 'description']);

  return (
<div
  onClick={() => onClick(category)}
      className={`group rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer ${
        isDarkMode
          ? 'bg-slate-800 border border-slate-700 hover:border-slate-600'
          : 'bg-white border border-[#114C5A]/20 hover:border-[#114C5A]/40'
      }`}
>
  <CategoryIcon item={category} />

      <h3 className={`text-lg font-semibold mt-4 mb-2 transition-colors duration-300 ${
        isDarkMode ? 'text-white' : 'text-[#114C5A]'
      }`}>
    {localizedCategory.name}
  </h3>

      <p className={`text-sm mb-4 line-clamp-2 transition-colors duration-300 ${
        isDarkMode ? 'text-gray-300' : 'text-gray-600'
      }`}>
    {localizedCategory.description || ''}
  </p>

      <div className={`flex items-center justify-between font-medium text-sm pt-3 border-t transition-colors duration-300 ${
        isDarkMode
          ? 'text-[#FFB200] border-slate-700'
          : 'text-[#114C5A] border-[#114C5A]/10'
      }`}>
    <span>{t('dashboard.services.details')}</span>
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
  </div>
</div>
  );
};

export default CategoryCard;
