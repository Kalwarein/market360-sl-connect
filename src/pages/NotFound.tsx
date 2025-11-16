import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, AlertCircle } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <AlertCircle className="h-10 w-10 text-primary" />
          </div>
          
          <h1 className="text-6xl font-bold text-primary mb-3">404</h1>
          
          <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
          
          <p className="text-muted-foreground mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="space-y-3">
            <Button onClick={() => navigate('/')} className="w-full">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <Button variant="outline" onClick={() => navigate(-1)} className="w-full">
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
