import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, CheckCircle, Users, MessageCircle, Lock, TrendingUp } from 'lucide-react';

const SecurityInfo = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: 'Buyer Protection',
      description: 'Your purchase is protected from payment to delivery. We ensure safe transactions.',
    },
    {
      icon: CheckCircle,
      title: 'Verified Sellers',
      description: 'All sellers undergo rigorous verification including business registration and KYC.',
    },
    {
      icon: Lock,
      title: 'Secure Payments',
      description: 'All transactions are encrypted and processed through secure payment gateways.',
    },
    {
      icon: MessageCircle,
      title: 'Dispute Resolution',
      description: 'Our team mediates disputes fairly and ensures both parties are heard.',
    },
    {
      icon: Users,
      title: 'Quality Assurance',
      description: 'Products are regularly reviewed and quality standards are maintained.',
    },
    {
      icon: TrendingUp,
      title: 'Transparent Ratings',
      description: 'Honest reviews from real buyers help you make informed decisions.',
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-6">
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20 mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Market360 Secure Shopping</h1>
        </div>
        <p className="text-sm opacity-90">Your safety is our priority</p>
      </div>

      <div className="p-4 space-y-4">
        <Card className="shadow-md">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-3">How We Protect You</h2>
            <p className="text-muted-foreground leading-relaxed">
              Market360 implements multiple layers of security to ensure safe and reliable
              transactions. From seller verification to payment protection, we've got you covered
              at every step of your buying journey.
            </p>
          </CardContent>
        </Card>

        {features.map((feature, index) => (
          <Card key={index} className="shadow-sm hover:shadow-md transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-start gap-3 text-base">
                <div className="p-2 rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground font-normal mt-1">
                    {feature.description}
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
          </Card>
        ))}

        <Card className="shadow-md bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Need Help?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Our support team is available 24/7 to assist with any concerns or questions.
            </p>
            <Button onClick={() => navigate('/support')} className="w-full">
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecurityInfo;
