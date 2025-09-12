import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, Users, BookOpen, Zap, Award, BarChart3, Bell, Home, GraduationCap, UserCheck, Target, TrendingUp, MapPin, Phone, AlertCircle } from 'lucide-react';

const Index = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const navigate = useNavigate();

  const roles = [
    {
      id: 'student',
      title: 'Student Portal',
      description: 'Interactive learning modules, virtual drills, and progress tracking',
      icon: GraduationCap,
      color: 'bg-gradient-primary',
      features: ['Interactive Learning', 'Virtual Drills', 'Progress Tracking', 'Gamification']
    },
    {
      id: 'teacher',
      title: 'Teacher Dashboard',
      description: 'Manage classes, monitor progress, and coordinate drills',
      icon: UserCheck,
      color: 'bg-gradient-success',
      features: ['Class Management', 'Progress Monitoring', 'Drill Coordination', 'Parent Communication']
    },
    {
      id: 'admin',
      title: 'Admin Console',
      description: 'Institution management, analytics, and emergency systems',
      icon: Shield,
      color: 'bg-gradient-emergency',
      features: ['User Management', 'Analytics Dashboard', 'Emergency Alerts', 'Compliance Reports']
    }
  ];

  const stats = [
    { label: 'Educational Institutions', value: '1.5M+', icon: Home, color: 'text-primary' },
    { label: 'Students & Teachers', value: '50M+', icon: Users, color: 'text-success' },
    { label: 'Disaster Scenarios', value: '25+', icon: AlertTriangle, color: 'text-warning' },
    { label: 'Safety Modules', value: '100+', icon: BookOpen, color: 'text-emergency' },
  ];

  const features = [
    {
      icon: BookOpen,
      title: 'Interactive Learning Modules',
      description: 'Comprehensive disaster preparedness education with region-specific content and multimedia resources.'
    },
    {
      icon: Target,
      title: 'Virtual Drill Simulations',
      description: '3D virtual environments for practicing emergency procedures with real-time performance tracking.'
    },
    {
      icon: Bell,
      title: 'Emergency Alert System',
      description: 'Multi-channel communication system for instant emergency notifications and crisis management.'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Comprehensive dashboards with AI-powered insights for preparedness assessment and improvement.'
    },
    {
      icon: Award,
      title: 'Gamified Experience',
      description: 'Achievement badges, leaderboards, and rewards to enhance engagement and learning retention.'
    },
    {
      icon: MapPin,
      title: 'Location-Based Alerts',
      description: 'Region-specific disaster warnings and localized emergency response protocols.'
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Priya Sharma',
      role: 'Principal, Delhi Public School',
      quote: 'This platform has revolutionized our disaster preparedness training. Students are more engaged and confident in emergency situations.',
      rating: 5
    },
    {
      name: 'Prof. Rajesh Kumar',
      role: 'Safety Officer, IIT Mumbai',
      quote: 'The virtual drill simulations are incredibly realistic. Our emergency response times have improved by 40% since implementation.',
      rating: 5
    }
  ];

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    if (role === 'student') navigate('/student');
    else if (role === 'teacher') navigate('/teacher');
    else if (role === 'admin') navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-background">
      

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-success/5 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            
            <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Building Disaster-Ready{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Educational Institutions
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Comprehensive disaster preparedness education platform with interactive learning modules, 
              virtual drills, and real-time emergency management for schools and colleges across India.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/auth" className="inline-flex">
                <Button size="lg" className="bg-gradient-primary shadow-glow">
                  <Zap className="mr-2 h-5 w-5" />
                  Start Learning
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                <BarChart3 className="mr-2 h-5 w-5" />
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="border-b bg-card py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Selection */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground">Choose Your Portal</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Access tailored features designed for your role in disaster preparedness education
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {roles.map((role) => (
              <Card key={role.id} className="group cursor-pointer shadow-card transition-all hover:shadow-glow hover:-translate-y-1">
                <CardHeader>
                  <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg ${role.color}`}>
                    <role.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-center">{role.title}</CardTitle>
                  <CardDescription className="text-center">{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-6">
                    {role.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-muted-foreground">
                        <div className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => handleRoleSelect(role.id)}
                    variant={selectedRole === role.id ? "default" : "outline"}
                  >
                    Access Portal
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground">Comprehensive Features</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need for effective disaster preparedness education
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-card">
                <CardHeader>
                  <feature.icon className="h-8 w-8 text-primary" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Alert Demo */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-foreground">Emergency Alert System</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Real-time emergency notifications with multi-channel delivery
            </p>
            <Card className="mt-8 border-2 border-emergency/20 bg-emergency/5">
              <CardContent className="p-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emergency animate-pulse-emergency">
                    <AlertCircle className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-emergency">EMERGENCY DRILL ALERT</h3>
                <p className="mt-2 text-muted-foreground">
                  Earthquake drill scheduled for 3:00 PM today. Please proceed to your designated safe zones.
                </p>
                <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                  <Button variant="outline" className="border-emergency text-emergency hover:bg-emergency hover:text-white">
                    <Phone className="mr-2 h-4 w-4" />
                    Contact Emergency Services
                  </Button>
                  <Button className="bg-emergency hover:bg-emergency/90">
                    Acknowledge Alert
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground">Trusted by Educators</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              See what educational leaders are saying about our platform
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <div key={i} className="h-4 w-4 text-warning">⭐</div>
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                  <div className="mt-4">
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      

      {/* Footer */}
      <footer className="border-t bg-card py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img src="/logo.png" alt="DisasterEd Logo" className="h-8 w-8 rounded-lg object-contain" />
                <span className="font-bold text-foreground">DisasterEd</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Building safer educational institutions through comprehensive disaster preparedness education.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Student Portal</li>
                <li>Teacher Dashboard</li>
                <li>Admin Console</li>
                <li>Mobile App</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Documentation</li>
                <li>Training Materials</li>
                <li>Best Practices</li>
                <li>Support Center</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Emergency: 112</li>
                <li>Support: help@disastered.in</li>
                <li>Sales: sales@disastered.in</li>
                <li>NDMA Partnership</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 DisasterEd. Built for Smart India Hackathon 2025. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;