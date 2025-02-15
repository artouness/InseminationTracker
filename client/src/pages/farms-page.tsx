import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Farm, Farmer, InsertFarm, insertFarmSchema } from "@shared/schema";
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
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function FarmsPage() {
  const { toast } = useToast();
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: farms } = useQuery<Farm[]>({
    queryKey: ["/api/farms"],
  });

  const { data: farmers } = useQuery<Farmer[]>({
    queryKey: ["/api/farmers"],
  });

  const form = useForm<InsertFarm>({
    resolver: zodResolver(insertFarmSchema),
    defaultValues: {
      ownerId: 0,
      address: "",
      zone: "",
      cowCount: 0,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertFarm) => {
      const res = await apiRequest("POST", "/api/farms", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/farms"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Succès",
        description: "La ferme a été ajoutée avec succès",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: InsertFarm & { id: number }) => {
      const { id, ...rest } = data;
      const res = await apiRequest("PATCH", `/api/farms/${id}`, rest);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/farms"] });
      setIsDialogOpen(false);
      setSelectedFarm(null);
      form.reset();
      toast({
        title: "Succès",
        description: "La ferme a été mise à jour avec succès",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/farms/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/farms"] });
      toast({
        title: "Succès",
        description: "La ferme a été supprimée avec succès",
      });
    },
  });

  const onSubmit = (data: InsertFarm) => {
    if (selectedFarm) {
      updateMutation.mutate({ ...data, id: selectedFarm.id });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (farm: Farm) => {
    setSelectedFarm(farm);
    form.reset(farm);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette ferme ?")) {
      deleteMutation.mutate(id);
    }
  };

  const getFarmerName = (id: number) => {
    return farmers?.find(f => f.id === id)?.fullName || "N/A";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Fermes</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setSelectedFarm(null);
              form.reset();
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une ferme
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedFarm ? "Modifier la ferme" : "Ajouter une ferme"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="ownerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Propriétaire</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un propriétaire" />
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="zone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cowCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de vaches</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  {selectedFarm ? "Mettre à jour" : "Ajouter"}
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
              <TableHead>Propriétaire</TableHead>
              <TableHead>Adresse</TableHead>
              <TableHead>Zone</TableHead>
              <TableHead>Nombre de vaches</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {farms?.map((farm) => (
              <TableRow key={farm.id}>
                <TableCell>{getFarmerName(farm.ownerId)}</TableCell>
                <TableCell>{farm.address}</TableCell>
                <TableCell>{farm.zone}</TableCell>
                <TableCell>{farm.cowCount}</TableCell>
                <TableCell className="space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(farm)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(farm.id)}
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
