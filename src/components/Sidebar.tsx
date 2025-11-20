import { Menu, X, Home, HelpCircle, Mail, Shield, Info, FileText, Wallet, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Separator } from './ui/separator';

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(prefersDark);
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Info, label: 'About Us', path: '/about' },
    { icon: Wallet, label: 'How to Top Up', path: '/how-to-top-up' },
    { icon: Shield, label: 'Security Info', path: '/security-info' },
    { icon: HelpCircle, label: 'Support', path: '/support' },
    { icon: Mail, label: 'Contact', path: '/contact' },
    { icon: FileText, label: 'Terms & Conditions', path: '/terms' },
    { icon: Shield, label: 'Privacy Policy', path: '/privacy' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-muted rounded-full">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 bg-card">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Market360
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-1">
          {menuItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              className="w-full justify-start text-left hover:bg-primary/10 hover:text-primary transition-colors rounded-xl border border-transparent hover:border-primary/20"
              onClick={() => handleNavigation(item.path)}
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span className="font-medium">{item.label}</span>
            </Button>
          ))}
        </div>

        <Separator className="my-6" />

        {/* Dark Mode Toggle */}
        <div className="px-2">
          <Button
            variant="outline"
            className="w-full justify-start border-border hover:bg-accent rounded-xl"
            onClick={toggleDarkMode}
          >
            {darkMode ? (
              <>
                <Sun className="h-5 w-5 mr-3" />
                <span className="font-medium">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="h-5 w-5 mr-3" />
                <span className="font-medium">Dark Mode</span>
              </>
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;