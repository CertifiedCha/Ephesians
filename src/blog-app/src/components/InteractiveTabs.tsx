import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { BarChart3, Users, Target, TrendingUp, Calendar, Star, Heart, MessageCircle } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'pending' | 'completed';
  progress?: number;
  tags: string[];
  icon: React.ReactNode;
}

export function InteractiveTabs() {
  const [activeTab, setActiveTab] = useState('overview');

  const overviewData = [
    { label: 'Total Projects', value: '24', change: '+12%', icon: <Target className="w-4 h-4" /> },
    { label: 'Active Users', value: '1,234', change: '+5%', icon: <Users className="w-4 h-4" /> },
    { label: 'Completion Rate', value: '89%', change: '+3%', icon: <TrendingUp className="w-4 h-4" /> },
    { label: 'Monthly Growth', value: '15%', change: '+8%', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const projectsData: ContentItem[] = [
    {
      id: '1',
      title: 'Website Redesign',
      description: 'Complete overhaul of the company website with modern design',
      status: 'active',
      progress: 75,
      tags: ['Design', 'Development', 'UX'],
      icon: <Target className="w-4 h-4" />
    },
    {
      id: '2',
      title: 'Mobile App Development',
      description: 'React Native app for iOS and Android platforms',
      status: 'active',
      progress: 45,
      tags: ['Mobile', 'React', 'Development'],
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      id: '3',
      title: 'Marketing Campaign',
      description: 'Q4 digital marketing strategy and implementation',
      status: 'pending',
      tags: ['Marketing', 'Strategy', 'Digital'],
      icon: <Star className="w-4 h-4" />
    },
    {
      id: '4',
      title: 'Database Migration',
      description: 'Migration from legacy system to modern cloud infrastructure',
      status: 'completed',
      progress: 100,
      tags: ['Database', 'Cloud', 'Migration'],
      icon: <Calendar className="w-4 h-4" />
    }
  ];

  const analyticsData = [
    { metric: 'Page Views', value: '45,678', trend: 'up', percentage: '12%' },
    { metric: 'Unique Visitors', value: '12,345', trend: 'up', percentage: '8%' },
    { metric: 'Bounce Rate', value: '23%', trend: 'down', percentage: '5%' },
    { metric: 'Conversion Rate', value: '3.4%', trend: 'up', percentage: '15%' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>Interactive Dashboard</h2>
        <p className="text-muted-foreground">Dynamic content with interactive tabs</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Team
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {overviewData.map((item, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className="text-2xl">{item.value}</p>
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        {item.change}
                      </Badge>
                    </div>
                    <div className="text-muted-foreground">
                      {item.icon}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { action: 'New project created', time: '2 minutes ago', icon: <Target className="w-4 h-4" /> },
                { action: 'User feedback received', time: '15 minutes ago', icon: <MessageCircle className="w-4 h-4" /> },
                { action: 'Analytics report generated', time: '1 hour ago', icon: <BarChart3 className="w-4 h-4" /> },
                { action: 'Team member added', time: '3 hours ago', icon: <Users className="w-4 h-4" /> }
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                  <div className="text-muted-foreground">{activity.icon}</div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <div className="grid gap-4">
            {projectsData.map((project) => (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-muted-foreground">{project.icon}</div>
                      <div>
                        <h3 className="font-semibold">{project.title}</h3>
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(project.status)} variant="outline">
                      {project.status}
                    </Badge>
                  </div>

                  {project.progress !== undefined && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 flex-wrap">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analyticsData.map((item, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{item.metric}</p>
                      <p className="text-3xl mt-2">{item.value}</p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={item.trend === 'up' ? 'text-green-600 border-green-200' : 'text-red-600 border-red-200'}
                    >
                      {item.trend === 'up' ? '↗' : '↘'} {item.percentage}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Insights</CardTitle>
              <CardDescription>Key metrics and trends analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm">Traffic Growth</span>
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    +23% this month
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm">User Engagement</span>
                  <Badge variant="outline" className="text-blue-600 border-blue-200">
                    +15% avg. session time
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm">Revenue Impact</span>
                  <Badge variant="outline" className="text-purple-600 border-purple-200">
                    +31% conversion
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Alex Johnson', role: 'Frontend Developer', status: 'online', projects: 5 },
              { name: 'Sarah Chen', role: 'UX Designer', status: 'away', projects: 3 },
              { name: 'Mike Davis', role: 'Backend Developer', status: 'online', projects: 7 },
              { name: 'Lisa Wang', role: 'Product Manager', status: 'offline', projects: 12 },
              { name: 'Tom Wilson', role: 'DevOps Engineer', status: 'online', projects: 4 },
              { name: 'Emma Brown', role: 'QA Tester', status: 'away', projects: 6 }
            ].map((member, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      member.status === 'online' ? 'bg-green-500' : 
                      member.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {member.projects} active projects
                    </span>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="w-3 h-3 mr-1" />
                      Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}