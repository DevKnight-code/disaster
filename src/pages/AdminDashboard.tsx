import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
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
  Settings,
  Pencil,
  Trash2
} from 'lucide-react';
import { Link } from 'react-router-dom';

type DrillTypeOption = 'Fire Drill' | 'Earthquake Drill' | 'Evacuation Drill' | 'Flood Response Drill' | 'Lockdown Drill';

interface Drill {
  id: string;
  title: string;
  type: DrillTypeOption;
  date: string;
  time: string;
  durationMinutes: number;
  location: string;
  description: string;
}

interface DrillFormState {
  title: string;
  type: DrillTypeOption | '';
  date: string;
  time: string;
  durationMinutes: string;
  location: string;
  description: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);
  const [profile, setProfile] = useState<{
    name: string;
    email: string;
    college: string;
    noOfStudentsAllColleges: number;
  } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('/api/admins/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setProfile(data))
      .catch(() => setProfile(null));
  }, []);
  const [scheduledDrills, setScheduledDrills] = useState<Drill[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<DrillFormState>({
    title: '',
    type: '',
    date: '',
    time: '',
    durationMinutes: '',
    location: '',
    description: '',
  });

  const drillTypes: DrillTypeOption[] = useMemo(() => (
    ['Fire Drill', 'Earthquake Drill', 'Evacuation Drill', 'Flood Response Drill', 'Lockdown Drill']
  ), []);

  const validateForm = (): string[] => {
    const errors: string[] = [];
    if (!form.title.trim()) errors.push('Drill Title is required');
    if (!form.type) errors.push('Drill Type is required');
    if (!form.date) errors.push('Date is required');
    if (!form.time) errors.push('Time is required');
    const dur = Number(form.durationMinutes);
    if (!form.durationMinutes || Number.isNaN(dur) || dur <= 0) errors.push('Duration (minutes) must be a positive number');
    if (!form.location.trim()) errors.push('Location/Area is required');
    if (!form.description.trim()) errors.push('Description/Instructions are required');
    return errors;
  };

  const resetForm = () => {
    setForm({ title: '', type: '', date: '', time: '', durationMinutes: '', location: '', description: '' });
    setEditingId(null);
  };

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

  const [drills, setDrills] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  useEffect(() => {
    fetch('/api/drills')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setDrills)
      .catch(() => setDrills([]));
  }, []);
  useEffect(() => {
    fetch('/api/alerts')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setAlerts(Array.isArray(data) ? data : []))
      .catch(() => setAlerts([]));
  }, []);

  const activeAlerts = alerts;
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

  const classPerformance = [
    { class: 'Class 12-A', students: 45, completion: 95, avgScore: 89, participation: 98 },
    { class: 'Class 12-B', students: 43, completion: 92, avgScore: 87, participation: 95 },
    { class: 'Class 11-A', students: 48, completion: 88, avgScore: 85, participation: 92 },
    { class: 'Class 11-B', students: 46, completion: 85, avgScore: 82, participation: 89 },
    { class: 'Class 10-A', students: 50, completion: 91, avgScore: 88, participation: 96 }
  ];

  const handleSendAlert = () => {
    navigate('/alerts');
  };

  const handleExportReport = () => {
    alert('Downloading comprehensive preparedness report...');
  };

  const handleScheduleDrill = () => {
    const errors = validateForm();
    if (errors.length) {
      toast({ title: 'Please correct the form', description: errors.join(' • '), variant: 'destructive' });
      return;
    }
    if (editingId) {
      setScheduledDrills((prev) => prev.map((d) => d.id === editingId ? { ...d, ...{
        title: form.title.trim(),
        type: form.type as DrillTypeOption,
        date: form.date,
        time: form.time,
        durationMinutes: Number(form.durationMinutes),
        location: form.location.trim(),
        description: form.description.trim(),
      }} : d));
      toast({ title: 'Drill updated', description: `${form.title} has been updated.` });
      resetForm();
      return;
    }
    const newDrill: Drill = {
      id: `DRL-${Date.now()}`,
      title: form.title.trim(),
      type: form.type as DrillTypeOption,
      date: form.date,
      time: form.time,
      durationMinutes: Number(form.durationMinutes),
      location: form.location.trim(),
      description: form.description.trim(),
    };
    setScheduledDrills((prev) => [newDrill, ...prev]);
    toast({ title: 'Drill scheduled', description: `${newDrill.title} on ${newDrill.date} at ${newDrill.time}` });
    resetForm();
  };

  const openMockScheduler = () => navigate('/drills/schedule');

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{profile ? `Welcome, ${profile.name}` : 'Disaster Management Admin Portal'}</h1>
            <p className="text-muted-foreground">{profile ? profile.college : institutionData.name}</p>
          </div>
          <div className="flex items-center gap-3">
            {/* <Link to="/auth" className="hidden sm:inline-flex">
              <Button variant="outline" size="sm">Sign In</Button>
            </Link>
            <Link to="/auth" className="hidden sm:inline-flex">
              <Button size="sm" className="bg-gradient-primary">Sign Up</Button>
            </Link> */}
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

        {/* Admin Profile Card */}
        {profile && (
          <div className="grid grid-cols-1 gap-4">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Admin Details</CardTitle>
                <CardDescription>Your administrator profile</CardDescription>
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
                    <div className="text-sm text-muted-foreground">Students Across Colleges</div>
                    <div className="font-medium text-foreground">{profile.noOfStudentsAllColleges}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

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
            {activeAlerts.map((alert: any) => (
              <Alert key={alert._id || alert.alertId || alert.id} className={`border-2 ${
                (alert.severity?.toLowerCase?.() === 'critical' || alert.severity?.toLowerCase?.() === 'high') ? 'border-emergency/20 bg-emergency/5' :
                (alert.severity?.toLowerCase?.() === 'medium') ? 'border-warning/20 bg-warning/5' :
                'border-primary/20 bg-primary/5'
              }`}>
                <AlertTriangle className="h-4 w-4" />
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
                    <Button className="w-full mt-4" onClick={openMockScheduler}>
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
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Schedule Drill Card */}
              <Card className="shadow-card hover:shadow-glow transition-shadow">
                <CardHeader>
                  <CardTitle>Schedule Emergency Drill</CardTitle>
                  <CardDescription>Plan and configure upcoming drills</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Button variant="outline" size="sm" onClick={() => navigate('/drills/schedule')}>
                      Open Full Mock Drill Scheduler
                    </Button>
                  </div>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="drill-title">Drill Title</Label>
                      <Input id="drill-title" placeholder="e.g., Fire Evacuation - Block B" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Drill Type</Label>
                      <Select value={form.type} onValueChange={(val) => setForm((f) => ({ ...f, type: val as DrillTypeOption }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {drillTypes.map((t) => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="drill-date">Date</Label>
                        <Input id="drill-date" type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="drill-time">Time</Label>
                        <Input id="drill-time" type="time" value={form.time} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="drill-duration">Duration (minutes)</Label>
                        <Input id="drill-duration" type="number" min={1} placeholder="45" value={form.durationMinutes} onChange={(e) => setForm((f) => ({ ...f, durationMinutes: e.target.value }))} />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="drill-location">Location/Area</Label>
                      <Input id="drill-location" placeholder="e.g., Main Building - Block B" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="drill-desc">Description/Instructions</Label>
                      <Textarea id="drill-desc" rows={4} placeholder="Provide drill objectives, steps, safety notes..." value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
                    </div>
                    <div className="flex items-center gap-3">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button className="bg-gradient-success" type="button">
                            <Calendar className="mr-2 h-4 w-4" />
                            {editingId ? 'Update Drill' : 'Schedule Drill'}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{editingId ? 'Update this drill?' : 'Schedule this drill?'}</AlertDialogTitle>
                            <AlertDialogDescription>
                              Please confirm the details before saving. You can edit later.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Review</AlertDialogCancel>
                            <AlertDialogAction onClick={handleScheduleDrill}>Confirm</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      {editingId && (
                        <Button variant="outline" type="button" onClick={resetForm}>Cancel Edit</Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Drills Card */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Upcoming Scheduled Drills</CardTitle>
                  <CardDescription>Manage scheduled drills</CardDescription>
                </CardHeader>
                <CardContent>
                  {scheduledDrills.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No drills scheduled yet.</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {scheduledDrills.map((d) => (
                          <TableRow key={d.id}>
                            <TableCell className="font-medium">{d.title}</TableCell>
                            <TableCell>{d.type}</TableCell>
                            <TableCell>{d.date}</TableCell>
                            <TableCell>{d.time}</TableCell>
                            <TableCell>{d.durationMinutes} min</TableCell>
                            <TableCell>{d.location}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => { setEditingId(d.id); setForm({
                                  title: d.title, type: d.type, date: d.date, time: d.time, durationMinutes: String(d.durationMinutes), location: d.location, description: d.description
                                }); }}>
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => setScheduledDrills((prev) => prev.filter((x) => x.id !== d.id))}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
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
                    {activeAlerts.map((alert: any) => (
                      <div key={alert._id || alert.alertId || alert.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-foreground">{alert.title || alert.type}</h4>
                          <Badge variant={(alert.severity?.toLowerCase?.() === 'critical' || alert.severity?.toLowerCase?.() === 'high') ? 'destructive' : 'outline'}>
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{alert.description || alert.message}</p>
                        <div className="text-xs text-muted-foreground">
                          {alert.area ? `Area: ${alert.area}` : null}
                          {alert.incidentDate || alert.incidentTime ? ` ${alert.incidentDate || ''} ${alert.incidentTime || ''}` : ''}
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