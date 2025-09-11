import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Users, 
  BookOpen, 
  Target, 
  AlertTriangle, 
  TrendingUp, 
  BarChart3,
  UserPlus,
  Bell,
  Shield,
  Download,
  Send,
  Eye,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Activity,
  MapPin,
  Phone,
  FileText,
  Settings
} from 'lucide-react';

const AdminDashboard = () => {
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);

  const institutionData = {
    name: "Delhi Public School, Sector 45",
    totalStudents: 2847,
    totalTeachers: 142,
    totalStaff: 89,
    preparednessScore: 78,
    activeAlerts: 2,
    upcomingDrills: 3
  };

  const metrics = [
    {
      title: 'Total Users',
      value: `${institutionData.totalStudents + institutionData.totalTeachers + institutionData.totalStaff}`,
      change: '+5.2%',
      trend: 'up',
      icon: Users,
      color: 'text-primary'
    },
    {
      title: 'Course Completion',
      value: '87%',
      change: '+12%',
      trend: 'up',
      icon: BookOpen,
      color: 'text-success'
    },
    {
      title: 'Drill Participation',
      value: '94%',
      change: '+8%',
      trend: 'up',
      icon: Target,
      color: 'text-warning'
    },
    {
      title: 'Preparedness Score',
      value: `${institutionData.preparednessScore}%`,
      change: '+15%',
      trend: 'up',
      icon: Shield,
      color: 'text-emergency'
    }
  ];

  const recentDrills = [
    {
      id: 1,
      type: 'Fire Evacuation',
      date: '2024-01-15',
      participants: 2456,
      averageTime: '4:32',
      score: 92,
      status: 'completed'
    },
    {
      id: 2,
      type: 'Earthquake Drill',
      date: '2024-01-12',
      participants: 2389,
      averageTime: '2:18',
      score: 88,
      status: 'completed'
    },
    {
      id: 3,
      type: 'Lockdown Drill',
      date: '2024-01-08',
      participants: 2567,
      averageTime: '6:45',
      score: 85,
      status: 'completed'
    }
  ];

  const upcomingDrills = [
    {
      id: 1,
      type: 'Flood Response',
      scheduledDate: '2024-01-20',
      scheduledTime: '10:30 AM',
      targetParticipants: 2800,
      preparationStatus: 'ready'
    },
    {
      id: 2,
      type: 'Medical Emergency',
      scheduledDate: '2024-01-25',
      scheduledTime: '2:00 PM',
      targetParticipants: 1200,
      preparationStatus: 'planning'
    }
  ];

  const activeAlerts = [
    {
      id: 1,
      type: 'Weather Warning',
      severity: 'medium',
      title: 'Heavy Rain Alert',
      message: 'Heavy rainfall expected in the region. Monitor weather updates.',
      affectedUsers: 3078,
      timestamp: '2024-01-16 09:30',
      status: 'active'
    },
    {
      id: 2,
      type: 'Drill Reminder',
      severity: 'low',
      title: 'Upcoming Drill Notification',
      message: 'Flood response drill scheduled for tomorrow at 10:30 AM.',
      affectedUsers: 2800,
      timestamp: '2024-01-16 08:00',
      status: 'active'
    }
  ];

  const classPerformance = [
    { class: 'Class 12-A', students: 45, completion: 95, avgScore: 89, participation: 98 },
    { class: 'Class 12-B', students: 43, completion: 92, avgScore: 87, participation: 95 },
    { class: 'Class 11-A', students: 48, completion: 88, avgScore: 85, participation: 92 },
    { class: 'Class 11-B', students: 46, completion: 85, avgScore: 82, participation: 89 },
    { class: 'Class 10-A', students: 50, completion: 91, avgScore: 88, participation: 96 }
  ];

  const handleSendAlert = () => {
    alert('Emergency alert sent to all users!');
  };

  const handleExportReport = () => {
    alert('Downloading comprehensive preparedness report...');
  };

  const handleScheduleDrill = () => {
    alert('Opening drill scheduling interface...');
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">{institutionData.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleExportReport}>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <Button className="bg-gradient-emergency shadow-emergency" onClick={handleSendAlert}>
              <Bell className="mr-2 h-4 w-4" />
              Send Alert
            </Button>
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {metrics.map((metric, index) => (
            <Card key={index} className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.title}</p>
                    <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                    <p className={`text-xs ${metric.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                      {metric.change} from last month
                    </p>
                  </div>
                  <metric.icon className={`h-8 w-8 ${metric.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Active Alerts */}
        {activeAlerts.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Active Alerts</h2>
            {activeAlerts.map((alert) => (
              <Alert key={alert.id} className={`border-2 ${
                alert.severity === 'high' ? 'border-emergency/20 bg-emergency/5' :
                alert.severity === 'medium' ? 'border-warning/20 bg-warning/5' :
                'border-primary/20 bg-primary/5'
              }`}>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="flex items-center justify-between">
                  <span>{alert.title}</span>
                  <Badge variant={alert.severity === 'high' ? 'destructive' : 'outline'}>
                    {alert.severity}
                  </Badge>
                </AlertTitle>
                <AlertDescription>
                  {alert.message}
                  <div className="mt-2 text-xs text-muted-foreground">
                    Sent to {alert.affectedUsers} users • {alert.timestamp}
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="drills">Drills</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="emergency">Emergency</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Recent Drill Performance</CardTitle>
                  <CardDescription>Latest emergency drill results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentDrills.map((drill) => (
                      <div key={drill.id} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <h4 className="font-medium text-foreground">{drill.type}</h4>
                          <p className="text-sm text-muted-foreground">
                            {drill.participants} participants • {drill.date}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-foreground">{drill.score}%</div>
                          <div className="text-sm text-muted-foreground">{drill.averageTime}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Upcoming Drills</CardTitle>
                  <CardDescription>Scheduled emergency exercises</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingDrills.map((drill) => (
                      <div key={drill.id} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <h4 className="font-medium text-foreground">{drill.type}</h4>
                          <p className="text-sm text-muted-foreground">
                            {drill.scheduledDate} at {drill.scheduledTime}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant={drill.preparationStatus === 'ready' ? 'default' : 'outline'}>
                            {drill.preparationStatus}
                          </Badge>
                          <p className="text-sm text-muted-foreground mt-1">
                            {drill.targetParticipants} expected
                          </p>
                        </div>
                      </div>
                    ))}
                    <Button className="w-full mt-4" onClick={handleScheduleDrill}>
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule New Drill
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">User Management</h2>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Users
              </Button>
            </div>
            
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Class Performance Overview</CardTitle>
                <CardDescription>Student engagement and completion rates by class</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Class</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Completion Rate</TableHead>
                      <TableHead>Avg Score</TableHead>
                      <TableHead>Drill Participation</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classPerformance.map((classData, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{classData.class}</TableCell>
                        <TableCell>{classData.students}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{classData.completion}%</span>
                            <div className="h-2 w-16 bg-muted rounded">
                              <div 
                                className="h-2 bg-primary rounded" 
                                style={{ width: `${classData.completion}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{classData.avgScore}%</TableCell>
                        <TableCell>{classData.participation}%</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Drills Tab */}
          <TabsContent value="drills" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Drill Management</h2>
              <Button onClick={handleScheduleDrill}>
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Drill
              </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Drill History</CardTitle>
                  <CardDescription>Complete record of conducted drills</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentDrills.map((drill) => (
                      <div key={drill.id} className="rounded-lg border p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-foreground">{drill.type}</h4>
                          <Badge variant="outline">{drill.status}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Date:</span>
                            <div className="font-medium">{drill.date}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Participants:</span>
                            <div className="font-medium">{drill.participants}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Avg Time:</span>
                            <div className="font-medium">{drill.averageTime}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Score:</span>
                            <div className="font-medium">{drill.score}%</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Drill Statistics</CardTitle>
                  <CardDescription>Performance metrics and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg bg-muted/50 p-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-foreground">94%</div>
                        <div className="text-sm text-muted-foreground">Average Participation</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-success">88%</div>
                        <div className="text-xs text-muted-foreground">Avg Performance</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-warning">4:35</div>
                        <div className="text-xs text-muted-foreground">Avg Response Time</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Fire Evacuation</span>
                        <span>92%</span>
                      </div>
                      <div className="h-2 bg-muted rounded">
                        <div className="h-2 bg-emergency rounded" style={{ width: '92%' }} />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Earthquake Response</span>
                        <span>88%</span>
                      </div>
                      <div className="h-2 bg-muted rounded">
                        <div className="h-2 bg-warning rounded" style={{ width: '88%' }} />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Lockdown Procedure</span>
                        <span>85%</span>
                      </div>
                      <div className="h-2 bg-muted rounded">
                        <div className="h-2 bg-primary rounded" style={{ width: '85%' }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Analytics & Reports</h2>
              <Button onClick={handleExportReport}>
                <Download className="mr-2 h-4 w-4" />
                Export Full Report
              </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Preparedness Score</CardTitle>
                  <CardDescription>Overall institutional readiness</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-foreground mb-2">{institutionData.preparednessScore}%</div>
                    <Badge className="bg-success">Excellent</Badge>
                    <p className="text-sm text-muted-foreground mt-2">
                      15% improvement from last quarter
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Learning Analytics</CardTitle>
                  <CardDescription>Student engagement metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Module Completion</span>
                      <span className="font-semibold">87%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Average Score</span>
                      <span className="font-semibold">85%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Time Spent</span>
                      <span className="font-semibold">24.5h avg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Active Users</span>
                      <span className="font-semibold">2,847</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Compliance Status</CardTitle>
                  <CardDescription>Regulatory compliance overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">NDMA Guidelines</span>
                      <CheckCircle className="h-5 w-5 text-success" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Fire Safety Norms</span>
                      <CheckCircle className="h-5 w-5 text-success" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Evacuation Plans</span>
                      <CheckCircle className="h-5 w-5 text-success" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Staff Training</span>
                      <XCircle className="h-5 w-5 text-warning" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Emergency Tab */}
          <TabsContent value="emergency" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Emergency Management</h2>
              <Button className="bg-gradient-emergency" onClick={handleSendAlert}>
                <Send className="mr-2 h-4 w-4" />
                Broadcast Alert
              </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Emergency Contacts</CardTitle>
                  <CardDescription>Quick access to emergency services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { service: 'Fire Department', number: '101', type: 'primary' },
                      { service: 'Police', number: '100', type: 'primary' },
                      { service: 'Medical Emergency', number: '108', type: 'primary' },
                      { service: 'Disaster Management', number: '1070', type: 'secondary' },
                      { service: 'School Admin', number: '+91-11-2345-6789', type: 'secondary' }
                    ].map((contact, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium text-foreground">{contact.service}</div>
                          <div className="text-sm text-muted-foreground">{contact.number}</div>
                        </div>
                        <Button size="sm" variant={contact.type === 'primary' ? 'default' : 'outline'}>
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Alert History</CardTitle>
                  <CardDescription>Recently sent emergency notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activeAlerts.map((alert) => (
                      <div key={alert.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-foreground">{alert.title}</h4>
                          <Badge variant={alert.severity === 'high' ? 'destructive' : 'outline'}>
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                        <div className="text-xs text-muted-foreground">
                          Sent to {alert.affectedUsers} users • {alert.timestamp}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;