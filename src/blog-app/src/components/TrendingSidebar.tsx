import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { TrendingUp, Hash, Trophy, Users, Zap, Flame, Sparkles } from 'lucide-react';

interface TrendingTopic {
  id: string;
  hashtag: string;
  posts: number;
  change: number;
  category: string;
}

interface Challenge {
  id: string;
  title: string;
  participants: number;
  timeLeft: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  reward: string;
}

interface Creator {
  id: string;
  name: string;
  handle: string;
  followers: string;
  growth: number;
  category: string;
}

export function TrendingSidebar() {
  const [trendingTopics] = useState<TrendingTopic[]>([
    { id: '1', hashtag: 'DesignChallenge2024', posts: 12500, change: 85, category: 'Design' },
    { id: '2', hashtag: 'AIRevolution', posts: 8900, change: 65, category: 'Technology' },
    { id: '3', hashtag: 'SustainableLiving', posts: 6700, change: 45, category: 'Lifestyle' },
    { id: '4', hashtag: 'CodeNewbie', posts: 5400, change: 32, category: 'Programming' },
    { id: '5', hashtag: 'MindfulMonday', posts: 4200, change: 28, category: 'Wellness' },
  ]);

  const [activeChallenges] = useState<Challenge[]>([
    { id: '1', title: '30-Day UI Challenge', participants: 2340, timeLeft: '12 days', difficulty: 'Medium', reward: '$500' },
    { id: '2', title: 'Code a Game in 48h', participants: 890, timeLeft: '2 days', difficulty: 'Hard', reward: '$1000' },
    { id: '3', title: 'Photography Week', participants: 5670, timeLeft: '5 days', difficulty: 'Easy', reward: 'Feature' },
  ]);

  const [risingCreators] = useState<Creator[]>([
    { id: '1', name: 'Maya Patel', handle: 'mayacodes', followers: '12.5K', growth: 145, category: 'Development' },
    { id: '2', name: 'Alex Rivera', handle: 'alexdesigns', followers: '8.9K', growth: 98, category: 'Design' },
    { id: '3', name: 'Sam Chen', handle: 'samwrites', followers: '15.2K', growth: 76, category: 'Writing' },
  ]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 border-green-200 bg-green-50';
      case 'Medium': return 'text-yellow-600 border-yellow-200 bg-yellow-50';
      case 'Hard': return 'text-red-600 border-red-200 bg-red-50';
      default: return 'text-gray-600 border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="w-80 space-y-6">
      {/* Trending Topics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Trending Now
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {trendingTopics.map((topic, index) => (
            <div key={topic.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                <div>
                  <p className="font-medium text-sm">#{topic.hashtag}</p>
                  <p className="text-xs text-muted-foreground">{topic.posts.toLocaleString()} posts</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-600">+{topic.change}%</span>
              </div>
            </div>
          ))}
          <Button variant="ghost" className="w-full text-sm" size="sm">
            Show more trends
          </Button>
        </CardContent>
      </Card>

      {/* Active Challenges */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Active Challenges
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeChallenges.map((challenge) => (
            <div key={challenge.id} className="p-3 border rounded-lg hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-sm">{challenge.title}</h4>
                <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                  {challenge.difficulty}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{challenge.participants} participants</span>
                  <span>{challenge.timeLeft} left</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium">Reward: {challenge.reward}</span>
                  <Button size="sm" variant="outline" className="h-6 text-xs">
                    Join
                  </Button>
                </div>
              </div>
            </div>
          ))}
          <Button variant="ghost" className="w-full text-sm" size="sm">
            View all challenges
          </Button>
        </CardContent>
      </Card>

      {/* Rising Creators */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Rising Creators
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {risingCreators.map((creator) => (
            <div key={creator.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                  {creator.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-medium text-sm">{creator.name}</p>
                  <p className="text-xs text-muted-foreground">@{creator.handle}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium">{creator.followers}</p>
                <div className="flex items-center gap-1">
                  <Flame className="w-3 h-3 text-orange-500" />
                  <span className="text-xs text-orange-600">+{creator.growth}%</span>
                </div>
              </div>
            </div>
          ))}
          <Button variant="ghost" className="w-full text-sm" size="sm">
            Discover more creators
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start" size="sm">
            <Zap className="w-4 h-4 mr-2" />
            Create Thought Bubble
          </Button>
          <Button variant="outline" className="w-full justify-start" size="sm">
            <Trophy className="w-4 h-4 mr-2" />
            Start Challenge
          </Button>
          <Button variant="outline" className="w-full justify-start" size="sm">
            <Users className="w-4 h-4 mr-2" />
            Find Communities
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}