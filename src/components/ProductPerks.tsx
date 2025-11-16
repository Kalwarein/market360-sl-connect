import { Zap, Truck, Shield, Leaf, Award, Star } from 'lucide-react';
import { Card } from './ui/card';

interface ProductPerksProps {
  perks: Array<{ icon: string; label: string; color: string }>;
}

const iconMap: Record<string, any> = {
  zap: Zap,
  truck: Truck,
  shield: Shield,
  leaf: Leaf,
  award: Award,
  star: Star,
};

const ProductPerks = ({ perks }: ProductPerksProps) => {
  if (!perks || perks.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="font-semibold">Product Highlights</h3>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {perks.map((perk, index) => {
          const Icon = iconMap[perk.icon] || Star;
          return (
            <Card
              key={index}
              className="flex-shrink-0 px-4 py-3 rounded-xl shadow-sm"
              style={{
                background: `linear-gradient(135deg, ${perk.color}15, ${perk.color}05)`,
                borderColor: `${perk.color}30`,
              }}
            >
              <div className="flex items-center gap-2 whitespace-nowrap">
                <Icon
                  className="h-4 w-4"
                  style={{ color: perk.color }}
                />
                <span className="text-sm font-medium">{perk.label}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ProductPerks;
