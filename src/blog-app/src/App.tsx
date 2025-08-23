import { useState, useMemo } from 'react';
import { BlogHeader } from './components/BlogHeader';
import { BlogPostCard } from './components/BlogPostCard';
import { BlogSidebar } from './components/BlogSidebar';
import { CreateBlogModal } from './components/CreateBlogModal';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Archive, Search, Sparkles, Filter } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  author: {
    name: string;
    avatar?: string;
  };
  publishedAt: string;
  readTime: string;
  category: string;
  tags: string[];
  type: 'article' | 'video' | 'image' | 'external';
  thumbnail?: string;
  videoUrl?: string;
  externalUrl?: string;
  views: number;
  isBookmarked?: boolean;
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedTag, setSelectedTag] = useState('All Tags');
  const [sortBy, setSortBy] = useState('newest');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const [posts, setPosts] = useState<BlogPost[]>([
    {
      id: '1',
      title: 'Complete React Tutorial - Build Modern Apps',
      excerpt: 'Learn React from scratch with this comprehensive tutorial. We\'ll build a complete application covering hooks, context, routing, and state management.',
      author: { name: 'Sarah Chen' },
      publishedAt: '2 days ago',
      readTime: '45 min',
      category: 'Programming',
      tags: ['React', 'JavaScript', 'Tutorial', 'Frontend'],
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&h=300&fit=crop',
      videoUrl: 'https://www.youtube.com/watch?v=Tn6-PIqc4UM',
      views: 12847,
      isBookmarked: false
    },
    {
      id: '2',
      title: 'CSS Grid Complete Guide - Responsive Layouts',
      excerpt: 'Master CSS Grid with practical examples. Learn how to create complex responsive layouts that work across all devices.',
      author: { name: 'Alex Rivera' },
      publishedAt: '5 days ago',
      readTime: '30 min',
      category: 'Design',
      tags: ['CSS', 'Grid', 'Layout', 'Responsive', 'Design'],
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop',
      videoUrl: 'https://www.youtube.com/watch?v=jV8B24rSN5o',
      views: 8923,
      isBookmarked: true
    },
    {
      id: '3',
      title: 'Node.js Performance Optimization Techniques',
      excerpt: 'Deep dive into Node.js performance optimization. Learn about memory management, async optimization, and scaling strategies.',
      author: { name: 'Mike Johnson' },
      publishedAt: '1 week ago',
      readTime: '25 min',
      category: 'Programming',
      tags: ['Node.js', 'Performance', 'Backend', 'JavaScript'],
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&h=300&fit=crop',
      videoUrl: 'https://www.youtube.com/watch?v=Mus_vwhTCq0',
      views: 15456,
      isBookmarked: false
    },
    {
      id: '4',
      title: 'UI/UX Design Principles - From Concept to Implementation',
      excerpt: 'Learn fundamental UI/UX design principles through practical examples. Discover how to create user-centered designs.',
      author: { name: 'Emma Wilson' },
      publishedAt: '2 weeks ago',
      readTime: '35 min',
      category: 'Design',
      tags: ['UI/UX', 'Design', 'Tutorial', 'Principles'],
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=500&h=300&fit=crop',
      videoUrl: 'https://www.youtube.com/watch?v=0JCUH5daCCE',
      views: 9876,
      isBookmarked: true
    },
    {
      id: '5',
      title: 'TypeScript for Beginners - Complete Course',
      excerpt: 'Start your TypeScript journey with this beginner-friendly course. Learn types, interfaces, generics, and best practices.',
      author: { name: 'David Chen' },
      publishedAt: '3 weeks ago',
      readTime: '60 min',
      category: 'Programming',
      tags: ['TypeScript', 'JavaScript', 'Tutorial', 'Programming'],
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1555949963-f9fe496c8b0e?w=500&h=300&fit=crop',
      videoUrl: 'https://www.youtube.com/watch?v=BwuLxPH8IDs',
      views: 21134,
      isBookmarked: false
    },
    {
      id: '6',
      title: 'Modern JavaScript ES6+ Features Explained',
      excerpt: 'Explore modern JavaScript features including arrow functions, destructuring, modules, promises, and async/await.',
      author: { name: 'Lisa Garcia' },
      publishedAt: '4 days ago',
      readTime: '40 min',
      category: 'Programming',
      tags: ['JavaScript', 'ES6', 'Modern', 'Tutorial'],
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=500&h=300&fit=crop',
      videoUrl: 'https://www.youtube.com/watch?v=nZ1DMMsyVyI',
      views: 7892,
      isBookmarked: false
    },
    {
      id: '7',
      title: 'CSS Animations and Transitions - Interactive Guide',
      excerpt: 'Create smooth and engaging animations with CSS. Learn keyframes, transitions, transforms, and performance tips.',
      author: { name: 'Tom Rodriguez' },
      publishedAt: '1 week ago',
      readTime: '28 min',
      category: 'Design',
      tags: ['CSS', 'Animation', 'Design', 'Frontend'],
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500&h=300&fit=crop',
      videoUrl: 'https://www.youtube.com/watch?v=jgw82b5Y2MU',
      views: 6543,
      isBookmarked: true
    },
    {
      id: '8',
      title: 'React Hooks Deep Dive - useState, useEffect & More',
      excerpt: 'Master React Hooks with in-depth explanations and practical examples. Learn when and how to use each hook effectively.',
      author: { name: 'Jennifer Kim' },
      publishedAt: '6 days ago',
      readTime: '50 min',
      category: 'Programming',
      tags: ['React', 'Hooks', 'JavaScript', 'Frontend'],
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&h=300&fit=crop',
      videoUrl: 'https://www.youtube.com/watch?v=TNhaISOUy6Q',
      views: 11234,
      isBookmarked: false
    },
    {
      id: '9',
      title: 'Web Performance Optimization - Speed Up Your Site',
      excerpt: 'Learn essential techniques to optimize web performance. Cover image optimization, lazy loading, code splitting, and caching.',
      author: { name: 'Carlos Martinez' },
      publishedAt: '10 days ago',
      readTime: '38 min',
      category: 'Technology',
      tags: ['Performance', 'Web Development', 'Optimization', 'Tutorial'],
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop',
      videoUrl: 'https://www.youtube.com/watch?v=AQqFZ5t8uNc',
      views: 9876,
      isBookmarked: true
    },
    {
      id: '10',
      title: 'API Design Best Practices - RESTful Services',
      excerpt: 'Design robust and scalable APIs following RESTful principles. Learn about HTTP methods, status codes, and documentation.',
      author: { name: 'Rachel Thompson' },
      publishedAt: '2 weeks ago',
      readTime: '32 min',
      category: 'Programming',
      tags: ['API', 'REST', 'Backend', 'Web Development'],
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&h=300&fit=crop',
      videoUrl: 'https://www.youtube.com/watch?v=0oXYLzuucwE',
      views: 5432,
      isBookmarked: false
    },
    {
      id: '11',
      title: 'Mobile-First Design Strategy',
      excerpt: 'Learn how to design with mobile users first. Understand responsive breakpoints, touch interactions, and mobile UX patterns.',
      author: { name: 'Sophie Brown' },
      publishedAt: '1 week ago',
      readTime: '25 min',
      category: 'Design',
      tags: ['Mobile', 'Responsive', 'UI/UX', 'Design'],
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&h=300&fit=crop',
      videoUrl: 'https://www.youtube.com/watch?v=WQUFxKCF06E',
      views: 7890,
      isBookmarked: false
    },
    {
      id: '12',
      title: 'Git and GitHub Workflow for Developers',
      excerpt: 'Master version control with Git and GitHub. Learn branching strategies, pull requests, and collaborative development workflows.',
      author: { name: 'James Wilson' },
      publishedAt: '5 days ago',
      readTime: '42 min',
      category: 'Technology',
      tags: ['Git', 'GitHub', 'Version Control', 'Tutorial'],
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=500&h=300&fit=crop',
      videoUrl: 'https://www.youtube.com/watch?v=RGOj5yH7evk',
      views: 13456,
      isBookmarked: true
    },
    {
      id: '13',
      title: 'Building Responsive Layouts with Flexbox',
      excerpt: 'Create flexible and responsive layouts using CSS Flexbox. Learn alignment, distribution, and common layout patterns.',
      author: { name: 'Nina Patel' },
      publishedAt: '8 days ago',
      readTime: '22 min',
      category: 'Design',
      tags: ['CSS', 'Flexbox', 'Layout', 'Responsive'],
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop',
      videoUrl: 'https://www.youtube.com/watch?v=JJSoEo8JSnc',
      views: 8765,
      isBookmarked: false
    },
    {
      id: '14',
      title: 'Python for Web Development - Django Basics',
      excerpt: 'Get started with Django web framework. Build your first web application with models, views, templates, and URL routing.',
      author: { name: 'Michael Chang' },
      publishedAt: '12 days ago',
      readTime: '55 min',
      category: 'Programming',
      tags: ['Python', 'Django', 'Backend', 'Web Development'],
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=500&h=300&fit=crop',
      videoUrl: 'https://www.youtube.com/watch?v=F5mRW0jo-U4',
      views: 6789,
      isBookmarked: false
    },
    {
      id: '15',
      title: 'Advanced JavaScript Concepts - Closures & Prototypes',
      excerpt: 'Deep dive into advanced JavaScript concepts. Understand closures, prototypes, scope, and the event loop.',
      author: { name: 'Anna Schmidt' },
      publishedAt: '3 days ago',
      readTime: '48 min',
      category: 'Programming',
      tags: ['JavaScript', 'Advanced', 'Closures', 'Prototypes'],
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=500&h=300&fit=crop',
      videoUrl: 'https://www.youtube.com/watch?v=Bv_5Zv5c-Ts',
      views: 9432,
      isBookmarked: true
    }
  ]);

  // Get all unique tags from posts for dynamic filtering
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach(post => {
      post.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [posts]);

  // Get all unique categories from posts for dynamic filtering  
  const allCategories = useMemo(() => {
    const categorySet = new Set<string>();
    posts.forEach(post => {
      categorySet.add(post.category);
    });
    return Array.from(categorySet).sort();
  }, [posts]);

  const filteredAndSortedPosts = useMemo(() => {
    console.log('Filtering posts with:', { searchQuery, selectedCategory, selectedTag });
    let filtered = [...posts];

    // Enhanced search functionality
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.author.name.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query)) ||
        (post.content && post.content.toLowerCase().includes(query))
      );
      console.log('After search filter:', filtered.length);
    }

    // Filter by category
    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(post => post.category === selectedCategory);
      console.log('After category filter:', filtered.length);
    }

    // Filter by tag
    if (selectedTag !== 'All Tags') {
      filtered = filtered.filter(post => post.tags.includes(selectedTag));
      console.log('After tag filter:', filtered.length);
    }

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return Date.parse('2024-01-01') - Date.parse('2024-01-02'); // Mock dates for demo
        case 'popular':
          return b.views - a.views;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'newest':
        default:
          return Date.parse('2024-01-02') - Date.parse('2024-01-01'); // Mock dates for demo
      }
    });

    console.log('Final filtered posts:', filtered.length);
    return filtered;
  }, [posts, searchQuery, selectedCategory, selectedTag, sortBy]);

  const handleCreatePost = (newPost: BlogPost) => {
    setPosts([newPost, ...posts]);
  };

  const handleBookmark = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ));
  };

  const handlePostClick = (post: BlogPost) => {
    // Handle post click for non-video posts
    if (post.type === 'external' && post.externalUrl) {
      window.open(post.externalUrl, '_blank');
    }
    console.log('Post clicked:', post);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Categories');
    setSelectedTag('All Tags');
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'All Categories' || selectedTag !== 'All Tags';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <BlogHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedTag={selectedTag}
        onTagChange={setSelectedTag}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onCreatePost={() => setIsCreateModalOpen(true)}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <main className="flex-1 space-y-6">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-accent to-primary/5 p-8 border border-primary/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/30 rounded-full blur-xl"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Video Learning Archive
                  </h1>
                </div>
                <p className="text-lg text-muted-foreground mb-4">
                  Discover amazing video tutorials and courses. Filter by tags, search topics, and bookmark your favorites!
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-background/60 rounded-full backdrop-blur-sm border">
                    <Archive className="w-4 h-4 text-primary" />
                    <span className="font-medium">{posts.length} Videos</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-background/60 rounded-full backdrop-blur-sm border">
                    <Filter className="w-4 h-4 text-primary" />
                    <span className="font-medium">{allTags.length} Tags</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <Card className="border-2 border-primary/20 bg-primary/5 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-primary" />
                      <span className="font-medium text-primary">Active filters:</span>
                    </div>
                    {searchQuery && (
                      <Badge variant="secondary" className="gap-1 bg-primary/10 hover:bg-primary/20 transition-colors">
                        <Search className="w-3 h-3" />
                        "{searchQuery}"
                      </Badge>
                    )}
                    {selectedCategory !== 'All Categories' && (
                      <Badge variant="secondary" className="bg-accent/50 hover:bg-accent transition-colors">
                        Category: {selectedCategory}
                      </Badge>
                    )}
                    {selectedTag !== 'All Tags' && (
                      <Badge variant="secondary" className="bg-accent/50 hover:bg-accent transition-colors">
                        Tag: #{selectedTag}
                      </Badge>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearAllFilters}
                      className="ml-auto hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                      Clear all
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold mb-1">
                  {searchQuery ? `Search Results for "${searchQuery}"` : 'Video Archive'}
                </h2>
                <p className="text-muted-foreground flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-full text-sm font-medium">
                    {filteredAndSortedPosts.length} {filteredAndSortedPosts.length === 1 ? 'video' : 'videos'}
                  </span>
                  {hasActiveFilters && <span>matching your filters</span>}
                </p>
              </div>
            </div>

            {/* Posts Grid */}
            {filteredAndSortedPosts.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredAndSortedPosts.map((post, index) => (
                  <div
                    key={post.id}
                    className="animate-in fade-in slide-in-from-bottom-4"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <BlogPostCard
                      post={post}
                      onBookmark={handleBookmark}
                      onClick={handlePostClick}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center border-2 border-dashed border-muted-foreground/25">
                <div className="animate-bounce">
                  <Archive className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No videos found</h3>
                <p className="text-muted-foreground mb-4">
                  {hasActiveFilters
                    ? 'Try adjusting your filters or search terms to find more videos.'
                    : 'No videos available yet. Start by adding some content!'}
                </p>
                <div className="flex gap-2 justify-center">
                  {hasActiveFilters && (
                    <Button onClick={clearAllFilters} variant="outline">
                      Clear Filters
                    </Button>
                  )}
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    Add First Video
                  </Button>
                </div>
              </Card>
            )}
          </main>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <BlogSidebar
              selectedTag={selectedTag}
              onTagChange={setSelectedTag}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              allTags={allTags}
              allCategories={allCategories}
              posts={posts}
            />
          </aside>
        </div>
      </div>

      <CreateBlogModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  );
}