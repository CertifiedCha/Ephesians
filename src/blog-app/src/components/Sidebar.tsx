import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ChevronDown, ChevronRight, Home, Settings, Users, BookOpen, Tag, Star, TrendingUp } from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  subItems?: { id: string; label: string }[];
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(['content']);

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home className="w-4 h-4" />,
      badge: 'New'
    },
    {
      id: 'content',
      label: 'Content',
      icon: <BookOpen className="w-4 h-4" />,
      subItems: [
        { id: 'articles', label: 'Articles' },
        { id: 'media', label: 'Media Library' },
        { id: 'categories', label: 'Categories' }
      ]
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <TrendingUp className="w-4 h-4" />,
      badge: '12'
    },
    {
      id: 'tags',
      label: 'Tag Manager',
      icon: <Tag className="w-4 h-4" />
    },
    {
      id: 'users',
      label: 'Users',
      icon: <Users className="w-4 h-4" />
    },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: <Star className="w-4 h-4" />
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />
    }
  ];

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleItemClick = (itemId: string, hasSubItems: boolean) => {
    if (hasSubItems) {
      toggleExpanded(itemId);
    } else {
      onSectionChange(itemId);
    }
  };

  return (
    <div className="w-64 bg-card border-r border-border h-screen p-4 flex flex-col">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">Dynamic Site</h2>
        <p className="text-sm text-muted-foreground">Interactive Dashboard</p>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <div key={item.id}>
            <Button
              variant={activeSection === item.id ? "secondary" : "ghost"}
              className="w-full justify-start h-10 px-3"
              onClick={() => handleItemClick(item.id, !!item.subItems)}
            >
              <span className="flex items-center gap-3 flex-1">
                {item.icon}
                <span>{item.label}</span>
              </span>
              {item.badge && (
                <Badge variant="secondary" className="ml-auto">
                  {item.badge}
                </Badge>
              )}
              {item.subItems && (
                expandedItems.includes(item.id) ? 
                <ChevronDown className="w-4 h-4 ml-auto" /> : 
                <ChevronRight className="w-4 h-4 ml-auto" />
              )}
            </Button>

            {item.subItems && expandedItems.includes(item.id) && (
              <div className="ml-6 mt-1 space-y-1">
                {item.subItems.map((subItem) => (
                  <Button
                    key={subItem.id}
                    variant={activeSection === subItem.id ? "secondary" : "ghost"}
                    className="w-full justify-start h-8 px-3 text-sm"
                    onClick={() => onSectionChange(subItem.id)}
                  >
                    {subItem.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <Separator className="my-4" />
      
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Quick Actions</p>
        <Button variant="outline" size="sm" className="w-full justify-start">
          <Tag className="w-3 h-3 mr-2" />
          Create Tag
        </Button>
      </div>
    </div>
  );
}