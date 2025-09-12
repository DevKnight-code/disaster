import React, { useCallback, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  const isAuthed = useMemo(() => Boolean(localStorage.getItem('token')), []);
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/auth';
  }, []);
  
  const navigationItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/student', label: 'Student Portal', icon: GraduationCap },
    { path: '/teacher', label: 'Teacher Dashboard', icon: Users },
    { path: '/admin', label: 'Admin Console', icon: Shield },
    { path: '/auth', label: 'Sign In / Up', icon: LogOut },
    { path: '/alerts', label: 'Alerts', icon: AlertTriangle },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">DisasterEd</h1>
                <p className="text-xs text-muted-foreground">Preparedness Education System</p>
              </div>
            </div>
            
            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
                <Badge variant="destructive" className="ml-1 h-2 w-2 p-0" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              {isAuthed ? (
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </Button>
              ) : (
                <Link to="/auth" className="inline-flex">
                  <Button variant="outline" size="sm">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden border-b bg-card">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1 py-2 overflow-x-auto">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default NavigationLayout;