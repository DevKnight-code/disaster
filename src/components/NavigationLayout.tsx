import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Users, 
  GraduationCap, 
  Shield, 
  Settings, 
  Bell, 
  LogOut,
  AlertTriangle
} from 'lucide-react';

interface NavigationLayoutProps {
  children: React.ReactNode;
}

const NavigationLayout: React.FC<NavigationLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isAuthed, setIsAuthed] = useState<boolean>(Boolean(localStorage.getItem('token')));
  useEffect(() => {
    setIsAuthed(Boolean(localStorage.getItem('token')));
  }, [location.pathname]);
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  }, []);
  
  const navigationItems: any[] = [];
  const isActive = (_path: string) => false;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="DisasterEd Logo" className="h-10 w-10 rounded-lg object-contain" />
              <div>
                <h1 className="text-xl font-bold text-foreground">DisasterEd</h1>
                <p className="text-xs text-muted-foreground">Preparedness Education System</p>
              </div>
            </div>
            
            {/* Navigation Links removed as requested */}

            <div className="flex items-center space-x-4">
              {isAuthed ? (
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Log Out
                </Button>
              ) : (
                <>
                  <Link to="/auth" className="inline-flex">
                    <Button variant="outline" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/auth" className="inline-flex">
                    <Button size="sm" className="bg-gradient-primary">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation removed as requested */}

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default NavigationLayout;