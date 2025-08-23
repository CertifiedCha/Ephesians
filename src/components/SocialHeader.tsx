import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Bell, Search, Plus, MessageCircle, Heart, Bookmark, Settings, LogOut, User, Palette, Zap } from 'lucide-react';

interface SocialHeaderProps {
  onCreatePost: () => void;
  onSectionChange: (section: string) => void;
}

export function SocialHeader({ onCreatePost, onSectionChange }: SocialHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications] = useState([
    { id: 1, type: 'like', user: 'Sarah Chen', content: 'liked your post about design trends', time: '2m ago', unread: true },
    { id: 2, type: 'comment', user: 'Alex Rodriguez', content: 'commented on your photography challenge', time: '15m ago', unread: true },
    { id: 3, type: 'follow', user: 'Mike Johnson', content: 'started following you', time: '1h ago', unread: false },
    { id: 4, type: 'mention', user: 'Emma Wilson', content: 'mentioned you in a thought bubble', time: '2h ago', unread: false },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart className="w-4 h-4 text-red-500" />;
      case 'comment': return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'follow': return <User className="w-4 h-4 text-green-500" />;
      case 'mention': return <Zap className="w-4 h-4 text-purple-500" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Button 
            variant="ghost" 
            className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:bg-transparent"
            onClick={() => onSectionChange('feed')}
          >
            SocialBlog
          </Button>
          
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search posts, users, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-4">
          <Button variant="ghost" onClick={() => onSectionChange('feed')}>
            <Zap className="w-4 h-4 mr-2" />
            Feed
          </Button>
          <Button variant="ghost" onClick={() => onSectionChange('discover')}>
            <Search className="w-4 h-4 mr-2" />
            Discover
          </Button>
          <Button variant="ghost" onClick={() => onSectionChange('challenges')}>
            <Palette className="w-4 h-4 mr-2" />
            Challenges
          </Button>
        </nav>

        <div className="flex items-center gap-3">
          <Button onClick={onCreatePost} size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            <Plus className="w-4 h-4 mr-2" />
            Create
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Notifications</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <div key={notification.id} className={`p-4 border-b hover:bg-muted/50 ${notification.unread ? 'bg-blue-50 dark:bg-blue-950/20' : ''}`}>
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-medium">{notification.user}</span> {notification.content}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  YU
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0" align="end">
              <div className="p-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold">
                    YU
                  </div>
                  <div>
                    <p className="font-medium">Your User</p>
                    <p className="text-sm text-muted-foreground">@yourhandle</p>
                  </div>
                </div>
              </div>
              <div className="p-2">
                <Button variant="ghost" className="w-full justify-start" onClick={() => onSectionChange('profile')}>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => onSectionChange('bookmarks')}>
                  <Bookmark className="w-4 h-4 mr-2" />
                  Bookmarks
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => onSectionChange('settings')}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}