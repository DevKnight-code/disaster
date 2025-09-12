import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert as AlertBox, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Users, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Calendar,
  Send,
  Eye,
  Settings,
  MessageSquare,
  Download,
  UserCheck,
  BarChart3,
  Award,
  Phone,
  Mail
} from 'lucide-react';

const TeacherDashboard = () => {
  const [selectedClass, setSelectedClass] = useState('12-A');
  const [profile, setProfile] = useState<{
    name: string;
    email: string;
    college: string;
    noOfStudents: number;
  } | null>(null);
  const [collegeStudents, setCollegeStudents] = useState<Array<{ id: string; name: string; email: string; modulesCompleted: number; drillsCompleted: number }>>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  interface Drill {
    _id: string;
    title: string;
    type: string;
    scheduledDate: string;
    scheduledTime: string;
    location: string;
    description?: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    createdBy: string;
    classId: string;
  }

  const [upcomingDrills, setUpcomingDrills] = useState<Drill[]>([]);
  const [isLoadingDrills, setIsLoadingDrills] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('/api/teachers/me', {
      headers: { 'Authorization': 'Bearer ' + token },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setProfile(data))
      .catch(() => setProfile(null));
  }, []);

  useEffect(() => {
    fetch('/api/alerts')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setAlerts(Array.isArray(data) ? data : []))
      .catch(() => setAlerts([]));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('/api/students/by-college', {
      headers: { 'Authorization': 'Bearer ' + token },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setCollegeStudents(data))
      .catch(() => setCollegeStudents([]));
  }, []);

  // Mock data for upcoming drills (temporary until backend is ready)
  useEffect(() => {
    const mockDrills: Drill[] = [
      {
        _id: '1',
        title: 'Fire Evacuation Drill',
        type: 'Fire Safety',
        scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
        scheduledTime: '10:00 AM',
        location: 'Main Building - Ground Floor',
        description: 'Full school fire evacuation drill. All staff and students must participate.',
        status: 'scheduled',
        createdBy: 'Admin User',
        classId: '12-A'  // Added classId
      },
      {
        _id: '2',
        title: 'Earthquake Preparedness',
        type: 'Earthquake',
        scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        scheduledTime: '11:30 AM',
        location: 'School Grounds',
        description: 'Annual earthquake drill. Please review the evacuation procedures beforehand.',
        status: 'scheduled',
        createdBy: 'Safety Officer',
        classId: '12-B'  // Added classId
      }
    ];

    // Simulate API call with timeout
    const timer = setTimeout(() => {
      setUpcomingDrills(mockDrills);
      setIsLoadingDrills(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const teacherData = {
    name: "Dr. Priya Sharma",
    subject: "Science & Safety Coordinator",
    department: "Science Department",
    classes: ['12-A', '12-B', '11-A'],
    totalStudents: 138
  };

  interface ClassData {
    [key: string]: {
      students: number;
      completionRate: number;
      averageScore: number;
      drillParticipation: number;
      strugglingStudents: number;
      topPerformers: number;
    };
  }

  const classData: ClassData = {
    '12-A': {
      students: 45,
      completionRate: 92,
      averageScore: 88,
      drillParticipation: 96,
      strugglingStudents: 3,
      topPerformers: 12
    },
    '12-B': {
      students: 47,
      completionRate: 89,
      averageScore: 85,
      drillParticipation: 94,
      strugglingStudents: 5,
      topPerformers: 10
    },
    '11-A': {
      students: 46,
      completionRate: 85,
      averageScore: 82,
      drillParticipation: 91,
      strugglingStudents: 7,
      topPerformers: 8
    }
  };

  const recentDrills = [
    {
      id: 1,
      type: 'Fire Evacuation',
      class: '12-A',
      date: '2024-01-15',
      participants: 44,
      averageScore: 92,
      status: 'completed',
      feedback: 'Excellent response time and coordination'
    },
    {
      id: 2,
      type: 'Earthquake Drill',
      class: '12-B',
      date: '2024-01-12',
      participants: 46,
      averageScore: 88,
      status: 'completed',
      feedback: 'Good technique, need improvement in hold duration'
    },
    {
      id: 3,
      type: 'Medical Emergency',
      class: '11-A',
      date: '2024-01-10',
      participants: 45,
      averageScore: 85,
      status: 'completed',
      feedback: 'Students showed good first aid knowledge'
    }
  ];

  const studentProgress = [
    {
      id: 1,
      name: 'Arjun Patel',
      rollNo: '12A001',
      modulesCompleted: 8,
      totalModules: 12,
      averageScore: 89,
      lastActive: '2 hours ago',
      status: 'on-track',
      drillScore: 92
    },
    {
      id: 2,
      name: 'Sneha Gupta',
      rollNo: '12A002',
      modulesCompleted: 12,
      totalModules: 12,
      averageScore: 95,
      lastActive: '1 hour ago',
      status: 'excellent',
      drillScore: 96
    },
    {
      id: 3,
      name: 'Rohit Sharma',
      rollNo: '12A003',
      modulesCompleted: 5,
      totalModules: 12,
      averageScore: 72,
      lastActive: '3 days ago',
      status: 'needs-attention',
      drillScore: 78
    },
    {
      id: 4,
      name: 'Anita Das',
      rollNo: '12A004',
      modulesCompleted: 10,
      totalModules: 12,
      averageScore: 87,
      lastActive: '4 hours ago',
      status: 'on-track',
      drillScore: 89
    },
    {
      id: 5,
      name: 'Vikram Singh',
      rollNo: '12A005',
      modulesCompleted: 7,
      totalModules: 12,
      averageScore: 81,
      lastActive: '1 day ago',
      status: 'on-track',
      drillScore: 85
    }
  ];

  const parentCommunications = [
    {
      id: 1,
      studentName: 'Rohit Sharma',
      parentName: 'Mr. Raj Sharma',
      subject: 'Progress Update Needed',
      date: '2024-01-16',
      status: 'pending',
      priority: 'high'
    },
    {
      id: 2,
      studentName: 'Priya Gupta',
      parentName: 'Mrs. Sunita Gupta',
      subject: 'Excellent Performance',
      date: '2024-01-15',
      status: 'sent',
      priority: 'low'
    },
    {
      id: 3,
      studentName: 'Arjun Patel',
      parentName: 'Mr. Suresh Patel',
      subject: 'Drill Performance Report',
      date: '2024-01-14',
      status: 'sent',
      priority: 'medium'
    }
  ];

  const recentDrillsData = [
    {
      id: 1,
      type: 'Flood Response',
      date: '2023-06-15',
      time: '10:00 AM',
      location: 'School Grounds',
      status: 'scheduled',
      preparation: 75,
      feedback: 'Last drill completed with 92% participation.'
    },
    {
      id: 2,
      type: 'Earthquake Drill',
      date: '2023-06-20',
      time: '11:30 AM',
      location: 'All Buildings',
      status: 'scheduled',
      preparation: 45,
      feedback: 'Please review the evacuation routes before the drill.'
    }
  ];

  const currentClass = classData[selectedClass as keyof typeof classData];

  const handleSendMessage = (studentId: number) => {
    alert(`Sending message to student ${studentId}...`);
  };

  const handleScheduleDrill = () => {
    alert('Opening drill scheduling interface...');
  };

  const handleExportReport = () => {
    alert('Exporting class report...');
  };

  const handleContactParent = (communicationId: number) => {
    alert(`Contacting parent for communication ${communicationId}...`);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{profile ? `Welcome, ${profile.name}` : 'Teacher Dashboard'}</h1>
            {profile && (
              <p className="text-muted-foreground">{profile.college}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2"
            >
              {teacherData.classes.map(cls => (
                <option key={cls} value={cls}>Class {cls}</option>
              ))}
            </select>
            <Button variant="outline" onClick={handleExportReport}>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <Button onClick={handleScheduleDrill}>
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Drill
            </Button>
          </div>
        </div>

        {/* Teacher Profile Card */}
        {profile && (
          <div className="grid grid-cols-1 gap-4">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Your Details</CardTitle>
                <CardDescription>Teacher profile information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Name</div>
                    <div className="font-medium text-foreground">{profile.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Email</div>
                    <div className="font-medium text-foreground">{profile.email}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">College</div>
                    <div className="font-medium text-foreground">{profile.college}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">No. of Students</div>
                    <div className="font-medium text-foreground">{profile.noOfStudents}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Class Overview Cards */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <Users className="mx-auto mb-2 h-8 w-8 text-primary" />
              <div className="text-2xl font-bold text-foreground">{currentClass.students}</div>
              <div className="text-sm text-muted-foreground">Total Students</div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <BookOpen className="mx-auto mb-2 h-8 w-8 text-success" />
              <div className="text-2xl font-bold text-foreground">{currentClass.completionRate}%</div>
              <div className="text-sm text-muted-foreground">Completion Rate</div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <Target className="mx-auto mb-2 h-8 w-8 text-warning" />
              <div className="text-2xl font-bold text-foreground">{currentClass.averageScore}%</div>
              <div className="text-sm text-muted-foreground">Average Score</div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <UserCheck className="mx-auto mb-2 h-8 w-8 text-emergency" />
              <div className="text-2xl font-bold text-foreground">{currentClass.drillParticipation}%</div>
              <div className="text-sm text-muted-foreground">Drill Participation</div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {currentClass.strugglingStudents > 0 && (
          <Card className="border-2 border-warning/20 bg-warning/5 shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-warning" />
                <div>
                  <h3 className="font-semibold text-foreground">Attention Required</h3>
                  <p className="text-sm text-muted-foreground">
                    {currentClass.strugglingStudents} students in Class {selectedClass} need additional support
                  </p>
                </div>
                <Button variant="outline" size="sm" className="ml-auto">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Alerts from System */}
        {alerts.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Active Alerts</h2>
            {alerts.map((alert: any) => (
              <AlertBox key={alert._id || alert.alertId || alert.id} className={`border-2 ${
                (alert.severity?.toLowerCase?.() === 'critical' || alert.severity?.toLowerCase?.() === 'high') ? 'border-emergency/20 bg-emergency/5' :
                (alert.severity?.toLowerCase?.() === 'medium') ? 'border-warning/20 bg-warning/5' :
                'border-primary/20 bg-primary/5'
              }`}>
                <AlertTitle className="flex items-center justify-between">
                  <span>{alert.title || alert.type}</span>
                  <Badge variant={(alert.severity?.toLowerCase?.() === 'critical' || alert.severity?.toLowerCase?.() === 'high') ? 'destructive' : 'outline'}>
                    {alert.severity}
                  </Badge>
                </AlertTitle>
                <AlertDescription>
                  {alert.description || alert.message}
                  <div className="mt-2 text-xs text-muted-foreground">
                    {alert.area ? `Area: ${alert.area}` : null}
                    {alert.incidentDate || alert.incidentTime ? ` ${alert.incidentDate || ''} ${alert.incidentTime || ''}` : ''}
                  </div>
                </AlertDescription>
              </AlertBox>
            ))}
          </div>
        )}

        {/* Main Content */}
        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="drills">Drills</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Students ({collegeStudents.length})</CardTitle>
                <CardDescription>
                  Students from {profile?.college || 'your college'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Modules Completed</TableHead>
                      <TableHead>Drills Completed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {collegeStudents.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium">{s.name}</TableCell>
                        <TableCell>{s.email}</TableCell>
                        <TableCell>{s.modulesCompleted}</TableCell>
                        <TableCell>{s.drillsCompleted}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Drills Tab */}
          <TabsContent value="drills" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Recent Drill Results</CardTitle>
                  <CardDescription>Performance overview of completed drills</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentDrills.map((drill) => (
                      <div key={drill.id} className="rounded-lg border p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-foreground">{drill.type}</h4>
                          <Badge variant="outline">Class {drill.class}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-muted-foreground">Date:</span>
                            <div className="font-medium">{drill.date}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Participants:</span>
                            <div className="font-medium">{drill.participants}/{currentClass.students}</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">Score: {drill.averageScore}%</div>
                          <Progress value={drill.averageScore} className="w-20 h-2" />
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{drill.feedback}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Upcoming Drills</CardTitle>
                    <Button size="sm" variant="outline" onClick={handleScheduleDrill}>
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule New
                    </Button>
                  </div>
                  <CardDescription>Upcoming emergency drills and exercises</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingDrills ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : upcomingDrills.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingDrills.map((drill) => {
                        const drillDate = new Date(drill.scheduledDate);
                        const formattedDate = drillDate.toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        });
                        
                        return (
                          <div key={drill._id} className="rounded-lg border p-4 hover:bg-accent/50 transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <h4 className="font-semibold text-foreground">{drill.title}</h4>
                                  <Badge variant="outline">{drill.type}</Badge>
                                </div>
                                <div className="text-sm text-muted-foreground mt-1">
                                  {formattedDate} at {drill.scheduledTime}
                                </div>
                                {drill.location && (
                                  <div className="mt-1 text-sm">
                                    <span className="text-muted-foreground">Location: </span>
                                    <span className="font-medium">{drill.location}</span>
                                  </div>
                                )}
                                {drill.description && (
                                  <p className="mt-2 text-sm text-muted-foreground">
                                    {drill.description}
                                  </p>
                                )}
                                <div className="mt-2">
                                  <Badge variant="secondary">
                                    Scheduled by: {drill.createdBy}
                                  </Badge>
                                </div>
                              </div>
                              <Button variant="outline" size="sm" className="ml-4">
                                View Details
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <Calendar className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="mt-4 text-sm font-medium text-foreground">No upcoming drills</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Schedule a new drill to get started
                      </p>
                      <Button className="mt-4" onClick={handleScheduleDrill}>
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule New Drill
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Class Performance</CardTitle>
                  <CardDescription>Overall class metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Module Completion</span>
                        <span>{currentClass.completionRate}%</span>
                      </div>
                      <Progress value={currentClass.completionRate} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Average Score</span>
                        <span>{currentClass.averageScore}%</span>
                      </div>
                      <Progress value={currentClass.averageScore} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Drill Participation</span>
                        <span>{currentClass.drillParticipation}%</span>
                      </div>
                      <Progress value={currentClass.drillParticipation} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Student Distribution</CardTitle>
                  <CardDescription>Performance categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-success"></div>
                        <span className="text-sm">Top Performers</span>
                      </div>
                      <span className="font-medium">{currentClass.topPerformers}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-primary"></div>
                        <span className="text-sm">On Track</span>
                      </div>
                      <span className="font-medium">{currentClass.students - currentClass.topPerformers - currentClass.strugglingStudents}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-warning"></div>
                        <span className="text-sm">Need Support</span>
                      </div>
                      <span className="font-medium">{currentClass.strugglingStudents}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common teaching tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Assign New Module
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Generate Report
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Send className="mr-2 h-4 w-4" />
                      Send Announcement
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Award className="mr-2 h-4 w-4" />
                      Award Badges
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Communication Tab */}
          <TabsContent value="communication" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Parent Communications</CardTitle>
                <CardDescription>
                  Manage communications with parents and guardians
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Parent</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parentCommunications.map((comm) => (
                      <TableRow key={comm.id}>
                        <TableCell className="font-medium">{comm.studentName}</TableCell>
                        <TableCell>{comm.parentName}</TableCell>
                        <TableCell>{comm.subject}</TableCell>
                        <TableCell>{comm.date}</TableCell>
                        <TableCell>
                          <Badge variant={
                            comm.priority === 'high' ? 'destructive' :
                            comm.priority === 'medium' ? 'default' : 'secondary'
                          }>
                            {comm.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={comm.status === 'sent' ? 'default' : 'outline'}>
                            {comm.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleContactParent(comm.id)}
                            >
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Mail className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Teacher Resources</CardTitle>
                  <CardDescription>Download lesson plans and templates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {[
                      {
                        title: "Earthquake Safety Lesson Plan",
                        file: "/lessons/Earthquake_Safety_Lesson_Plan.pdf",
                        type: "PDF",
                      },
                      {
                        title: "First Aid Assessment Quiz",
                        file: "/lessons/First_Aid_Assessment_Quiz.docx",
                        type: "DOCX",
                      },
                      {
                        title: "Emergency Contact Templates",
                        file: "/lessons/Emergency_Contact_Templates.pdf",
                        type: "PDF",
                      },
                      {
                        title: "Drill Coordination Guide",
                        file: "/lessons/Drill_Coordination_Guide.docx",
                        type: "DOCX",
                      },
                    ].map((resource, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="font-medium">{resource.title}</div>
                          <div className="text-sm text-muted-foreground">{resource.type}</div>
                        </div>
                        <a href={resource.file} download>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </a>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Professional Development</CardTitle>
                  <CardDescription>Training and certification programs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { title: 'Advanced Emergency Response', progress: 75, status: 'in-progress' },
                      { title: 'Child Psychology in Crisis', progress: 100, status: 'completed' },
                      { title: 'Digital Safety Education', progress: 45, status: 'in-progress' },
                      { title: 'Disaster Risk Assessment', progress: 0, status: 'not-started' }
                    ].map((course, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground">{course.title}</span>
                          <Badge variant={course.status === 'completed' ? 'default' : 'outline'}>
                            {course.status === 'completed' ? 'Completed' : 
                             course.status === 'in-progress' ? 'In Progress' : 'Available'}
                          </Badge>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                        <div className="text-sm text-muted-foreground">{course.progress}% complete</div>
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

export default TeacherDashboard;