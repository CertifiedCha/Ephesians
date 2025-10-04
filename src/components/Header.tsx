import React, { useState } from 'react';
import { Search, Moon, Sun, Plus, User, LogOut, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { ProfileModal } from './ProfileModal';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

// Define props for the Header component
interface HeaderProps {
  onSearch: (query: string) => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
  onShowAuth: (type: 'login' | 'signup') => void;
  onShowCreateBlog: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

// --- FIX 1: SIMPLIFIED HAMBURGER ICON ---
// Removed the `isDarkMode` prop. We'll use Tailwind's `dark:` variant instead.
// --- TEMPORARY DEBUGGING COMPONENT ---
// This uses inline styles to override any conflicting global CSS.
const AnimatedHamburger: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      width: '40px',
      height: '40px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '5px', // Approximates space-y-1
    }}
  >
    <span
      style={{
        height: '2px',
        width: '24px',
        backgroundColor: '#054dc1ff ', // Hardcoded to black
        display: 'block',
        borderRadius: '9999px',
      }}
    />
    <span
      style={{
        height: '2px',
        width: '24px',
        backgroundColor: '#054dc1ff ', // Hardcoded to black
        display: 'block',
        borderRadius: '9999px',
      }}
    />
    <span
      style={{
        height: '2px',
        width: '24px',
        backgroundColor: '#054dc1ff ', // Hardcoded to black
        display: 'block',
        borderRadius: '9999px',
      }}
    />
  </button>
);


export const Header: React.FC<HeaderProps> = ({
  onSearch,
  onToggleTheme,
  isDarkMode,
  onShowAuth,
  onShowCreateBlog,
  onToggleSidebar,
  isSidebarOpen,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const { user, logout } = useAuth();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <motion.header
      // Added `relative` here to act as the positioning context for the absolute search bar
      className="relative sticky top-0 left-0 right-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60
                 flex items-center justify-between h-16 px-4"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      {/* LEFT SECTION: Animated Hamburger Menu Button + Logo */}
      <div className="flex items-center gap-x-2">
        <motion.div
          className="z-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* We no longer need to pass `isDarkMode` here */}
          <AnimatedHamburger isOpen={isSidebarOpen} onClick={onToggleSidebar} />
        </motion.div>

        <motion.div
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <motion.div
            className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center"
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <span className="text-white font-bold text-lg">🐬</span>
          </motion.div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
            Ephesians Blog
          </h1>
        </motion.div>
      </div>

      {/* --- FIX 2: PERFECTLY CENTERED SEARCH BAR ---
        - `absolute left-1/2 -translate-x-1/2`: This is the key. It positions the element's center point
          at the center of the parent (`motion.header`), ensuring it's always in the middle.
        - `w-full max-w-md`: Ensures it doesn't overflow on smaller screens.
        - `hidden md:block`: Hides the search bar on small screens to prevent overlap with other icons,
          a common and clean responsive pattern.
      */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-full max-w-md px-4 hidden md:block"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Search posts, authors, topics..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2 w-full bg-muted/50 border-border/50 focus:bg-background focus:border-primary/50 transition-all duration-200"
          />
          {searchQuery && (
            <motion.button
              onClick={() => {
                setSearchQuery('');
                onSearch('');
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ×
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* RIGHT SECTION: Actions */}
      <div className="flex items-center space-x-2">
        {/* Theme Toggle */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleTheme}
            className="w-9 h-9 rounded-full"
          >
            <motion.div
              animate={{ rotate: isDarkMode ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </motion.div>
          </Button>
        </motion.div>

        {/* Create Post Button (Desktop) */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={onShowCreateBlog}
            className="playful-button hidden sm:flex items-center space-x-2 px-4 py-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create</span>
          </Button>
        </motion.div>

        {/* Mobile Create Button */}
        <motion.div
          className="sm:hidden"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={onShowCreateBlog}
            size="sm"
            className="w-9 h-9 rounded-full bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </motion.div>

        {/* User Menu / Auth Buttons */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.username} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{user.username}</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowProfile(true)}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowProfile(true)}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onShowAuth('login')}
              >
                Log in
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="sm"
                onClick={() => onShowAuth('signup')}
                className="playful-button"
              >
                Sign up
              </Button>
            </motion.div>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <ProfileModal
          isOpen={showProfile}
          onClose={() => setShowProfile(false)}
        />
      )}
    </motion.header>
  );
};