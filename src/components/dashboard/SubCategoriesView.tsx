import type { ServiceSubCategory } from '../../types/types';
import SubCategoryCard from './SubCategoryCard';

interface SubCategoriesViewProps {
  subCategories: ServiceSubCategory[];
  onSubCategoryClick: (subCategory: ServiceSubCategory) => void;
}

const SubCategoriesView = ({ subCategories, onSubCategoryClick }: SubCategoriesViewProps) => {
  if (!subCategories || subCategories.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12">
      {subCategories.map((subCategory) => (
        <SubCategoryCard
          key={subCategory.id}
          subCategory={subCategory}
          onClick={onSubCategoryClick}
        />
      ))}
    </div>
  );
};

export default SubCategoriesView;

