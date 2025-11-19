import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Store, TrendingUp, Wallet, Users, CheckCircle2, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface BecomeSellerModalProps {
  open: boolean;
  onClose: () => void;
}

const BecomeSellerModal = ({ open, onClose }: BecomeSellerModalProps) => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    onClose();
    navigate('/become-seller');
  };

  const benefits = [
    {
      icon: Store,
      title: 'Your Own Store',
      description: 'Create a professional storefront to showcase your products'
    },
    {
      icon: TrendingUp,
      title: 'Grow Your Business',
      description: 'Reach thousands of buyers across Sierra Leone'
    },
    {
      icon: Wallet,
      title: 'Secure Payments',
      description: 'Get paid quickly with our escrow protection system'
    },
    {
      icon: Users,
      title: 'Build Your Brand',
      description: 'Connect with customers and build lasting relationships'
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between mb-2">
            <div className="p-3 rounded-full bg-primary/10">
              <Store className="h-6 w-6 text-primary" />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogTitle className="text-2xl">Start Selling on Market360</DialogTitle>
          <DialogDescription className="text-base">
            Join thousands of sellers and turn your products into profit
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Benefits Grid */}
          <div className="grid grid-cols-1 gap-3">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 h-fit">
                      <benefit.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">{benefit.title}</h4>
                      <p className="text-xs text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Facts */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                What You Get:
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Free store setup and listing</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Secure escrow payment system</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Built-in messaging with buyers</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Real-time order management</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Analytics and insights dashboard</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <div className="space-y-3 pt-2">
            <Button 
              className="w-full h-12 text-base font-semibold"
              onClick={handleGetStarted}
              size="lg"
            >
              <Store className="h-5 w-5 mr-2" />
              Get Started Now
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              It only takes a few minutes to set up your store
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BecomeSellerModal;
