import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw, Clock, AlertCircle } from "lucide-react";

interface SyncStatusProps {
  caseStudies: any[];
  updateCaseStudies: (studies: any[]) => Promise<void>;
}

export const SyncStatus = ({ caseStudies, updateCaseStudies }: SyncStatusProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [supabaseCount, setSupabaseCount] = useState<number>(0);
  const [showSyncPrompt, setShowSyncPrompt] = useState(false);

  const isAdmin = user?.email === 'tomer@blee.pro';

  // Check Supabase count on load
  useEffect(() => {
    const checkSupabaseCount = async () => {
      try {
        const { count, error } = await supabase
          .from('case_studies')
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.error('Failed to check Supabase count:', error);
          return;
        }
        
        setSupabaseCount(count || 0);
        
        // Show sync prompt if admin and Supabase is empty but we have local data
        if (isAdmin && (count || 0) === 0 && caseStudies.length > 0) {
          setShowSyncPrompt(true);
        }
      } catch (error) {
        console.error('Error checking Supabase count:', error);
      }
    };

    checkSupabaseCount();
  }, [isAdmin, caseStudies.length]);

  // Load last sync time from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('lastSyncTime');
    if (stored) {
      setLastSyncTime(new Date(stored));
    }
  }, []);

  const handleSync = async () => {
    if (!isAdmin) {
      toast({
        title: "Permission denied",
        description: "Only admin can sync case studies to Supabase.",
        variant: "destructive"
      });
      return;
    }

    setIsSyncing(true);
    setShowSyncPrompt(false);

    try {
      await updateCaseStudies(caseStudies);
      
      const now = new Date();
      setLastSyncTime(now);
      localStorage.setItem('lastSyncTime', now.toISOString());
      
      // Update Supabase count
      setSupabaseCount(caseStudies.length);
      
      toast({
        title: "Sync successful",
        description: `${caseStudies.length} case studies synced to Supabase.`,
      });
    } catch (error) {
      console.error('Sync failed:', error);
      
      let errorMessage = "Failed to sync to Supabase.";
      if (error instanceof Error) {
        if (error.message.includes('permission')) {
          errorMessage = "Permission denied. Make sure you're signed in as admin.";
        } else if (error.message.includes('network')) {
          errorMessage = "Network error. Check your connection.";
        }
      }
      
      toast({
        title: "Sync failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {showSyncPrompt && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-md">
          <AlertCircle className="w-4 h-4" />
          <span>No case studies in Supabase yet. Sync now?</span>
          <Button size="sm" onClick={handleSync} disabled={isSyncing}>
            Sync Now
          </Button>
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleSync}
          disabled={isSyncing || !isAdmin}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Syncing...' : 'Sync all to Supabase'}
        </Button>
        
        <Badge variant="secondary" className="flex items-center gap-1">
          Supabase: {supabaseCount} | Local: {caseStudies.length}
        </Badge>
        
        {lastSyncTime && (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Last synced: {lastSyncTime.toLocaleTimeString()}
          </Badge>
        )}
      </div>
    </div>
  );
};