import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
      
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <User className="w-8 h-8" />
          <div>
            <CardTitle>Informations du compte</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Nom d'utilisateur
            </label>
            <p className="text-lg font-medium">{user?.username}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
