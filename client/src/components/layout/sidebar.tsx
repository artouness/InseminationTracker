import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/use-auth";
import {
  Menu,
  Home,
  Users,
  Building2,
  Baby,
  Syringe,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const [location] = useLocation();
  const { logoutMutation } = useAuth();

  return (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-sidebar-foreground">Gestion Bétail</h1>
      </div>

      <ScrollArea className="flex-1 px-4">
        <nav className="space-y-2">
          {sidebarItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              onClick={() => onNavigate?.()}
            >
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
            <Link 
              key={item.href} 
              href={item.href}
              onClick={() => onNavigate?.()}
            >
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
            onClick={() => {
              onNavigate?.();
              logoutMutation.mutate();
            }}
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </Button>
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!user) return null;

  return (
    <>
      {isMobile && (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-4 left-4 z-50 block md:hidden"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-80">
            <SidebarContent onNavigate={() => setIsOpen(false)} />
          </SheetContent>
        </Sheet>
      )}
      <div className="hidden md:block w-64 min-h-screen bg-sidebar border-r border-sidebar-border">
        <SidebarContent />
      </div>
    </>
  );
}