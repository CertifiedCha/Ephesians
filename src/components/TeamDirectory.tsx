import { useState, useMemo, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDrop } from 'react-dnd';

// Your existing working imports
import { TeamMemberCard } from './TeamMemberCard';
import { TeamMemberModal } from './TeamMemberModal';
import { SearchAndFilters, SortOption, ViewMode } from './SearchAndFilters';
import { TeamIntroduction } from './TeamIntroduction';
import { ThemeToggle } from './ThemeToggle';
import { TeamMember } from '../data/teamMembers';
import { cn } from './ui/utils';

// New imports for the navbar and mobile menu functionality
import { Button } from './ui/button'; 
import { Menu, X } from 'lucide-react';

interface TeamDirectoryProps {
  members: TeamMember[];
}

export function TeamDirectory({ members: initialMembers }: TeamDirectoryProps) {
  const [members, setMembers] = useState(initialMembers);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // State for the mobile navigation menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleDepartmentToggle = useCallback((department: string) => {
    setSelectedDepartments(prev => 
      prev.includes(department)
        ? prev.filter(d => d !== department)
        : [...prev, department]
    );
  }, []);

  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    setMembers(prev => {
      const newMembers = [...prev];
      const dragCard = newMembers[dragIndex];
      newMembers.splice(dragIndex, 1);
      newMembers.splice(hoverIndex, 0, dragCard);
      return newMembers;
    });
  }, []);

  const filteredAndSortedMembers = useMemo(() => {
    let filtered = members.filter(member => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          member.name.toLowerCase().includes(searchLower) ||
          member.role.toLowerCase().includes(searchLower) ||
          member.department.toLowerCase().includes(searchLower) ||
          member.skills.some(skill => skill.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      // Department filter
      if (selectedDepartments.length > 0 && !selectedDepartments.includes(member.department)) {
        return false;
      }

      // Available filter
      if (showAvailableOnly && !member.available) {
        return false;
      }

      // Favorites filter
      if (showFavoritesOnly && !member.favorite) {
        return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'role':
          return a.role.localeCompare(b.role);
        case 'experience':
          return b.experience - a.experience;
        default:
          return 0;
      }
    });

    return filtered;
  }, [members, searchTerm, selectedDepartments, showAvailableOnly, showFavoritesOnly, sortBy]);

  return (
    <DndProvider backend={HTML5Backend}>
      {/* Professional Navbar */}
      <nav className="sticky top-0 z-50 w-full bg-card shadow-lg dark:bg-card-foreground/70 border-b border-border/40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo/Site Title */}
          <div className="flex items-center">
            <span className="text-2xl font-bold text-primary dark:text-primary-foreground font-display transition-colors duration-200">
              Team Directory
            </span>
          </div>

          {/* Desktop Navigation & Theme Toggle */}
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            
          </div>
        </div>

        {/* Mobile Menu Content (Animated for smoother UX) */}
        <div className={cn(
          "md:hidden absolute w-full bg-card dark:bg-card-foreground/90 shadow-lg transition-all duration-300 ease-in-out overflow-hidden",
          isMobileMenuOpen ? "max-h-60 opacity-100 py-4" : "max-h-0 opacity-0 py-0" // Animation for open/close
        )}>
          <div className="container mx-auto px-4 flex flex-col space-y-3">
            <a href="#" className="block py-2 text-foreground hover:text-primary dark:hover:text-primary transition-colors duration-200 font-medium text-lg" onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </a>
            <a href="#introduction" className="block py-2 text-foreground hover:text-primary dark:hover:text-primary transition-colors duration-200 font-medium text-lg" onClick={() => setIsMobileMenuOpen(false)}>
              Spotlight
            </a>
            <a href="#members-grid" className="block py-2 text-foreground hover:text-primary dark:hover:text-primary transition-colors duration-200 font-medium text-lg" onClick={() => setIsMobileMenuOpen(false)}>
              All Members
            </a>
          </div>
        </div>
      </nav>

      {/* Main content of the Team Directory */}
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <p className="text-muted-foreground font-light text-lg leading-relaxed">
              Discover and connect with our talented team members
            </p>
          </div>

          <TeamIntroduction 
            members={members}
            onMemberClick={setSelectedMember}
          />

          <SearchAndFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedDepartments={selectedDepartments}
            onDepartmentToggle={handleDepartmentToggle}
            showAvailableOnly={showAvailableOnly}
            onAvailableToggle={setShowAvailableOnly}
            showFavoritesOnly={showFavoritesOnly}
            onFavoritesToggle={setShowFavoritesOnly}
            sortBy={sortBy}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          <TeamMemberGrid
            members={filteredAndSortedMembers}
            onMemberClick={setSelectedMember}
            onMoveCard={moveCard}
            viewMode={viewMode}
          />

          <TeamMemberModal
            member={selectedMember}
            open={!!selectedMember}
            onClose={() => setSelectedMember(null)}
          />
        </div>
      </div>
    </DndProvider>
  );
}

// TeamMemberGrid component definition (remains unchanged)
interface TeamMemberGridProps {
  members: TeamMember[];
  onMemberClick: (member: TeamMember) => void;
  onMoveCard: (dragIndex: number, hoverIndex: number) => void;
  viewMode: ViewMode;
}

function TeamMemberGrid({ members, onMemberClick, onMoveCard, viewMode }: TeamMemberGridProps) {
  const [, drop] = useDrop({
    accept: 'team-member',
    drop: () => {},
  });

  if (members.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No team members found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div ref={drop} className="w-full">
      <div className="mb-4 text-sm text-muted-foreground">
        Showing {members.length} team member{members.length !== 1 ? 's' : ''}
      </div>
      
      <div className={cn(
        viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
          : "space-y-3"
      )}>
        {members.map((member, index) => (
          <TeamMemberCard
            key={member.id}
            member={member}
            onClick={() => onMemberClick(member)}
            isListView={viewMode === 'list'}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
