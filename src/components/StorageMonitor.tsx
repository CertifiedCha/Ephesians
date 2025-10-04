import React, { useState, useEffect } from 'react';

// --- Simplified Icon Components (Replaced lucide-react for self-containment) ---
const HardDrive = ({ className }) => <span className={`mr-2 ${className}`}>💾</span>;
const AlertTriangle = ({ className }) => <span className={`mr-2 ${className}`}>⚠️</span>;
const Trash2 = ({ className }) => <span className={`mr-2 ${className}`}>🗑️</span>;
const RefreshCw = ({ className }) => <span className={`mr-2 ${className}`}>🔄</span>;

// --- Simplified UI Components (Replaced shadcn/ui for self-containment) ---
const Button = ({ children, onClick, disabled, className, variant, size }) => {
  let baseStyle = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  if (variant === "outline") {
    baseStyle += " border border-input bg-background hover:bg-accent hover:text-accent-foreground";
  } else if (variant === "ghost") {
    baseStyle += " hover:bg-accent hover:text-accent-foreground";
  } else { // Default primary style
    baseStyle += " bg-primary text-primary-foreground hover:bg-primary/90";
  }

  if (size === "sm") {
    baseStyle += " h-8 px-3 text-xs";
  } else { // Default
    baseStyle += " h-9 px-4 py-2";
  }

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${className}`}>
      {children}
    </button>
  );
};

const Card = ({ children, className }) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className }) => (
  <div className={`flex flex-col space-y-1.5 p-4 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className }) => (
  <h2 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h2>
);

const CardContent = ({ children, className }) => (
  <div className={`p-4 pt-0 ${className}`}>
    {children}
  </div>
);

const Progress = ({ value, className }) => {
  const progressColor = value > 90 ? 'bg-red-500' : value > 75 ? 'bg-yellow-500' : value > 50 ? 'bg-blue-500' : 'bg-green-500';
  return (
    <div className={`relative h-2 w-full overflow-hidden rounded-full bg-primary/20 ${className}`}>
      <div
        className={`h-full w-full flex-1 transition-all ${progressColor}`}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      ></div>
    </div>
  );
};

const Alert = ({ children, variant }) => {
  let alertStyle = "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>:not(svg)]:relative";
  if (variant === "destructive") {
    alertStyle += " border-red-500 text-red-700 bg-red-50";
  } else { // Default
    alertStyle += " border-blue-500 text-blue-700 bg-blue-50";
  }
  return <div className={alertStyle}>{children}</div>;
};

const AlertDescription = ({ children }) => <p className="text-sm [&_p]:leading-relaxed">{children}</p>;

// --- Simplified motion/react (Removed animations for self-containment) ---
const motion = {
  div: ({ children, className, ...props }) => <div className={className} {...props}>{children}</div>
};
const AnimatePresence = ({ children }) => <>{children}</>;

// --- Mock toast for sonner replacement (Removed external library for self-containment) ---
const toast = {
  success: (message) => console.log(`Toast Success: ${message}`),
  error: (message) => console.error(`Toast Error: ${message}`),
};

// --- Inlined Storage Utility Functions ---

/**
 * Safely retrieves an item from localStorage, attempting to parse JSON if applicable.
 * Clears corrupted data if parsing fails.
 * @param key The localStorage key.
 * @returns The parsed item, or null if not found or corrupted.
 */
const getSafeItem = (key) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return null;

    if ((item.startsWith('{') && item.endsWith('}')) || (item.startsWith('[') && item.endsWith(']'))) {
      return JSON.parse(item);
    }
    return item;
  } catch (e) {
      console.warn(`Corrupted localStorage data for key: "${key}". Clearing it.`, e);
      localStorage.removeItem(key);
      return null;
  }
};

/**
 * Calculates storage usage and breakdown.
 * @returns An object with used, total, percentage, and breakdown of storage.
 */
export const getStorageUsage = () => {
  let usedBytes = 0;
  let blogPostsBytes = 0;
  let userDataBytes = 0;
  let cacheTempBytes = 0;
  let otherBytes = 0;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);

    if (value !== null) {
      const itemBytes = value.length * 2;
      usedBytes += itemBytes;

      if (key?.startsWith('blogverse_')) {
        blogPostsBytes += itemBytes;
      } else if (key?.startsWith('user_') || key?.startsWith('auth_')) {
        userDataBytes += itemBytes;
      } else if (key?.includes('cache') || key?.includes('temp')) {
        cacheTempBytes += itemBytes;
      } else {
        otherBytes += itemBytes;
      }
    }
  }

  const totalBytes = 5 * 1024 * 1024;
  const percentage = (usedBytes / totalBytes) * 100;

  const totalBreakdownBytes = blogPostsBytes + userDataBytes + cacheTempBytes + otherBytes;
  const breakdown = {
    blogPosts: totalBreakdownBytes > 0 ? (blogPostsBytes / totalBreakdownBytes) * 100 : 0,
    userData: totalBreakdownBytes > 0 ? (userDataBytes / totalBreakdownBytes) * 100 : 0,
    cacheTemp: totalBreakdownBytes > 0 ? (cacheTempBytes / totalBreakdownBytes) * 100 : 0,
    other: totalBreakdownBytes > 0 ? (otherBytes / totalBreakdownBytes) * 100 : 0,
  };

  return {
    used: usedBytes,
    total: totalBytes,
    percentage: Math.min(percentage, 100),
    breakdown: breakdown,
  };
};

