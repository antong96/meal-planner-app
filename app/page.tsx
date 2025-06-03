import { useAuth } from "@/components/auth-provider";
import { LandingPage } from "@/components/landing-page";
import { Dashboard } from "@/components/dashboard";

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12"><LoadingSpinner /></div>
      </div>
    );
  }

  return user ? <Dashboard /> : <LandingPage />;
}

import { LoadingSpinner } from "@/components/ui/loading-spinner"; 