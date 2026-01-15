import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ServiceCategory } from '../../types/types';
import CategoryIcon from './CategoryIcon';
import { useLocalized } from '../../hooks/useLocalized';

interface CategoryCardProps {
  category: ServiceCategory;
  onClick: (category: ServiceCategory) => void;
}

const CategoryCard = ({ category, onClick }: CategoryCardProps) => {
  const { t } = useTranslation();
  const localizedCategory = useLocalized(category, ['name', 'description']);

  return (
<div
  onClick={() => onClick(category)}
      className="group bg-white border border-[#114C5A]/20 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-[#114C5A]/40 transition-all cursor-pointer"
>
  <CategoryIcon item={category} />

      <h3 className="text-lg font-semibold text-[#114C5A] mt-4 mb-2">
    {localizedCategory.name}
  </h3>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
    {localizedCategory.description || ''}
  </p>

      <div className="flex items-center justify-between text-[#114C5A] font-medium text-sm pt-3 border-t border-[#114C5A]/10">
    <span>{t('dashboard.services.details')}</span>
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
  </div>
</div>
  );
};

export default CategoryCard;
