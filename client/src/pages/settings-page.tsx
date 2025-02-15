import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Bell, Shield } from "lucide-react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [security, setSecurity] = useState(true);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
      
      <div className="grid gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Bell className="w-6 h-6" />
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Activer les notifications</Label>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Shield className="w-6 h-6" />
            <CardTitle>Sécurité</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Label htmlFor="security">Authentification à deux facteurs</Label>
              <Switch
                id="security"
                checked={security}
                onCheckedChange={setSecurity}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
