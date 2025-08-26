import React, { useState, useEffect } from 'react';
import { AlertTriangle, HardDrive, Trash2, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { motion, AnimatePresence } from 'motion/react';
import { getStorageUsage, cleanupStorage } from '../utils/storage'; // Assuming storage.js is in utils
import { toast } from 'sonner'; // Corrected import for sonner

// Define the interface for the storage information, now including breakdown
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
  // Initialize storageInfo with a default breakdown
  const [storageInfo, setStorageInfo] = useState<StorageInfo>({
    used: 0,
    total: 0,
    percentage: 0,
    breakdown: { blogPosts: 0, userData: 0, cacheTemp: 0, other: 0 },
  });
  const [isCleaningUp, setIsCleaningUp] = useState(false);

  // Function to update storage information
  const updateStorageInfo = () => {
    const info = getStorageUsage();
    setStorageInfo(info);
  };

  // Effect to update storage info when the monitor is open
  useEffect(() => {
    if (isOpen) {
      updateStorageInfo();
      // Set up an interval to refresh storage info periodically
      const interval = setInterval(updateStorageInfo, 2000);
      return () => clearInterval(interval); // Clear interval on unmount or when closed
    }
  }, [isOpen]);

  // Handler for cleanup action
  const handleCleanup = async () => {
    setIsCleaningUp(true);
    try {
      cleanupStorage(); // Call the cleanup utility function
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate cleanup time
      updateStorageInfo(); // Refresh storage info after cleanup
      toast.success('Storage cleanup completed!');
    } catch (error) {
      console.error("Cleanup error:", error);
      toast.error('Failed to cleanup storage');
    } finally {
      setIsCleaningUp(false);
    }
  };

  // Helper function to format bytes into readable units
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Determines the storage status (Good, Medium, High, Critical) based on percentage
  const getStorageStatus = () => {
    if (storageInfo.percentage > 90) return { color: 'destructive', status: 'Critical' };
    if (storageInfo.percentage > 75) return { color: 'warning', status: 'High' };
    if (storageInfo.percentage > 50) return { color: 'primary', status: 'Medium' };
    return { color: 'success', status: 'Good' };
  };

  const storageStatus = getStorageStatus();

  return (
    <AnimatePresence>
      {isOpen && ( // Conditionally render the motion.div with a key for exit animations
        <motion.div
          key="storage-monitor-modal" // Key is essential for AnimatePresence exit animations
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // Close modal when clicking outside
        >
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
          >
            <Card className="bg-card/95 backdrop-blur-lg border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <HardDrive className="w-5 h-5" />
                  <span>Storage Monitor</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Storage Usage */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Storage Used</span>
                    <span className={`font-medium ${
                      storageStatus.color === 'destructive' ? 'text-destructive' :
                      storageStatus.color === 'warning' ? 'text-yellow-600' :
                      'text-foreground'
                    }`}>
                      {storageStatus.status}
                    </span>
                  </div>
                  
                  <Progress 
                    value={storageInfo.percentage} 
                    className="h-2"
                  />
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatBytes(storageInfo.used)} used</span>
                    <span>{formatBytes(storageInfo.total)} total</span>
                  </div>
                </div>

                {/* Warning Alert */}
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

                {/* Storage Breakdown */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Storage Breakdown</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Blog Posts</span>
                      <span>{storageInfo.breakdown.blogPosts.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>User Data</span>
                      <span>{storageInfo.breakdown.userData.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cache & Temp</span>
                      <span>{storageInfo.breakdown.cacheTemp.toFixed(1)}%</span>
                    </div>
                     <div className="flex justify-between">
                      <span>Other</span>
                      <span>{storageInfo.breakdown.other.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={updateStorageInfo}
                    className="flex items-center space-x-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Refresh</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCleanup}
                    disabled={isCleaningUp}
                    className="flex items-center space-x-1"
                  >
                    <Trash2 className="w-3 h-3" />
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

                {/* Tips */}
                <div className="text-xs text-muted-foreground pt-2 border-t">
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
      )}
    </AnimatePresence>
  );
};

export default StorageMonitor;
