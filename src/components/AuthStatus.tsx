import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { CheckCircle, XCircle, Clock, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const AuthStatus = () => {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of the admin panel."
      });
    } catch (error) {
      toast({
        title: "Logout error",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <Badge variant="secondary" className="flex items-center gap-2">
        <Clock className="w-3 h-3" />
        Loading auth...
      </Badge>
    );
  }

  if (!user) {
    return (
      <Badge variant="destructive" className="flex items-center gap-2">
        <XCircle className="w-3 h-3" />
        Not authenticated
      </Badge>
    );
  }

  const isAdmin = user.email === 'tomer@blee.pro';

  return (
    <div className="flex items-center gap-3">
      <Badge 
        variant={isAdmin ? "default" : "secondary"} 
        className="flex items-center gap-2"
      >
        <CheckCircle className="w-3 h-3" />
        {user.email} {isAdmin && "(Admin)"}
      </Badge>
      <Button
        variant="outline"
        size="sm"
        onClick={handleLogout}
        className="flex items-center gap-2"
      >
        <LogOut className="w-3 h-3" />
        Logout
      </Button>
    </div>
  );
};