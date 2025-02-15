import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/use-auth";
import {
  Home,
  Users,
  Building2,
  Baby,
  Syringe,
  User,
  Settings,
  LogOut,
} from "lucide-react";

const sidebarItems = [
  { icon: Home, label: "Accueil", href: "/" },
  { icon: Users, label: "Éleveurs", href: "/farmers" },
  { icon: Building2, label: "Fermes", href: "/farms" },
  { icon: Baby, label: "Vaches", href: "/cows" },
  { icon: Syringe, label: "Insémination", href: "/insemination" },
];

const bottomItems = [
  { icon: User, label: "Profile", href: "/profile" },
  { icon: Settings, label: "Paramètres", href: "/settings" },
];

export function Sidebar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  if (!user) return null;

  return (
    <div className="w-64 min-h-screen bg-sidebar border-r border-sidebar-border">
      <div className="flex flex-col h-full">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-sidebar-foreground">Gestion Bétail</h1>
        </div>

        <ScrollArea className="flex-1 px-4">
          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-2",
                    location === item.href && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        </ScrollArea>

        <div className="p-4 border-t border-sidebar-border">
          <div className="space-y-2">
            {bottomItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-2",
                    location === item.href && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Button>
              </Link>
            ))}
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-destructive"
              onClick={() => logoutMutation.mutate()}
            >
              <LogOut className="w-5 h-5" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}