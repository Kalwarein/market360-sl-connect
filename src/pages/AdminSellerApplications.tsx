import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, Clock, CheckCircle, XCircle, Store } from 'lucide-react';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { format } from 'date-fns';

interface SellerApplication {
  id: string;
  business_name: string;
  contact_person: string;
  contact_email: string;
  business_category: string;
  status: string;
  created_at: string;
  user_id: string;
  store_name: string | null;
  store_logo_url: string | null;
  store_banner_url: string | null;
  store_region: string | null;
  store_city: string | null;
}

export default function AdminSellerApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<SellerApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('seller_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'default';
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="p-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin')}
            className="rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-lg font-bold">Seller Applications</h1>
            <p className="text-xs text-muted-foreground">{applications.length} total applications</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {applications.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No applications yet</p>
          </div>
        ) : (
          applications.map((app) => (
            <div
              key={app.id}
              onClick={() => navigate(`/admin/seller-application/${app.id}`)}
              className="bg-card rounded-xl border border-border p-4 cursor-pointer hover:shadow-lg hover:border-primary transition-all"
            >
              <div className="flex items-start gap-4">
                {/* Thumbnail */}
                <div className="flex-shrink-0">
                  {app.store_logo_url ? (
                    <img
                      src={app.store_logo_url}
                      alt={app.business_name}
                      className="w-16 h-16 rounded-lg object-cover border-2 border-border"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center border-2 border-border">
                      <Store className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground truncate">
                        {app.store_name || app.business_name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{app.contact_person}</p>
                    </div>
                    <Badge 
                      className={`${getStatusBgColor(app.status)} border flex items-center gap-1 ml-2`}
                    >
                      {getStatusIcon(app.status)}
                      {app.status}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {app.business_category}
                    </span>
                    {app.store_region && app.store_city && (
                      <span className="flex items-center gap-1">
                        📍 {app.store_city}, {app.store_region}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(new Date(app.created_at), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
