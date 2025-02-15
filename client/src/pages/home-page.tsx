import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Baby, Users, Building2, Activity } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function HomePage() {
  const { user } = useAuth();

  const { data: farmers } = useQuery<number>({ 
    queryKey: ["/api/farmers/count"]
  });

  const { data: farms } = useQuery<number>({ 
    queryKey: ["/api/farms/count"] 
  });

  const { data: cows } = useQuery<number>({ 
    queryKey: ["/api/cows/count"]
  });

  const { data: acts } = useQuery<number>({ 
    queryKey: ["/api/acts/count"]
  });

  const stats = [
    {
      title: "Total Éleveurs",
      value: farmers || 0,
      icon: Users,
      description: "Éleveurs enregistrés"
    },
    {
      title: "Total Fermes",
      value: farms || 0,
      icon: Building2,
      description: "Fermes gérées"
    },
    {
      title: "Total Vaches",
      value: cows || 0,
      icon: Baby,
      description: "Vaches suivies"
    },
    {
      title: "Total Actes",
      value: acts || 0,
      icon: Activity,
      description: "Actes d'insémination"
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Bienvenue, {user?.username}
        </h1>
        <p className="text-muted-foreground">
          Voici un aperçu de vos activités
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}