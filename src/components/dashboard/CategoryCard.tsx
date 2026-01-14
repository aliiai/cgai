import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ServiceCategory } from '../../types/types';
import CategoryIcon from './CategoryIcon';
import { useLocalized } from '../../hooks/useLocalized';
import { useThemeStore } from '../../storeApi/store/theme.store';

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
  className={`group relative backdrop-blur-xl rounded-3xl p-7 border shadow-lg hover:shadow-xl transition cursor-pointer ${
    isDarkMode 
      ? 'bg-slate-800/60 border-slate-700/40 hover:border-primary/40' 
      : 'bg-white/60 border-white/40 hover:border-primary/40'
  }`}
>
  <CategoryIcon item={category} />

  <h3 className={`text-xl font-bold mt-5 mb-3 ${
    isDarkMode ? 'text-white' : 'text-gray-800'
  }`}>
    {localizedCategory.name}
  </h3>

  <p className={`text-sm mb-6 ${
    isDarkMode ? 'text-slate-300' : 'text-gray-600'
  }`}>
    {localizedCategory.description || ''}
  </p>

  <div className="flex items-center justify-between text-primary font-semibold">
    <span>{t('dashboard.services.details')}</span>
    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
  </div>
</div>

  );
};

export default CategoryCard;

