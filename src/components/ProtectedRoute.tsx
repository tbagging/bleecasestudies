import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  
  console.log('ProtectedRoute - isLoading:', isLoading, 'user:', user?.email, 'location:', location.pathname);

  if (isLoading) {
    console.log('ProtectedRoute: Still loading...');
    return (
      <div className="min-h-screen grid place-items-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!user) {
    console.log('ProtectedRoute: No user, redirecting to /auth');
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  // Quick email-based guard for admin access
  const allowedEmails = new Set(["tomer@blee.pro"]);
  if (!allowedEmails.has(user.email ?? "")) {
    console.log('ProtectedRoute: User not authorized, redirecting to home');
    return <Navigate to="/" replace />;
  }

  console.log('ProtectedRoute: User authorized, rendering children');

  return <>{children}</>;
};

export default ProtectedRoute;
