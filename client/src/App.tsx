import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import HomePage from "@/pages/home-page";
import FarmersPage from "@/pages/farmers-page";
import FarmsPage from "@/pages/farms-page";
import CowsPage from "@/pages/cows-page";
import InseminationPage from "@/pages/insemination-page";
import ProfilePage from "@/pages/profile-page";
import SettingsPage from "@/pages/settings-page";
import { Sidebar } from "@/components/layout/sidebar";

function Router() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Switch>
        <Route path="/auth" component={AuthPage} />
        <Route>
          <AuthPage />
        </Route>
      </Switch>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-4 md:p-8">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/farmers" component={FarmersPage} />
          <Route path="/farms" component={FarmsPage} />
          <Route path="/cows" component={CowsPage} />
          <Route path="/insemination" component={InseminationPage} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/settings" component={SettingsPage} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;