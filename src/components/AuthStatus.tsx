import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export const AuthStatus = () => {
  const { user, isLoading } = useAuth();

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
    <Badge 
      variant={isAdmin ? "default" : "secondary"} 
      className="flex items-center gap-2"
    >
      <CheckCircle className="w-3 h-3" />
      {user.email} {isAdmin && "(Admin)"}
    </Badge>
  );
};