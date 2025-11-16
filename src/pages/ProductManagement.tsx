import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trash2, Save, X, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const ProductManagement = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    brand: '',
    model_number: '',
    price: '',
    moq: '1',
    category: '',
    tags: '',
    material: '',
    origin: '',
    warranty: '',
    hs_code: '',
    inquiry_only: false,
    published: false,
  });
  const [perks, setPerks] = useState<Array<{ icon: string; label: string; color: string }>>([]);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, stores!inner(owner_id)')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Check if user owns this product
      if (data.stores.owner_id !== user?.id) {
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to edit this product',
          variant: 'destructive',
        });
        navigate('/seller-dashboard');
        return;
      }

      setProduct(data);
      setFormData({
        title: data.title,
        description: data.description || '',
        brand: data.brand || '',
        model_number: data.model_number || '',
        price: data.price.toString(),
        moq: data.moq?.toString() || '1',
        category: data.category,
        tags: data.tags?.join(', ') || '',
        material: data.material || '',
        origin: data.origin || '',
        warranty: data.warranty || '',
        hs_code: data.hs_code || '',
        inquiry_only: data.inquiry_only || false,
        published: data.published || false,
      });
      
      // Parse perks safely
      const parsedPerks = Array.isArray(data.perks) ? data.perks : [];
      setPerks(parsedPerks as Array<{ icon: string; label: string; color: string }>);
    } catch (error) {
      console.error('Error loading product:', error);
      toast({
        title: 'Error',
        description: 'Failed to load product',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('products')
        .update({
          title: formData.title,
          description: formData.description,
          brand: formData.brand,
          model_number: formData.model_number,
          price: parseFloat(formData.price),
          moq: parseInt(formData.moq),
          category: formData.category,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
          material: formData.material,
          origin: formData.origin,
          warranty: formData.warranty,
          hs_code: formData.hs_code,
          inquiry_only: formData.inquiry_only,
          published: formData.published,
          perks: perks,
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Product updated successfully',
      });
      navigate('/seller-dashboard');
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: 'Error',
        description: 'Failed to update product',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
      navigate('/seller-dashboard');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive',
      });
    }
  };

  const addPerk = () => {
    setPerks([...perks, { icon: 'star', label: '', color: '#22c55e' }]);
  };

  const updatePerk = (index: number, field: string, value: string) => {
    const updated = [...perks];
    updated[index] = { ...updated[index], [field]: value };
    setPerks(updated);
  };

  const removePerk = (index: number) => {
    setPerks(perks.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-6">
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20 mb-4"
          onClick={() => navigate('/seller-dashboard')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Manage Product</h1>
        <p className="text-sm opacity-90">Edit or delete your product</p>
      </div>

      <div className="p-4 space-y-4 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Price (Le)</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
              <div>
                <Label>MOQ</Label>
                <Input
                  type="number"
                  value={formData.moq}
                  onChange={(e) => setFormData({ ...formData, moq: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Brand</Label>
                <Input
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                />
              </div>
              <div>
                <Label>Model Number</Label>
                <Input
                  value={formData.model_number}
                  onChange={(e) => setFormData({ ...formData, model_number: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label>Category</Label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>

            <div>
              <Label>Tags (comma separated)</Label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="electronics, wireless, premium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Material</Label>
                <Input
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                />
              </div>
              <div>
                <Label>Origin</Label>
                <Input
                  value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label>Warranty</Label>
              <Input
                value={formData.warranty}
                onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Published</Label>
              <Switch
                checked={formData.published}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, published: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Inquiry Only</Label>
              <Switch
                checked={formData.inquiry_only}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, inquiry_only: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Product Perks</CardTitle>
              <Button size="sm" variant="outline" onClick={addPerk}>
                <Plus className="h-4 w-4 mr-1" />
                Add Perk
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {perks.map((perk, index) => (
              <div key={index} className="flex gap-2 items-start">
                <Input
                  placeholder="Label"
                  value={perk.label}
                  onChange={(e) => updatePerk(index, 'label', e.target.value)}
                  className="flex-1"
                />
                <select
                  value={perk.icon}
                  onChange={(e) => updatePerk(index, 'icon', e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="star">⭐ Star</option>
                  <option value="zap">⚡ Zap</option>
                  <option value="truck">🚚 Truck</option>
                  <option value="shield">🛡️ Shield</option>
                  <option value="leaf">🌿 Leaf</option>
                  <option value="award">🏆 Award</option>
                </select>
                <Input
                  type="color"
                  value={perk.color}
                  onChange={(e) => updatePerk(index, 'color', e.target.value)}
                  className="w-16"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removePerk(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button onClick={handleSave} disabled={saving} className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
            className="flex-1"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Product
          </Button>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The product will be permanently removed from
              the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductManagement;
