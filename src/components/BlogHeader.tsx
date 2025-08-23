import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, Moon, Sun, Filter, BookOpen, Archive, Tag, Calendar, SortDesc, Sparkles, Zap, X } from 'lucide-react';

interface BlogHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedTag: string;
  onTagChange: (tag: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onCreatePost: () => void;
}

export function BlogHeader({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedTag,
  onTagChange,
  sortBy,
  onSortChange,
  onCreatePost
}: BlogHeaderProps) {
  const [isDark, setIsDark] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (theme === 'dark' || (!theme && systemPrefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const categories = [
    'All Categories',
    'Technology',
    'Design',
    'Programming',
    'Tutorial',
    'Opinion',
    'News',
    'Review'
  ];

  const popularTags = [
    'All Tags',
    'JavaScript',
    'React',
    'Design',
    'CSS',
    'Tutorial',
    'Web Development',
    'UI/UX',
    'Frontend',
    'Backend'
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First', icon: Calendar },
    { value: 'oldest', label: 'Oldest First', icon: Calendar },
    { value: 'popular', label: 'Most Popular', icon: Zap },
    { value: 'title', label: 'Title A-Z', icon: SortDesc }
  ];

  const activeFiltersCount = [
    selectedCategory !== 'All Categories' ? 1 : 0,
    selectedTag !== 'All Tags' ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  const clearSearch = () => {
    onSearchChange('');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 border-primary/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl">
              <Archive className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Video Archive
              </h1>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Sparkles className="w-3 h-3" />
                <span>Dynamic & Interactive</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-2xl mx-8">
          <div className={`relative transition-all duration-300 ${isSearchFocused ? 'scale-105' : ''}`}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 transition-colors" />
            <Input
              placeholder="Search videos, topics, authors, tags..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={`pl-10 pr-10 w-full transition-all duration-300 ${
                isSearchFocused 
                  ? 'border-primary/50 shadow-lg shadow-primary/10 bg-background' 
                  : 'border-border hover:border-primary/30'
              } ${searchQuery ? 'bg-primary/5' : ''}`}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-6 w-6 hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
            {searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-1 text-xs text-muted-foreground bg-background/90 backdrop-blur-sm border border-primary/20 rounded-lg p-2">
                Searching for: <span className="font-medium text-primary">"{searchQuery}"</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className={`relative transition-all duration-200 ${
                  activeFiltersCount > 0 
                    ? 'border-primary/50 bg-primary/5 hover:bg-primary/10' 
                    : 'hover:border-primary/30'
                }`}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="ml-2 bg-primary text-primary-foreground animate-pulse"
                  >
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4 border-2 border-primary/20" align="end">
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-primary/20">
                  <Filter className="w-4 h-4 text-primary" />
                  <span className="font-medium">Filter Options</span>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                    <Tag className="w-3 h-3" />
                    Category
                  </label>
                  <Select value={selectedCategory} onValueChange={onCategoryChange}>
                    <SelectTrigger className="hover:border-primary/50 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    Tag
                  </label>
                  <Select value={selectedTag} onValueChange={onTagChange}>
                    <SelectTrigger className="hover:border-primary/50 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {popularTags.map((tag) => (
                        <SelectItem key={tag} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                    <SortDesc className="w-3 h-3" />
                    Sort By
                  </label>
                  <Select value={sortBy} onValueChange={onSortChange}>
                    <SelectTrigger className="hover:border-primary/50 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <option.icon className="w-3 h-3" />
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-all duration-200"
                  onClick={() => {
                    onCategoryChange('All Categories');
                    onTagChange('All Tags');
                    onSortChange('newest');
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear All Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Button 
            onClick={toggleTheme} 
            variant="outline" 
            size="sm"
            className="hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
          >
            {isDark ? 
              <Sun className="w-4 h-4 text-yellow-500" /> : 
              <Moon className="w-4 h-4 text-blue-600" />
            }
          </Button>

          <Button 
            onClick={onCreatePost} 
            size="sm"
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </div>
      </div>
    </header>
  );
}