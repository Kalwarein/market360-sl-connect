import { CATEGORY_OPTIONS } from './CategoryCard';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export const CategoryFilter = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3">Shop by Category</h2>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORY_OPTIONS.map((category) => {
          const Icon = category.icon;
          return (
            <Card
              key={category.id}
              className="flex-shrink-0 cursor-pointer hover:shadow-lg transition-all hover:scale-105"
              onClick={() => navigate(`/category/${category.id}`)}
            >
              <div className={`p-4 rounded-xl bg-gradient-to-r ${category.gradient} text-white min-w-[140px]`}>
                <Icon className="h-5 w-5 mb-2" />
                <p className="text-sm font-semibold whitespace-nowrap">{category.label}</p>
              </div>
            </Card>
          );
        })}
      </div>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};
