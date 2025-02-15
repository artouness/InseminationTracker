import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import HomePage from "@/pages/home-page";
import FarmersPage from "@/pages/farmers-page";
import FarmsPage from "@/pages/farms-page";
import CowsPage from "@/pages/cows-page";
import InseminationPage from "@/pages/insemination-page";
import { ProtectedRoute } from "./lib/protected-route";
import { Sidebar } from "@/components/layout/sidebar";

function Router() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <Switch>
          <Route path="/auth" component={AuthPage} />
          <ProtectedRoute path="/" component={HomePage} />
          <ProtectedRoute path="/farmers" component={FarmersPage} />
          <ProtectedRoute path="/farms" component={FarmsPage} />
          <ProtectedRoute path="/cows" component={CowsPage} />
          <ProtectedRoute path="/insemination" component={InseminationPage} />
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
