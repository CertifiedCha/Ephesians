import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tag, Hash, Sparkles, Zap } from 'lucide-react';

interface TagCount {
  name: string;
  count: number;
}

interface CategoryCount {
  name: string;
  count: number;
}

interface BlogPost {
  id: string;
  category: string;
  tags: string[];
}

interface BlogSidebarProps {
  selectedTag: string;
  onTagChange: (tag: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  allTags: string[];
  allCategories: string[];
  posts: BlogPost[];
}

export function BlogSidebar({ 
  selectedTag, 
  onTagChange, 
  selectedCategory, 
  onCategoryChange,
  allTags,
  allCategories,
  posts
}: BlogSidebarProps) {
  
  // Calculate real tag counts from posts
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach(post => {
      post.tags.forEach(tag => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    
    return allTags.map(tag => ({
      name: tag,
      count: counts[tag] || 0
    })).sort((a, b) => b.count - a.count);
  }, [posts, allTags]);

  // Calculate real category counts from posts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach(post => {
      counts[post.category] = (counts[post.category] || 0) + 1;
    });
    
    return allCategories.map(category => ({
      name: category,
      count: counts[category] || 0
    })).sort((a, b) => b.count - a.count);
  }, [posts, allCategories]);

  return (
    <div className="w-80 space-y-6">
      {/* Categories */}
      <Card className="border-2 border-primary/10 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="p-1 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg">
              <Hash className="w-4 h-4 text-primary" />
            </div>
            Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div 
            className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 ${
              selectedCategory === 'All Categories' 
                ? 'bg-primary/15 text-primary border-2 border-primary/30 shadow-sm' 
                : 'hover:bg-muted/50 border-2 border-transparent'
            }`}
            onClick={() => onCategoryChange('All Categories')}
          >
            <span className="font-medium">All Categories</span>
            <Badge variant="secondary" className="bg-gradient-to-r from-primary/10 to-accent/10">
              {posts.length}
            </Badge>
          </div>
          {categoryCounts.map((category) => (
            <div 
              key={category.name}
              className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                selectedCategory === category.name 
                  ? 'bg-primary/15 text-primary border-2 border-primary/30 shadow-sm transform scale-[1.02]' 
                  : 'hover:bg-muted/50 hover:transform hover:scale-[1.01] border-2 border-transparent'
              }`}
              onClick={() => onCategoryChange(category.name)}
            >
              <span className="font-medium">{category.name}</span>
              <Badge 
                variant="secondary" 
                className={`transition-colors ${
                  selectedCategory === category.name 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-muted'
                }`}
              >
                {category.count}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Tags */}
      <Card className="border-2 border-primary/10 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="p-1 bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg">
              <Tag className="w-4 h-4 text-primary" />
            </div>
            Tags
            <Sparkles className="w-3 h-3 text-primary/60 ml-auto" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
            <div 
              className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                selectedTag === 'All Tags' 
                  ? 'bg-primary/15 text-primary border-2 border-primary/30 shadow-sm' 
                  : 'hover:bg-muted/50 border-2 border-transparent'
              }`}
              onClick={() => onTagChange('All Tags')}
            >
              <span className="font-medium">All Tags</span>
              <Badge variant="secondary" className="bg-gradient-to-r from-primary/10 to-accent/10">
                {tagCounts.length}
              </Badge>
            </div>
            {tagCounts.map((tag, index) => (
              <div 
                key={tag.name}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                  selectedTag === tag.name 
                    ? 'bg-primary/15 text-primary border-2 border-primary/30 shadow-sm transform scale-[1.02]' 
                    : 'hover:bg-muted/50 hover:transform hover:scale-[1.01] border-2 border-transparent'
                }`}
                onClick={() => onTagChange(tag.name)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="flex items-center gap-2">
                  <span className="font-medium">#{tag.name}</span>
                  {tag.count >= 3 && <Zap className="w-3 h-3 text-primary/60" />}
                </span>
                <Badge 
                  variant="outline" 
                  className={`transition-colors ${
                    selectedTag === tag.name 
                      ? 'bg-primary/20 text-primary border-primary/40' 
                      : 'hover:bg-accent/50'
                  }`}
                >
                  {tag.count}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="p-1 bg-gradient-to-br from-accent/30 to-primary/30 rounded-lg">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start hover:bg-primary/10 hover:border-primary/50 transition-all duration-200" 
            size="sm"
            onClick={() => {
              onTagChange('All Tags');
              onCategoryChange('All Categories');
            }}
          >
            <Tag className="w-4 h-4 mr-2" />
            Reset All Filters
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start hover:bg-accent/20 hover:border-accent transition-all duration-200" 
            size="sm"
            onClick={() => onCategoryChange('Programming')}
          >
            <Hash className="w-4 h-4 mr-2" />
            Browse Programming
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start hover:bg-accent/20 hover:border-accent transition-all duration-200" 
            size="sm"
            onClick={() => onTagChange('Tutorial')}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Find Tutorials
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}