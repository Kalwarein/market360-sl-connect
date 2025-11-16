import { Badge } from './ui/badge';

interface ProductTagsProps {
  tags: string[];
}

const ProductTags = ({ tags }: ProductTagsProps) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-sm">Tags</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="rounded-full px-3 py-1 text-xs font-normal"
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default ProductTags;
