import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ChevronRight } from 'lucide-react';

interface KeyAttributesProps {
  attributes: {
    brand?: string;
    material?: string;
    origin?: string;
    warranty?: string;
    model_number?: string;
    category?: string;
    [key: string]: string | undefined;
  };
}

const KeyAttributes = ({ attributes }: KeyAttributesProps) => {
  const displayAttributes = [
    { key: 'brand', label: 'Brand' },
    { key: 'material', label: 'Material' },
    { key: 'origin', label: 'Place of Origin' },
    { key: 'warranty', label: 'Warranty' },
    { key: 'model_number', label: 'Model Number' },
    { key: 'category', label: 'Category' },
  ].filter(attr => attributes[attr.key]);

  if (displayAttributes.length === 0) return null;

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          Key Attributes
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {displayAttributes.map(({ key, label }) => (
          <div key={key} className="space-y-1">
            <p className="text-sm font-semibold">{attributes[key]}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default KeyAttributes;