/**
 * Cleans up specific localStorage items.
 */
export const cleanupStorage = () => {
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (key?.includes('cache') || key?.includes('temp')) {
      localStorage.removeItem(key);
    }
  }
  console.log("Storage cleanup performed!");
};

// --- StorageMonitor Component ---
interface StorageInfo {
  used: number;
  total: number;
  percentage: number;
  breakdown: {
    blogPosts: number;
    userData: number;
    cacheTemp: number;
    other: number;
  };
}

interface StorageMonitorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StorageMonitor: React.FC<StorageMonitorProps> = ({ isOpen, onClose }) => {
  const [storageInfo, setStorageInfo] = useState<StorageInfo>({
    used: 0,
    total: 0,
    percentage: 0,
    breakdown: { blogPosts: 0, userData: 0, cacheTemp: 0, other: 0 },
  });
  const [isCleaningUp, setIsCleaningUp] = useState(false);

  const updateStorageInfo = () => {
    const info = getStorageUsage();
    setStorageInfo(info);
  };

  useEffect(() => {
    if (isOpen) {
      updateStorageInfo();
      const interval = setInterval(updateStorageInfo, 2000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const handleCleanup = async () => {
    setIsCleaningUp(true);
    try {
      cleanupStorage();
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateStorageInfo();
      toast.success('Storage cleanup completed!');
    } catch (error) {
      console.error("Cleanup error:", error);
      toast.error('Failed to cleanup storage');
    } finally {
      setIsCleaningUp(false);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStorageStatus = () => {
    if (storageInfo.percentage > 90) return { color: 'destructive', status: 'Critical' };
    if (storageInfo.percentage > 75) return { color: 'warning', status: 'High' };
    if (storageInfo.percentage > 50) return { color: 'primary', status: 'Medium' };
    return { color: 'success', status: 'Good' };
  };

  const storageStatus = getStorageStatus();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="storage-monitor-modal"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="bg-white rounded-lg shadow-lg border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <HardDrive className="w-5 h-5 mr-2" />
                <span>Storage Monitor</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Storage Used</span>
                  <span className={`font-medium ${
                    storageStatus.color === 'destructive' ? 'text-red-600' :
                    storageStatus.color === 'warning' ? 'text-yellow-600' :
                    'text-gray-700'
                  }`}>
                    {storageStatus.status}
                  </span>
                </div>
                <Progress
                  value={storageInfo.percentage}
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{formatBytes(storageInfo.used)} used</span>
                  <span>{formatBytes(storageInfo.total)} total</span>
                </div>
              </div>
              {storageInfo.percentage > 75 && (
                <Alert variant={storageInfo.percentage > 90 ? "destructive" : "default"}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {storageInfo.percentage > 90
                      ? "Storage critically low! Some features may not work properly."
                      : "Storage is running low. Consider cleaning up old data."
                    }
                  </AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Storage Breakdown</h4>
                <div className="space-y-1 text-xs text-gray-700">
                  <div className="flex justify-between"><span>Blog Posts</span><span>{storageInfo.breakdown.blogPosts.toFixed(1)}%</span></div>
                  <div className="flex justify-between"><span>User Data</span><span>{storageInfo.breakdown.userData.toFixed(1)}%</span></div>
                  <div className="flex justify-between"><span>Cache & Temp</span><span>{storageInfo.breakdown.cacheTemp.toFixed(1)}%</span></div>
                  <div className="flex justify-between"><span>Other</span><span>{storageInfo.breakdown.other.toFixed(1)}%</span></div>
                </div>
              </div>
              <div className="flex space-x-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={updateStorageInfo}
                  className="flex items-center"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  <span>Refresh</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCleanup}
                  disabled={isCleaningUp}
                  className="flex items-center"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  <span>{isCleaningUp ? 'Cleaning...' : 'Cleanup'}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="ml-auto"
                >
                  Close
                </Button>
              </div>
              <div className="text-xs text-gray-500 pt-2 border-t mt-4">
                <p><strong>Tips:</strong></p>
                <ul className="list-disc list-inside space-y-1 mt-1">
                  <li>Blog content is automatically compressed</li>
                  <li>Old temporary data is cleaned regularly</li>
                  <li>Consider deleting unused blog posts</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StorageMonitor;