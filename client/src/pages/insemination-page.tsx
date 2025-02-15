import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Act, Cow, Farmer, InsertAct, insertActSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Trash2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function InseminationPage() {
  const { toast } = useToast();
  const [selectedFarmer, setSelectedFarmer] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: farmers } = useQuery<Farmer[]>({
    queryKey: ["/api/farmers"],
  });

  const { data: cows, isLoading: cowsLoading } = useQuery<Cow[]>({
    queryKey: ["/api/cows", selectedFarmer],
    enabled: !!selectedFarmer,
  });

  const { data: acts } = useQuery<Act[]>({
    queryKey: ["/api/acts"],
  });

  const form = useForm<InsertAct>({
    resolver: zodResolver(insertActSchema),
    defaultValues: {
      inseminationDate: new Date().toISOString().split('T')[0],
      nationalId: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertAct) => {
      const res = await apiRequest("POST", "/api/acts", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/acts"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Succès",
        description: "L'acte d'insémination a été ajouté avec succès",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/acts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/acts"] });
      toast({
        title: "Succès",
        description: "L'acte d'insémination a été supprimé avec succès",
      });
    },
  });

  const onSubmit = (data: InsertAct) => {
    createMutation.mutate(data);
  };

  const handleDelete = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet acte d'insémination ?")) {
      deleteMutation.mutate(id);
    }
  };

  const getCowDetails = (nationalId: string) => {
    const cow = cows?.find(c => c.nationalId === nationalId);
    if (!cow) return "N/A";
    return `${cow.breed} (${cow.nationalId})`;
  };

  const getFarmerName = (nationalId: string) => {
    const cow = cows?.find(c => c.nationalId === nationalId);
    if (!cow) return "N/A";
    return farmers?.find(f => f.id === cow.ownerId)?.fullName || "N/A";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Gestion des Actes d'Insémination
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              form.reset();
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un acte
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un acte d'insémination</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="inseminationDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date d'insémination</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormItem>
                    <FormLabel>Éleveur</FormLabel>
                    <Select
                      onValueChange={(value) => setSelectedFarmer(Number(value))}
                      value={selectedFarmer?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un éleveur" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {farmers?.map((farmer) => (
                          <SelectItem key={farmer.id} value={farmer.id.toString()}>
                            {farmer.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>

                  <FormField
                    control={form.control}
                    name="nationalId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vache</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={!selectedFarmer || cowsLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={
                                !selectedFarmer 
                                  ? "Sélectionnez d'abord un éleveur" 
                                  : cowsLoading 
                                    ? "Chargement..." 
                                    : "Sélectionner une vache"
                              } />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {cows?.filter(cow => cow.ownerId === selectedFarmer).map((cow) => (
                              <SelectItem key={cow.nationalId} value={cow.nationalId}>
                                {`${cow.breed} (${cow.nationalId})`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Ajouter l'acte
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date d'insémination</TableHead>
              <TableHead>Éleveur</TableHead>
              <TableHead>Vache</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {acts?.map((act) => (
              <TableRow key={act.id}>
                <TableCell>
                  {new Date(act.inseminationDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{getFarmerName(act.nationalId)}</TableCell>
                <TableCell>{getCowDetails(act.nationalId)}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(act.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
