import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, Zap, Star, Clock, Flame, Award, Gift, Tag, Heart, Rocket, ShoppingBag } from 'lucide-react';

const categoryData = [
  { id: 'summer-sale', label: 'Summer Sale', icon: Sparkles, gradient: 'from-orange-400 to-pink-500' },
  { id: 'new-arrivals', label: 'New Arrivals', icon: Rocket, gradient: 'from-blue-400 to-cyan-500' },
  { id: 'fast-shipping', label: 'Fast Shipping', icon: Zap, gradient: 'from-yellow-400 to-orange-500' },
  { id: 'trending', label: 'Trending', icon: TrendingUp, gradient: 'from-purple-400 to-pink-500' },
  { id: 'limited-stock', label: 'Limited Stock', icon: Clock, gradient: 'from-red-400 to-orange-500' },
  { id: '50-off', label: '50% Off', icon: Tag, gradient: 'from-green-400 to-emerald-500' },
  { id: 'best-seller', label: 'Best Seller', icon: Award, gradient: 'from-amber-400 to-yellow-500' },
  { id: 'clearance', label: 'Clearance', icon: Gift, gradient: 'from-pink-400 to-rose-500' },
  { id: 'popular-now', label: 'Popular Now', icon: Star, gradient: 'from-indigo-400 to-purple-500' },
  { id: 'hot-picks', label: 'Hot Picks', icon: Flame, gradient: 'from-red-500 to-orange-600' },
  { id: 'daily-deals', label: 'Daily Deals', icon: ShoppingBag, gradient: 'from-teal-400 to-cyan-500' },
  { id: 'recommended', label: 'Recommended', icon: Heart, gradient: 'from-rose-400 to-pink-500' },
];

export const CATEGORY_OPTIONS = categoryData;

interface CategoryCardProps {
  categoryId: string;
  autoRotate?: boolean;
  showShimmer?: boolean;
}

export const CategoryCard = ({ categoryId, autoRotate = false, showShimmer = true }: CategoryCardProps) => {
  const category = categoryData.find(c => c.id === categoryId);
  
  if (!category) return null;

  const Icon = category.icon;

  return (
    <div className="relative overflow-hidden rounded-xl p-4 bg-gradient-to-r shadow-lg animate-fade-in"
         style={{ 
           backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))`,
         }}>
      <div className={`absolute inset-0 bg-gradient-to-r ${category.gradient} opacity-90`} />
      
      {showShimmer && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" 
             style={{ 
               backgroundSize: '200% 100%',
               animation: 'shimmer 3s infinite'
             }} 
        />
      )}
      
      <div className="relative flex items-center gap-3 text-white">
        <Icon className="h-6 w-6" />
        <span className="font-bold text-lg">{category.label}</span>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};

interface CategoryCarouselProps {
  categoryIds: string[];
}

export const CategoryCarousel = ({ categoryIds }: CategoryCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (categoryIds.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % categoryIds.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [categoryIds.length]);

  if (categoryIds.length === 0) return null;
  if (categoryIds.length === 1) return <CategoryCard categoryId={categoryIds[0]} />;

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-xl">
        {categoryIds.map((id, index) => (
          <div
            key={id}
            className={`transition-all duration-500 ${
              index === currentIndex ? 'opacity-100 block' : 'opacity-0 hidden'
            }`}
          >
            <CategoryCard categoryId={id} />
          </div>
        ))}
      </div>
      
      {categoryIds.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {categoryIds.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all ${
                index === currentIndex ? 'w-6 bg-primary' : 'w-1.5 bg-muted'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
