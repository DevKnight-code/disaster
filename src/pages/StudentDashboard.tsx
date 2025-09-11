import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Target, 
  Award, 
  TrendingUp, 
  Clock, 
  Users, 
  AlertTriangle,
  Shield,
  Zap,
  Calendar,
  Play,
  CheckCircle,
  Star,
  Trophy,
  Flame,
  CloudRain,
  Building,
  Heart
} from 'lucide-react';

const StudentDashboard = () => {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [profile, setProfile] = useState<{
    name: string;
    email: string;
    college: string;
    modulesCompleted: number;
    drillsCompleted: number;
    points?: number;
    progressByModule?: Record<string, number>;
  } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('/api/students/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setProfile(data))
      .catch(() => setProfile(null));
  }, []);

  const studentData = {
    name: "Arjun Patel",
    class: "Class 12-A",
    institution: "Delhi Public School",
    totalPoints: 2450,
    level: 8,
    rank: 15,
    streakDays: 12
  };

  const learningProgress = {
    completedModules: 8,
    totalModules: 12,
    currentModule: "Fire Safety & Evacuation",
    averageScore: 87,
    timeSpent: 24.5,
    nextDrill: "Earthquake Drill - Tomorrow 2:00 PM"
  };

  const modules = [
    {
      id: 'earthquake',
      title: 'Earthquake Safety',
      description: 'Learn Drop, Cover, and Hold techniques',
      icon: Building,
      progress: profile?.progressByModule?.['Earthquake Safety'] ?? 0,
      status: 'completed',
      difficulty: 'Intermediate',
      duration: '45 min',
      points: 300,
      color: 'bg-success'
    },
    {
      id: 'fire',
      title: 'Fire Safety & Evacuation',
      description: 'Fire prevention and emergency evacuation',
      icon: Flame,
      progress: profile?.progressByModule?.['Fire Safety & Evacuation'] ?? 0,
      status: 'in-progress',
      difficulty: 'Advanced',
      duration: '60 min',
      points: 400,
      color: 'bg-warning'
    },
    {
      id: 'flood',
      title: 'Flood Response',
      description: 'Water safety and flood preparedness',
      icon: CloudRain,
      progress: profile?.progressByModule?.['Flood Response'] ?? 0,
      status: 'locked',
      difficulty: 'Intermediate',
      duration: '50 min',
      points: 350,
      color: 'bg-primary'
    },
    {
      id: 'medical',
      title: 'Medical Emergency',
      description: 'First aid and CPR basics',
      icon: Heart,
      progress: profile?.progressByModule?.['Medical Emergency'] ?? 0,
      status: 'in-progress',
      difficulty: 'Beginner',
      duration: '40 min',
      points: 250,
      color: 'bg-emergency'
    }
  ];

  const achievements = [
    { id: 1, title: 'Quick Learner', description: 'Complete 5 modules', icon: Zap, earned: true },
    { id: 2, title: 'Drill Master', description: 'Perfect drill performance', icon: Target, earned: true },
    { id: 3, title: 'Safety Champion', description: 'Top 10 in class', icon: Trophy, earned: true },
    { id: 4, title: 'Consistent Student', description: '30-day streak', icon: Calendar, earned: false },
    { id: 5, title: 'Helper', description: 'Help 10 classmates', icon: Users, earned: false },
    { id: 6, title: 'Expert', description: 'Complete all modules', icon: Star, earned: false }
  ];

  const recentDrills = [
    {
      id: 1,
      type: 'Fire Evacuation',
      date: '2024-01-15',
      score: 92,
      time: '2:45',
      status: 'excellent',
      feedback: 'Great response time and route selection!'
    },
    {
      id: 2,
      type: 'Earthquake Drill',
      date: '2024-01-10',
      score: 88,
      time: '1:30',
      status: 'good',
      feedback: 'Good drop-cover technique, improve hold duration.'
    },
    {
      id: 3,
      type: 'Lockdown Drill',
      date: '2024-01-05',
      score: 85,
      time: '3:20',
      status: 'good',
      feedback: 'Silent communication was perfect.'
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'Priya Sharma', points: 3200, avatar: '👩‍🎓' },
    { rank: 2, name: 'Ravi Kumar', points: 2950, avatar: '👨‍🎓' },
    { rank: 3, name: 'Anita Singh', points: 2800, avatar: '👩‍🎓' },
    { rank: 4, name: 'You', points: studentData.totalPoints, avatar: '🙋‍♂️', isCurrentUser: true },
    { rank: 5, name: 'Rajesh Gupta', points: 2300, avatar: '👨‍🎓' }
  ];

  const handleStartModule = (moduleId: string) => {
    setSelectedModule(moduleId);
    const moduleTitle = modules.find(m => m.id === moduleId)?.title || 'Module';
    navigate('/module-quiz', { state: { moduleName: moduleTitle } });
  };

  const handleJoinDrill = () => {
    alert('Joining virtual drill simulation...');
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome back{profile ? `, ${profile.name}` : ''}!</h1>
            {profile && (
              <p className="text-muted-foreground">{profile.college}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="px-3 py-1">
              Level {studentData.level}
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              #{studentData.rank} in Class
            </Badge>
            <Button className="bg-gradient-primary">
              <Zap className="mr-2 h-4 w-4" />
              {studentData.totalPoints} Points
            </Button>
          </div>
        </div>

        {/* Student Profile Card */}
        {profile && (
          <div className="grid grid-cols-1 gap-4">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Student Details</CardTitle>
                <CardDescription>Your profile information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                    <div className="text-sm text-muted-foreground">Modules Completed</div>
                    <div className="font-medium text-foreground">{profile.modulesCompleted}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Drills Completed</div>
                    <div className="font-medium text-foreground">{profile.drillsCompleted}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <BookOpen className="mx-auto mb-2 h-8 w-8 text-primary" />
              <div className="text-2xl font-bold text-foreground">{learningProgress.completedModules}/{learningProgress.totalModules}</div>
              <div className="text-sm text-muted-foreground">Modules Complete</div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <Target className="mx-auto mb-2 h-8 w-8 text-success" />
              <div className="text-2xl font-bold text-foreground">{learningProgress.averageScore}%</div>
              <div className="text-sm text-muted-foreground">Average Score</div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <Clock className="mx-auto mb-2 h-8 w-8 text-warning" />
              <div className="text-2xl font-bold text-foreground">{learningProgress.timeSpent}h</div>
              <div className="text-sm text-muted-foreground">Time Spent</div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <Zap className="mx-auto mb-2 h-8 w-8 text-emergency" />
              <div className="text-2xl font-bold text-foreground">{studentData.streakDays}</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="learning" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="learning">Learning</TabsTrigger>
            <TabsTrigger value="drills">Virtual Drills</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          {/* Learning Tab */}
          <TabsContent value="learning" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Continue Learning</CardTitle>
                    <CardDescription>
                      Pick up where you left off or start a new module
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {modules.map((module) => (
                        <div key={module.id} className="flex items-center gap-4 rounded-lg border p-4">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${module.color}`}>
                            <module.icon className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-foreground">{module.title}</h3>
                              <Badge variant="outline">{module.difficulty}</Badge>
                              {module.status === 'completed' && (
                                <CheckCircle className="h-4 w-4 text-success" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{module.description}</p>
                            <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{module.duration}</span>
                              <span>{module.points} points</span>
                            </div>
                            <Progress value={module.progress} className="mt-2" />
                          </div>
                          <Button
                            variant={module.status === 'completed' ? 'outline' : 'default'}
                            disabled={module.status === 'locked'}
                            onClick={() => handleStartModule(module.id)}
                          >
                            {module.status === 'completed' ? 'Review' : 
                             module.status === 'in-progress' ? 'Continue' : 
                             module.status === 'locked' ? 'Locked' : 'Start'}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {/* Next Drill */}
                <Card className="border-2 border-emergency/20 bg-emergency/5 shadow-emergency">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-emergency">
                      <AlertTriangle className="h-5 w-5" />
                      Next Drill
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{learningProgress.nextDrill}</p>
                    <Button className="mt-4 w-full bg-emergency hover:bg-emergency/90" onClick={handleJoinDrill}>
                      <Play className="mr-2 h-4 w-4" />
                      Join Virtual Drill
                    </Button>
                  </CardContent>
                </Card>

                {/* Class Leaderboard */}
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-warning" />
                      Class Leaderboard
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {leaderboard.map((student) => (
                        <div
                          key={student.rank}
                          className={`flex items-center gap-3 rounded-lg p-2 ${
                            student.isCurrentUser ? 'bg-primary/10 border border-primary/20' : ''
                          }`}
                        >
                          <div className="text-lg">{student.avatar}</div>
                          <div className="flex-1">
                            <div className="font-medium text-foreground">{student.name}</div>
                            <div className="text-sm text-muted-foreground">{student.points} points</div>
                          </div>
                          <Badge variant={student.rank <= 3 ? 'default' : 'outline'}>
                            #{student.rank}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Drills Tab */}
          <TabsContent value="drills" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Recent Drill Performance</CardTitle>
                <CardDescription>
                  Track your performance in virtual emergency drills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentDrills.map((drill) => (
                    <div key={drill.id} className="flex items-center gap-4 rounded-lg border p-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                        drill.status === 'excellent' ? 'bg-success' :
                        drill.status === 'good' ? 'bg-warning' : 'bg-muted'
                      }`}>
                        <Target className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{drill.type}</h3>
                        <p className="text-sm text-muted-foreground">{drill.feedback}</p>
                        <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Date: {drill.date}</span>
                          <span>Time: {drill.time}</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">{drill.score}%</div>
                        <Badge variant={drill.status === 'excellent' ? 'default' : 'outline'}>
                          {drill.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Learning Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Overall Progress</span>
                        <span>{Math.round((learningProgress.completedModules / learningProgress.totalModules) * 100)}%</span>
                      </div>
                      <Progress value={(learningProgress.completedModules / learningProgress.totalModules) * 100} className="mt-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Average Score</span>
                        <span>{learningProgress.averageScore}%</span>
                      </div>
                      <Progress value={learningProgress.averageScore} className="mt-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Time Investment</span>
                        <span>{learningProgress.timeSpent} hours</span>
                      </div>
                      <Progress value={75} className="mt-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Skill Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { skill: 'Fire Safety', level: 92 },
                      { skill: 'Earthquake Response', level: 88 },
                      { skill: 'First Aid', level: 75 },
                      { skill: 'Evacuation Procedures', level: 85 },
                    ].map((skill, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm">
                          <span>{skill.skill}</span>
                          <span>{skill.level}%</span>
                        </div>
                        <Progress value={skill.level} className="mt-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Your Achievements</CardTitle>
                <CardDescription>
                  Unlock badges by completing modules and participating in drills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`rounded-lg border p-4 text-center ${
                        achievement.earned 
                          ? 'border-primary/20 bg-primary/5' 
                          : 'border-muted bg-muted/5 opacity-60'
                      }`}
                    >
                      <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg ${
                        achievement.earned ? 'bg-gradient-primary' : 'bg-muted'
                      }`}>
                        <achievement.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-foreground">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      {achievement.earned && (
                        <Badge className="mt-2 bg-success">Earned</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentDashboard;